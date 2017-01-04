import {type, extend} from './utils'
import {ruleFn} from './rules'

export default {
    name: 'leo-validator',
    render(h){
        const tagOptions = this.tagOptions || null
        return h(this.tag || 'span', {...tagOptions}, this.$slots.default || [])
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
                    // {
                    //     key: '',//必须唯一
                    //     value: '',
                    //     rules: [
                    //         {
                    //             rule: 'required', tip: '请输入活动名称',
                    //         },
                    //         {
                    //             rule: (value, rule, item, cb) => {
                    //                 item.msg = ''
                    //                 item.timerId = setTimeout(() => {
                    //                     item.timerId = null
                    //                     cb(() => {
                    //                         item.state = 1
                    //                         item.msg = 'wahahahahh'
                    //                     })
                    //                 }, 1000)
                    //             }
                    //         }
                    //     ],//必须调用cb
                    //     resetCb(item, i){
                    //          if(item.timerId){  //clearTimeout
                    //              clearTimeout(item.timerId)
                    //              item.timerId = null
                    //          }
                    //     },//reset回调
                    //     state: 0,//0: 没有验证过, 1: 通过, 2: 不通过, 3: 验证中
                    //     msg: '',//提示信息
                    //     tip: '',//替代默认规则的提示信息
                    //     deep: false,//value是对象时候 true
                    // },
                ]
            }
        },
        tag: {
            type: String,
            'default': 'span'
        },
        tagOptions: {
            type: Object
        },
    },
    watch: {
        forms(newVal, oldVal){
            if(this.leoFormInit) {
                if(newVal.length < this.leoFormLength && !this.isLeoValidatorRemove) {
                    throw new Error('必须使用removeField删除！')
                }
                this.initForms()
                this.addAllWatch()
                this.leoFormLength = newVal.length
                this.isLeoValidatorRemove = false
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
                this.leoFormLength = this.forms.length
                this.isLeoValidatorRemove = false
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
                const initItem = initFormsData[item.key]
                if(!initItem) {
                    initFormsData[item.key] = {
                        value: this.getItemValue(item.value),
                        msg: item.msg
                    }
                    item.__enable = true
                    item.state = 0
                    item.__promiseHash = {}
                }else {
                    item.__enable = false
                    this.$nextTick(() => {
                        item.__enable = true
                    })
                }
            })
        },
        resetFields(){
            if(!this.leoFormInit) {
                throw new Error('请初始化')
            }
            const initFormsData = this.initFormsData
            this.forms.forEach((item, i) => {
                const initItem = initFormsData[item.key]
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
                if(type(item.resetCb) === 'function') {
                    item.resetCb(item, i)
                }
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
            this.isLeoValidatorRemove = true
        },
        async validate(mode = 'all'){
            if(!this.leoFormInit) {
                return new Promise((resolve, reject) => {
                    reject('请初始化')
                })
            }
            const forms = this.forms
            const result = {
                valid: true,
                msgs: [],
                form: {}
            }
            try {
                for(let [index, form] of forms.entries()) {
                    await this.validateField(form)
                    if(form.state > 1) {
                        result.valid = false
                        result.msgs.push(form.msg)
                    }
                    result.form[form.key] = {
                        value: this.getItemValue(form.value),
                        msg: form.msg,
                        state: form.state,
                        index: index
                    }
                    if(mode === 'first' && form.state == 2) {
                        return result
                    }
                }
            }catch(e) {
                return {
                    info: e,
                    result
                }
            }
            return result
        },
        validateOne(item, rule, index){
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
                            cb && cb(item.value, rule, item, index)
                            delete item.__promiseHash[id]
                            resolve()
                        }else{
                            reject('reset中断')
                        }
                        id = null
                    }, index)
                })
            }
        },
        async validateField(item) {
            if(item.state === 3) {
                return
            }
            const rules = item.rules
            if(!rules) {
                return
            }
            if(Array.isArray(rules)) {
                const len = rules.length
                if(len === 0) {
                    return
                }
                for(let i = 0; i < len; i++) {
                    await this.validateOne(item, rules[i], i)
                    if(item.state != 1) {
                        return
                    }
                }
                return
            }
            return this.validateOne(item, rules)
        }
    }
}

