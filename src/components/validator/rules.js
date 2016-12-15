const telephoneRe = /^1[3|4|5|7|8][0-9]{9}$/
const passwordRe = /^\w{6,16}$/
const codeRe = /^[1-9]\d{5}$/

export const ruleFn = {
    isPhone(val, rule, item, cb) {
        const tip = '手机号码格式不对'
        if(telephoneRe.test(val)) {
            item.state = 1
            item.msg = ''
        }else {
            item.state = 2
            item.msg = rule.tip ? rule.tip : tip
        }
        cb()
    },
    isCode(val, rule, item, cb) {
        const tip = '邮政编码不正确'
        if(codeRe.test(val)) {
            item.state = 1
            item.msg = ''
        }else {
            item.state = 2
            item.msg = rule.tip ? rule.tip : tip
        }
        cb()
    },
    password(val, rule, item) {
        const tip = '密码6-16位'
        if(passwordRe.test(val)) {
            item.state = 1
            item.msg = ''
        }else {
            item.state = 2
            item.msg = rule.tip ? rule.tip : tip
        }
        cb()
    },
    required(val, rule, item, cb) {
        const tip = '必填!'
        if(val) {
            item.state = 1
            item.msg = ''
        }else {
            item.state = 2
            item.msg = rule.tip ? rule.tip : tip
        }
        cb()
    },
    isPositive(val, rule, item, cb) {
        const tip = '大于0!'
        if(val > 0) {
            item.state = 1
            item.msg = ''
        }else {
            item.state = 2
            item.msg = rule.tip ? rule.tip : tip
        }
        cb()
    },
    right(val, rule, item, cb) {
        const tip = '正确!'
        if(val === true) {
            item.state = 1
            item.msg = ''
        }else {
            item.state = 2
            item.msg = rule.tip ? rule.tip : tip
        }
        cb()
    }
}