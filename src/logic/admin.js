module.exports = class extends think.Logic {
    indexAction() {

    }
    manageformAction() {

        let rules={
            //影片类型
            /*type: {
                required: true,
                trim: true,
            },*/
            //地区
            area: {
                required: true,
                trim: true,
                string: true,
                default: '',
            },
            //主演
            costars: {
                required: true,
                trim: true,
                string: true,
                default: '',
            },
            //上影日期
            date: {
                trim: true,
            },
            //导演
            director: {
                required: true,
                trim: true,
                string: true,
                default: '',
            },
            //中文名
            name_cn: {
                required: true,
                trim: true,
                string: true,
                default: '无',
            },
            //英文名
            name_en: {
                required: true,
                trim: true,
                string: true,
                default: '无',
            },
            editor_value: {
                default: '-',
            }//文本编辑器   内容详情
        }
        let flag = this.validate(rules);
        if(!flag){
            return this.fail('validate error', this.validateErrors);
        }
    }
};
