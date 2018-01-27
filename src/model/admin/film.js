module.exports = class extends think.Model {
    filmlist(num){

        return this.model('film').page(num).countSelect();
    }
    film_thenUpdate(data) {
        //当 where 条件未命中到任何数据时添加数据，命中数据则更新该数据。
        return this.model('film').thenUpdate(
            {
                vtype:data.movietype,//影片类型
                area: data.area,//地区
                costars: data.costars,//主演
                date: data.date,//上影日期
                director: data.director,//导演
                name_cn: data.name_cn,//中文名
                name_en: data.name_en,//英文名
                editor_value: data.editor_value//文本编辑器   内容详情
            },
            {id: data.movieid});
    }

    filmpath_add(data) {
        ////上传pop图片 添加一条数据，返回值为插入数据的 id。
        return this.model('filmpath').add({url: data.url, name: data.name, type: data.type, movie_id: data.movieid});
    }

    loadfiles(data) {
        //加载pop图片列表  查找多条数据
        return this.model('filmpath').where({movie_id: data.movieid}).limit(5).select();
    }

    deletefiles(data) {
        return this.model('filmpath').where({id: data.fileid}).delete();
    }

    filmInfo(_id) {
        return this.model('film').where({id: _id}).find();
    }
}