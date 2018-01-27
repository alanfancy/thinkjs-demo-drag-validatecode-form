const Base = require('./base.js');
module.exports = class extends Base{
    resultAction(){
        this.assign({
            searchbar:true
        });
        return this.display();
    }
};