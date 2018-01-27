const Base = require('./base.js');
module.exports = class extends Base {
    indexAction() {
        this.assign({
           title:"首页",
        });
        return this.display();
    }
    //列表页
    async listsAction(){
        let _title='';
        let _data=null;
        let _screening=false;
        let _type = this.get('type').split('=')[1];
        let model = this.model('front/user');
        if(_type==1){
            _title="电影列表";
            _screening=true;
            _data = await model.filmlists();
        }else if(_type==2){
            _title="游戏列表";
            _screening=false;
            _data = await model.gamelists();
        }
        this.assign({
            type:_type,   //类型
            title:_title, //页面标题
            screening:_screening,
            lists:_data   //列表数据

        });
        return this.display();
    }
    //搜索页
    searchAction(){
        this.assign({
            searchbar:true
        });
        return this.display();
    }
};
