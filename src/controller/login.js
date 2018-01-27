//const Base = require("./base.js");
module.exports = class extends think.Controller {
    loginAction() {
        let state=this.get("state").split('=');
        this.assign({
            title: state[1]==0?'登录':'注册',
            rightbtn:{txt:state[1]==1?'登录':'注册',link:state[1]==0?'0':'1'}
        });
        return this.display();
    }
    async loginvalidateAction() {
        let loginData = this.post();
        let model=this.model('login');
        loginData.pass=think.md5(loginData.pass);
        let resObj={};
        //清除所有session
        await this.session(null);
        //注册
        if(loginData.state==0){//登陆
            let userData = await model.getUserId(loginData);
            //如果返回数据为空，有可能是用户不存在
            if (think.isEmpty(userData)) {
                resObj.state = -2;
                resObj.txt = '用户不存在';
                return this.success(resObj);
            } else {
                //如果有数据，则用户存在
                //验证密码
                if (loginData.pass === userData.password) {
                    //resObj.uID = userData.id;
                    await this.session('uid',userData.id);
                    resObj.token=userData.token;
                    resObj.state = 1;
                    resObj.txt = '登陆成功';

                    return this.success(resObj);
                } else {
                    resObj.uID = '';
                    resObj.state = -1;
                    resObj.txt = '密码错误';
                    return this.success(resObj);
                }
            }
        }else if(loginData.state==1){//注册
            let token=think.md5(loginData.phone+'ladygaga');
            loginData.token=token;
            let addData = await model.addUser(loginData);
            if(addData.type=='add'){//添加用户成功
                resObj.state=2;
                resObj.txt='注册成功';
                return this.success(resObj);
            }else{
                //resObj.uID = '';
                resObj.state=-2;
                resObj.txt='注册失败，用户已存在';
                return this.success(resObj);
            }
            //未命中数据{ id: 1, type: 'add' }
            //命中数据  { id: 5, type: 'exist' }
        }else{
            resObj.uID = '';
            resObj.state='';
            resObj.txt='状态错误';
            return this.success(resObj);
        }
    }
}