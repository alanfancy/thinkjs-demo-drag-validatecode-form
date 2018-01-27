const Base = require('./base.js');
module.exports = class extends Base{
    saleAction(){
        this.assign({
            title:'购物'
        });
        return this.display();
    }
};