module.exports = class extends think.Model{
    getUserId(data){
        return this.model('user').where({phone:data.phone}).find();
    }
    addUser(data){
        return this.model('user').where({phone:data.phone}).thenAdd({phone:data.phone,password:data.pass,token:data.token});
    }
    makeToken(){

    }
}