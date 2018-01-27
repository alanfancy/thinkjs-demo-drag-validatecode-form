module.exports = class extends think.Controller {
  async __before() {
      let uid=await this.session('uid');
      if(uid){
          const user=this.model('user');
          const data=await user.where({id:uid}).find();
          if(think.isEmpty(data)) {
              return this.fail({
                  errno: 102,
                  errmsg: '用户不存在'
              })
          }
      }else{
          this.redirect('/error/state=101');
          /*return think.timeout(5000).then(() => {
              // 3s 后执行到这里
              that.redirect('/101');
          })*/

          /*return this.fail({
              errno: 101,
              errmsg: '用户未登陆3'
          })*/
      }
     //await this.session('footerData',null);
    //let footerData= await this.session('footerData');
    //const req=this.ctx.request;
    /*if(think.isEmpty(footerData)){
        let footerJson=[
            {name:'首页',url:'/'},
            {name:'电影',url:'/movies/type=1'},
            {name:'游戏',url:'/games/type=2'},
            {name:'购物',url:'/sale'},
            {name:'设置',url:'/system'}
        ];
        footerData=footerJson;
        console.log(footerJson);
        await this.session('footerData',JSON.stringify(footerJson));
    }*/
    //console.log(JSON.parse(footerData));
    /*let _footerdata=JSON.parse(footerData);
    //判断当前页面 active
    for(let _num in _footerdata){
        _footerdata[_num].active=false;
        if(req.url==_footerdata[_num].url){
            _footerdata[_num].active=true;
        }
    }
    console.log(_footerdata);*/
    /*this.assign({
        _URL:req.url,
        footers:_footerdata
    });*/
  }
};
