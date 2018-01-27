module.exports = class extends think.Controller {
  indexAction() {
    return this.display();
  }
  errorAction(){
      let state=this.get("state").split('=');
      let msg='';
      if(state[1]==101){
          msg='用户未登录'
      }else if(state[1]==102){
          msg='用户不存在'
      }
      this.assign({
          title: '@_@！抱歉出错了哦',
          errcode:state[1],
          errmsg:msg
      });
    return this.display();
  }
};
