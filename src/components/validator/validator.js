import {type, extend, isPromise} from './utils'
import {ruleFn} from './rules'

export default {
    name: 'leo-validator',
    render(h){
        return h(this.tag || 'span', null, this.$slots.default || [])
    },
    data(){
        return Object.freeze({
            initFormsData: {}
        })
    },
    props: {
        forms: {
            type: Array,
            required: true,
            'default': function() {
                return [
                    {
                        key: '',
                        value: '',
                        rules: [
                           // {
                           //     rule: 'required', tip: '请输入活动名称',
                           // },
                           // {
                           //     rule: (value, rule, item, cb) => {
                           //         item.msg = ''
                           //         setTimeout(() => {
                           //             cb(() => {
                           //                 item.state = 1
                           //                 item.msg = 'wahahahahh'
                           //             })
                           //         }, 1000)
                           //     }
                           // }
                        ],//必须调用cb
                        state: 0,//0: 没有验证过, 1: 通过, 2: 不通过, 3: 验证中
                        msg: '',
                        deep: false,//value是对象时候 true
                    }
                ]
            }
        },
        tag: {
            type: String,
            'default': 'span'
        }
    },
    watch: {
        forms(){
            if(this.leoFormInit) {
                this.initForms()
                this.addAllWatch()
            }
        }
    },
    destroyed(){
        this.removeAllWatch()
    },
    methods: {
        initForm(){
            if(!this.leoFormInit) {
                this.initForms()
                this.addAllWatch()
                this.leoFormInit = true
            }
        },
        getFormData(){
            const data = {}, forms = this.forms
            for(let val of forms) {
                data[val.key] = this.getItemValue(val.value)
            }
            return data
        },
        addAllWatch(){
            this.forms.forEach((item, i) => {
                item.__unwatch && item.__unwatch()
                item.__unwatch = this.$watch(`forms.${i}.value`, (newVal, oldVal) => {
                    if(item.__enable) {
                        this.validateField(item)
                    }
                }, {
                    deep: !!item.deep
                })
            })
        },
        getItemValue(value){
            if(typeof value !== 'object') {
                return value
            }else {
                const dest = Array.isArray(value) ? [] : {}
                return extend(true, dest, value)
            }
        },
        setItemValue(items, value){
            const src = items.value
            if(typeof src !== 'object') {
                items.value = value
            }else {
                extend(true, src, value)
            }
        },
        initForms(){
            const initFormsData = this.initFormsData
            this.forms.forEach((item, i) => {
                if(!initFormsData[item.key]) {
                    initFormsData[item.key] = {
                        value: this.getItemValue(item.value),
                        msg: item.msg
                    }
                }
                item.state = 0
                item.__enable = true
                item.__promiseHash = {}
            })
        },
        resetFields(){
            if(!this.leoFormInit) {
                throw new Error('请初始化')
            }
            this.forms.forEach((item, i) => {
                const initItem = this.initFormsData[item.key]
                if(initItem) {
                    item.__enable = false
                    this.setItemValue(item, initItem.value)
                    item.msg = initItem.msg
                    this.$nextTick(() => {
                        item.__enable = true
                    })
                }
                item.state = 0
                item.__promiseHash = {}
            })
        },
        removeAllWatch(){
            this.forms.forEach((item, i) => {
                item.__unwatch && item.__unwatch()
                item.__promiseHash = null
            })
        },
        removeField(items){
            const arr = Array.isArray(items) ? items : [items]
            arr.forEach((item) => {
                const forms = this.forms
                const index = forms.indexOf(item)
                if(index > -1) {
                    item.__unwatch && item.__unwatch()
                    forms.splice(index, 1)
                    item.__promiseHash = null
                    delete this.initFormsData[item.key]
                }
            })
        },
        validate(){
            if(!this.leoFormInit) {
                return Promise.resolve(new Error('请初始化'))
            }
            const promises = this.forms.map((item, i) => {
                const res = this.validateField(item)
                return isPromise(res) ? res : Promise.resolve(res)
            })
            return Promise.all(promises).then(() => {
                return this.getResult()
            })
        },
        getResult(){
            const forms = this.forms
            const result = {
                valid: true,
                msgs: [],
                form: {}
            }
            for(let form of forms) {
                if(form.state > 1) {
                    result.valid = false
                    result.msgs.push(form.msg)
                }
                result.form[form.key] = {
                    value: this.getItemValue(form.value),
                    msg: form.msg
                }
            }
            return result
        },
        validateOne(item, rule){
            let fn
            if(type(rule) === 'function') {
                fn = rule
            }else {
                let ruleName
                if(rule.rule) {
                    ruleName = rule.rule
                }
                if(typeof ruleName === 'string' && typeof ruleFn[ruleName] === 'function') {
                    fn = ruleFn[ruleName]
                }else if(type(ruleName) === 'function') {
                    fn = ruleName
                }
            }

            if(fn) {
                return new Promise((resolve, reject) => {
                    let id
                    if(item.__promiseHash) {
                        id = Symbol()
                        item.__promiseHash[id] = true
                    }
                    item.state = 3
                    fn(item.value, rule, item, (cb) => {
                        if(item.__promiseHash && item.__promiseHash[id]) {
                            cb && cb()
                            delete item.__promiseHash[id]
                        }
                        resolve()
                        id = null
                    })
                })
            }
        },
        async validateField(item) {
            const rules = item.rules
            if(!rules) {
                return
            }
            if(Array.isArray(rules)) {
                const len = rules.length
                if(len === 0) {
                    return
                }
                let fn
                for(let i = 0; i < len; i++) {
                    await this.validateOne(item, rules[i])
                    if(item.state !== 1) {
                        return fn
                    }
                }
                return
            }
            return this.validateOne(item, rules)
        }
    }
}

