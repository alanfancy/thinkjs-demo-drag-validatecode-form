const Base = require('./base.js');
module.exports = class extends Base{
    /*async gamesAction(){
        let model = this.model('front/user');
        let _data = await model.gamelists();
        console.log(_data);
        this.assign({
            title:'游戏列表',
            lists:_data
        });
        return this.display();
    }*/
    hallAction(){
        this.assign({
            title:'游戏大厅'
        });
        return this.display();
    }
    duudleAction(){
        this.assign({
            title:'你画我猜'
        });
        return this.display();
    }
};