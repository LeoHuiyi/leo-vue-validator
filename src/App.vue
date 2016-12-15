<template>
    <div id="app">
        <h1>
            leo-vue-validator例子
        </h1>
        <h3>
            注意事项：必须先点击初始化按钮或者调用(initForm接口)才能验证
        </h3>
        <h3>
            状态参数（state）： 0: 没有验证过, 1: 通过, 2: 不通过, 3: 验证中
        </h3>
        <h3>
            自定义回调：
                1.必须要设置item.state = 1才能验证下面的事项
                2.必须调用回调参数cb()验证才开始
        </h3>
        <h3>
            改变forms中value的值 都会进行验证
        </h3>
        <leo-validator ref="leoForm" :forms="form1" tag="div" class="form1" :style="{paddingLeft: '10px'}">
            <h1>表单1(动态添加表单)</h1>
            <ul class="MoUpFlo_Module MoUpFlo_enterInfo">
                <li class="clearfix" v-for="(item, index) in form1">
                    <label>
                        <span>item{{index}}: </span>
                        <input class="infoVal" type="text" v-model="item.value"/>
                    </label>
                    <div>
                        <button @click="deleteItem(item)">删除</button>
                        <button @click="deleteItem1(item)">删除(不使用removeField 报错,初始化后）)</button>
                    </div>
                    <p>状态：{{item.state}}&nbsp;&nbsp;&nbsp;&nbsp;提示：{{item.msg}}</p>
                </li>
            </ul>
            <button @click="initForm">初始化</button>
            <button @click="add">添加</button>
            <button @click="reset">重置</button>
            <div>
                <button @click="submit('all')">提交(全部验证)</button>
                <button @click="submit('first')">提交（验证的第一个错误项）</button>
            </div>
        </leo-validator>
        <leo-validator ref="leoForm1" :forms="form2" tag="div" :class="{form2: true}">
            <h1>表单2</h1>
            <ul>
                <li class="clearfix">
                    <label>
                        <span>没有验证 : </span>
                        <input class="infoVal" type="text" v-model="form2[1]['value']"/>
                    </label>
                    <p>状态：{{form2[1]['state']}}&nbsp;&nbsp;&nbsp;&nbsp;提示：{{form2[1]['msg']}}</p>
                </li>
                <li class="clearfix">
                    <label>
                        <span>手机号 : </span>
                        <input class="infoVal" type="text" v-model="form2[0]['value']"/>
                    </label>
                    <p>状态：{{form2[0]['state']}}&nbsp;&nbsp;&nbsp;&nbsp;提示：{{form2[0]['msg']}}</p>
                </li>
                <li class="clearfix">
                    <label>
                        <span>异步验证整组验证 : </span>
                        <p>（obj形式 失去焦点验证 password: 123456）</p>
                        <input class="infoVal" placeholder="user" type="text" v-model.lazy="form2[2]['value']['user']" :disabled="form2[2]['state'] == 3"/>
                        <input class="infoVal" placeholder="password" type="text" v-model.lazy="form2[2]['value']['password']" :disabled="form2[2]['state'] == 3"/>
                    </label>
                    <p>状态：{{form2[2]['state']}}&nbsp;&nbsp;&nbsp;&nbsp;提示：{{form2[2]['msg']}}</p>
                </li>
                <li class="clearfix">
                    <label>
                        <span>异步验证整组验证（array形式 失去焦点验证） : </span>
                        <input class="infoVal" type="text" v-model.lazy="form2[3].value[0]" :disabled="form2[3]['state'] == 3"/>
                        <input class="infoVal" type="text" v-model.lazy="form2[3].value[1]" :disabled="form2[3]['state'] == 3"/>
                    </label>
                    <p>状态：{{form2[3]['state']}}&nbsp;&nbsp;&nbsp;&nbsp;提示：{{form2[3]['msg']}}</p>
                </li>
            </ul>
            <button @click="initForm1">初始化</button>
            <button @click="reset1">重置</button>
            <div>
                <button @click="submit1('all')">提交(全部验证)</button>
                <button @click="submit1('first')">提交（验证的第一个错误项）</button>
            </div>
        </leo-validator>
    </div>
</template>

