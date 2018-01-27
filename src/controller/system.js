const Base = require('./base.js');
module.exports = class extends Base{
    systemAction(){
        this.assign({
            title:'个人设置'
        });
        return this.display();
    }
};