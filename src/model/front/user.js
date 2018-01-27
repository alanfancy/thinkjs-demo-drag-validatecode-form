module.exports = class extends think.Model{
    filmlists(){
        return this.model('film').where({type:'1'}).field('id,type,name,title,poster,sort').select();
    }
    gamelists(){
        return this.model('class_lists').where({type:'2'}).field('id,type,name,title,poster').select();
    }
};