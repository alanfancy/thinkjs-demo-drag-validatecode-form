const Base = require('./base.js');
module.exports = class extends Base{
     /*async moviesAction(){
         let model = this.model('front/user');
         let _data = await model.filmlists();
        this.assign({
            title:"电影列表",
            lists:_data
        });
        return this.display();
    }*/
    playerAction(){
        this.assign({
            title:"播放器"
        });
        return this.display();
    }
};