<script>
    import validator from './components/validator/validator'
    function leoAlert(data) {
        setTimeout(()=>{
            alert(JSON.stringify(data, null, 4))
        })
    }

    export default {
        name: 'app',
        components: {
            'leo-validator': validator,
        },
        data(){
            return {
                form1: [
                    {
                        key: 'formKey1',
                        value: '',
                        rules: [
                            {
                                rule: 'required', tip: '请输入活动名称',
                            },
                            {
                                rule: 'isCode', tip: '邮政编码不正确（leo）'
                            }
                        ],
                        state: 0,
                        msg: '',
                    },
                    {
                        key: 'formKey2',
                        value: 'wahahha',
                        rules(value, rule, item, cb){
                            item.msg = 'loading'
                            setTimeout(()=> {
                                cb((newVal, rule, item)=> {
                                    item.state = 1//1才能成功
                                    item.msg = '成功'
                                })
                            }, 1000)
                        },
                        state: 0,
                        msg: '',
                    }
                ],
                form2: [
                    {
                        key: 'form2Item1',
                        value: '',
                        rules: [
                            {
                                rule: 'required', tip: '不能为空',
                            },
                            {
                                rule: 'isPhone', tip: '手机号码格式不对'
                            },
                        ],
                        state: 0,
                        msg: '',
                    },
                    {
                        key: 'form2Item2',
                        value: '',
                        state: 0,
                        msg: '',
                    },
                    {
                        key: 'form2Item3',
                        value: {
                            user: 'leo',
                            password: ''
                        },
                        rules: [
                            {
                                rule(value, rule, item, cb) {
                                    if(value.user === ''){
                                        item.msg = 'user不能为空'
                                        item.state = 2
                                        cb()
                                        return
                                    }
                                    item.msg = 'user验证中'
                                    setTimeout(()=> {
                                        cb((newVal, rule, item)=> {
                                            if(newVal.user.length > 6){
                                                item.state = 2
                                                item.msg = 'user不正确'
                                            }else{
                                                item.state = 1
                                                item.msg = 'user验证成功'
                                            }
                                        })
                                    }, 1000)
                                },
                            },
                            {
                                rule(value, rule, item, cb) {
                                    item.msg = 'password验证中'
                                    setTimeout(()=> {
                                        cb((newVal, rule, item)=> {
                                            if(newVal.password == 123456){
                                                item.state = 1
                                                item.msg = 'password验证成功'
                                            }else{
                                                item.state = 2
                                                item.msg = 'password不正确'
                                            }
                                        })
                                    }, 1000)
                                },
                            },
                        ],
                        state: 0,
                        msg: '',
                        deep: true//对象的必须深度监听
                    },
                    {
                        key: 'form2Item4',
                        value: ['leo', 'leoWa'],
                        rules: [
                            {
                                rule(value, rule, item, cb) {
                                    if(value[0] === '' || value[1] === ''){
                                        item.msg = 'input都不能为空'
                                        item.state = 2
                                        cb()
                                        return
                                    }
                                    item.state = 3
                                    item.msg = '验证中'
                                    setTimeout(()=> {
                                        cb((newVal, rule, item)=> {
                                            if(newVal[0] == newVal[1]){
                                                item.state = 1
                                                item.msg = ''
                                            }else{
                                                item.state = 2
                                                item.msg = '第一项和第二项不相等'
                                            }
                                        })
                                    }, 1000)

                                }
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
                this.$refs.leoForm.initForm()
            },
            reset1(){
                this.$refs.leoForm1.resetFields()
            },
            submit1(op){
                this.$refs.leoForm1.validate(op).then((result)=> {
                    leoAlert(result)
                }).catch((result)=>{
                    leoAlert(result)
                })
                console.log(this.$refs.leoForm1.getFormData())
            },
            reset(){
                this.$refs.leoForm.resetFields()
            },
            submit(op){
                this.$refs.leoForm.validate(op).then((result)=> {
                    leoAlert(result)
                }).catch((result)=>{
                    leoAlert(result)
                })
                console.log(this.$refs.leoForm.getFormData())
            },
            add(){
                this.form1.push({
                    key: `formKey${this.form1.length + 1}`,
                    value: '',
                    rules: [
                        {
                            rule: (value, rule, item, cb)=> {
                                if('leo好帅' === value) {
                                    item.state = 1
                                    item.msg = ''
                                }else {
                                    item.state = 2
                                    item.msg = '请输入leo好帅'
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
            deleteItem1(item){
                const forms = this.form1
                const index = forms.indexOf(item)
                if(index > -1) {
                    forms.splice(index, 1)
                }
            }
        }
    }
</script>

<style>
    #app{
        width: 1200px;
        margin: 40px auto;
    }
    .form1{
        float: left;
    }
    .form2{
        float: right;
    }
</style>
