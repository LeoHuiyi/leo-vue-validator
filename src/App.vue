<template>
    <div id="app">
        <leo-validator ref="leoForm" :forms="formOption" tag="span">
            <ul class="MoUpFlo_Module MoUpFlo_enterInfo">
                <li class="clearfix" v-for="(item, index) in formOption">
                    <label>
                        <span>{{item.key}} : </span>
                        <input class="infoVal" type="text" v-model="item.value"/>
                    </label>
                    <span @click="deleteItem(item)">删除</span>
                    <p>{{item.state}}</p>
                    <p>{{item.msg}}</p>
                </li>
            </ul>
            <button @click="initForm">初始化</button>
            <button @click="add">添加</button>
            <button @click="submit">确定</button>
            <button @click="reset">重置</button>
        </leo-validator>
        <leo-validator ref="leoForm1" :forms="formOption1">
            <span>form2: </span>
            <ul>
                <li class="clearfix">
                    <label>
                        <span>花型编号 : </span>
                        <input class="infoVal" type="text" v-model="formOption1[0]['value']"/>
                    </label>
                    <p>{{formOption1[0]['state']}}</p>
                    <p>{{formOption1[0]['msg']}}</p>
                </li>
                <li class="clearfix">
                    <label>
                        <span>花型编号1 : </span>
                        <input class="infoVal" type="text" v-model="formOption1[1]['value']"/>
                    </label>
                    <p>{{formOption1[1]['state']}}</p>
                    <p>{{formOption1[1]['msg']}}</p>
                </li>
                <li class="clearfix">
                    <label>
                        <span>花型编号2 : </span>
                        <input class="infoVal" type="text" v-model.lazy="formOption1[2]['value'][1]"/>
                        <input class="infoVal" type="text" v-model="formOption1[2]['value'][2]"/>
                    </label>
                    <p>{{formOption1[2]['state']}}</p>
                    <p>{{formOption1[2]['msg']}}</p>
                </li>
                <li class="clearfix">
                    <label>
                        <span>花型编号3 : </span>
                        <input class="infoVal" type="text" v-model.lazy="formOption1[3].value[0]"/>
                        <input class="infoVal" type="text" v-model="formOption1[3].value[1]"/>
                    </label>
                    <p>{{formOption1[3]['state']}}</p>
                    <p>{{formOption1[3]['msg']}}</p>
                </li>
            </ul>
            <button @click="initForm1">初始化</button>
            <button @click="submit1">确定</button>
            <button @click="reset1">重置</button>
        </leo-validator>
    </div>
</template>

<script>
    import validator from './components/validator/validator'

    export default {
        name: 'app',
        components: {
            'leo-validator': validator,
        },
        data(){
            return {
                formOption: [
                    {
                        key: 'factoryno',
                        value: 'aaaaaaa',
                        rules: [
                            {
                                rule: 'required', tip: '请输入活动名称',
                            },
                            {
                                rule: 'isPhone', tip: '手机号码格式不对1111111'
                            }
                        ],
                        state: 0,
                        msg: '',
                    },
                    {
                        key: 'leo',
                        value: 'bbbb',
                        rules(value, rule, item, cb){
                            item.msg = 'loading'
                            setTimeout(()=> {
                                cb(()=> {
                                    item.state = 1
                                    item.msg = ''
                                })
                            }, 1000)
                        },
                        state: 0,
                        msg: '',
                    }
                ],
                formOption1: [
                    {
                        key: 'formOption1-1',
                        value: '1111',
                        rules: [
                            {
                                rule: 'required', tip: '请输入活动名称',
                            },
                            {
                                rule: 'isPhone', tip: '手机号码格式不对1111111'
                            },
                        ],
                        state: 0,
                        msg: '',
                    },
                    {
                        key: 'formOption1-2',
                        value: '12312312',
                        rules(value, rule, item, cb){
                            item.msg = 'loading'
                            setTimeout(()=> {
                                cb(()=> {
                                    item.state = 1
                                    item.msg = ''
                                })
                            }, 1000)
                        },
                        state: 0,
                        msg: '',
                    },
                    {
                        key: 'formOption1-3',
                        value: {
                            1: '111',
                            2: '222'
                        },
                        rules: [
                            {
                                rule(value, rule, item, cb) {
                                    item.msg = 'loading'
                                    console.log(111)
                                    setTimeout(()=> {
                                        cb(()=> {
                                            item.state = 1
                                            item.msg = ''
                                        })
                                    }, 1000)

                                },
                                tip: 'aaaaa'
                            },
                            {
                                rule(value, rule, item, cb) {
                                    item.msg = 'loading'
                                    console.log(323)
                                    setTimeout(()=> {
                                        cb(()=> {
                                            if(value[2] === value[1]){
                                                item.state = 1
                                                item.msg = ''
                                            }else{
                                                item.state = 2
                                                item.msg = '324234234'
                                            }
                                        })
                                    }, 2000)

                                },
                                tip: 'bbbbb'
                            },
                        ],
                        state: 0,
                        msg: '',
                        deep: true
                    },
                    {
                        key: 'formOption1-4',
                        value: ['1111', 2222],
                        rules: [
                            {
                                rule(value, rule, item, cb) {
                                    item.state = 3
                                    item.msg = 'loading'
                                    setTimeout(()=> {
                                        cb(()=> {
                                            if(value[0] === value[1]){
                                                item.state = 1
                                                item.msg = ''
                                            }else{
                                                item.state = 2
                                                item.msg = 'buxiangdeng'
                                            }
                                        })
                                    }, 1000)

                                },
                                tip: 's23423423423'
                            },
                        ],
                        state: 0,
                        msg: ''
                    },
                ],
            }
        },
        methods: {
            initForm1(){
                this.$refs.leoForm1.initForm()
            },
            initForm(){
                console.log(this.$refs.leoForm)
                this.$refs.leoForm.initForm()
            },
            reset1(){
                this.$refs.leoForm1.resetFields()
            },
            submit1(){
                this.$refs.leoForm1.validate().then((result)=> {
                    console.log(result)
                })
                console.log(this.$refs.leoForm1.getFormData())
            },
            reset(){
                this.$refs.leoForm.resetFields()
            },
            submit(){
                this.$refs.leoForm.validate().then((result)=> {
                    console.log(result)
                })
                console.log(this.$refs.leoForm.getFormData())
            },
            add(){
                this.formOption.push({
                    key: 'leoTc' + this.formOption.length,
                    value: 'ccccccc',
                    rules: [
                        {
                            rule: (value, rule, item, cb)=> {
                                if(this.formOption[0].value === value) {
                                    item.state = 1
                                    item.msg = ''
                                }else {
                                    item.state = 2
                                    item.msg = '不一致'
                                }
                                cb()
                            }
                        }
                    ],
                    state: 0,
                    msg: '',
                })
            },
            deleteItem(item){
                this.$refs.leoForm.removeField(item)
            },
        }
    }
</script>

<style>

</style>
