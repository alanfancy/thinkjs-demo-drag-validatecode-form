module.exports = class extends think.Logic {
    __before() {

    }
    loginvalidateAction() {
        //this.allowMethods = 'post'; //  只允许 POST 请求类型
        let rules={
            phone:{
                mobile: 'zh-CN', //必须为中国的手机号
                //regexp: /thinkjs/g,
                //length: 11, //长度需要等于11
                //string: true,       // 字段类型为 String 类型
                required: true,     // 字段必填
                method: 'POST',
                trim: true,         // 字段需要trim处理
                aliasName: '手机号'
            },
            pass:{
                byteLength: {min: 6, max: 18}, // 字节长度需要在 6 - 18 之间
                string: true,       // 字段类型为 String 类型
                required: true,     // 字段必填
                method: 'POST',
                trim: true,         // 字段需要trim处理
                aliasName: '密码',
                alphaNumericDash:true  //值只能是 [a-zA-Z0-9_] 组成
            }
        }
        let flag = this.validate(rules);
        if(!flag){
            return this.fail('validate error', this.validateErrors);
            // 如果校验失败，返回
            // {"errno":1000,"errmsg":"validate error","data":{"username":"username can not be blank"}}
        }
    }
    __after() {

    }
};
