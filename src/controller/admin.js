const Base = require("./base.js");
const fs = require('fs');
const path = require('path');
const randomStr=require('../extend/randomstring');
const rename = think.promisify(fs.rename, fs);
const uEditorJson=require('./../bootstrap/ueditor/ueditor_config');
//const uEditorUpload=require('./../bootstrap/ueditor/ueditor_upload');
//import './../bootstrap/ueditor/ueditor_upload';

module.exports = class extends Base {

    //后台管理 视频页
   async indexAction() {
       //const options=await this.parseOptions({where:{id,name_cn,score,}});
       let filmlistModel=this.model('admin/film');
       let pagedata= await filmlistModel.filmlist(0);
       //console.log(pagedata);
        this.assign({
            title: '页面管理中心',
            pagedata:pagedata
        });
        return this.display();
    }
    //表单页面
    async manageAction() {
        let filmId=this.get('state').split('=')[1];
        let tit='undefind';
        if(filmId=='0'){
            tit="新增";
            this.assign({
                title: tit,
                data:''
            });
            return this.display();
        }else if(filmId>0){
            const filmModel=this.model('admin/film');
            const filmInfo= await filmModel.filmInfo(filmId);
            tit="编辑";
            this.assign({
                title: tit,
                data:filmInfo
            });
            return this.display();
        }else{
            tit="没有id";
            this.assign({
                title: tit
            });
            return this.display();
        }
    }
    //管理页面 表单新增电影
    async manageformAction(){
        let data=this.post();
        const filmDetail=this.model('admin/film');
        console.log("type:"+data.movietype);
        const uid=await filmDetail.film_thenUpdate(data);
        return this.success({id:uid});
    }
    //表单提交
    async formuploadAction() {
        let $action = this.get("action");
        let $result = {};
        switch ($action){
            case 'config':
                //console.log($action);
                let arr=JSON.stringify(uEditorJson);
                //console.log(arr);
                $result=arr;
                break;
            /* 上传图片 */
            case 'uploadimage':
            /* 上传涂鸦 */
            case 'uploadscrawl':
            /* 上传视频 */
            case 'uploadvideo':
            /* 上传文件 */
            case 'uploadfile':
               let file = this.file('upfile');
                if (file) {
                    const $name = randomStr.randomName() + '_' + Date.now() + '.png';
                    const showPath = '/static/runtime/upload/image/' + $name;
                    const filepath = path.join(think.ROOT_PATH, "www"+showPath);

                    think.mkdir(path.dirname(filepath));//创建文件路径
                    await rename(file.path, filepath);//替换路径
                    $result.state = "SUCCESS";
                    $result.url = showPath;
                    $result.title = $name;
                    $result.original = file.name;
                    $result.type = file.type;
                    $result.size = file.size;
                }
                break;
            /* 列出图片 */
            case 'listimage':
                console.log('列出图片');
                //$result = include("action_list.php");
                break;
            /* 列出文件 */
            case 'listfile':
                console.log('列出文件');
                //$result = include("action_list.php");
                break;

            /* 抓取远程文件 */
            case 'catchimage':
                console.log('抓取远程文件');
                //$result = include("action_crawler.php");
                break;

            default:
                console.log('default');
                /*$result = json_encode(array(
                    'state'=> '请求地址出错'
                ));*/
                break;
        }
         return this.json($result);
    }
    //加载已有文件（编辑）
    async loadfilesAction(){
        let movieid=this.post("movieid");
        let listObj={},total=5;
        const loadList=this.model('admin/film');
        const list=await loadList.loadfiles({movieid:movieid});
        listObj.list=list;
        listObj.total=total;
        return this.success(listObj);
    }
    //增加上传文件
    async addfilesAction() {
        let movieid=this.post('movieid');
        let files = this.file();
        let fileArr=[];
        for (let i in files) {
                let file = files[i];
                let fileType = 0;
                let fileObj = {};
                if (file) {
                    let fileDir = "";
                    let timeFormat = think.datetime(Date.now(), "YYYYMMDD");//获取日期并格式化
                    let lastName = file.type.split('/')[1];///提取文件后缀名
                    if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") {
                        fileDir = "film_pop_" + timeFormat;///文件夹名后加日期
                        fileType = 1;//////所上传的文件类型   o为未知 1图片 2影片
                    } else if (file.type == "video/mp4" || file.type == "video/video/mpeg") {
                        fileDir = "film_path_" + timeFormat;///文件夹名后加日期
                        fileType = 2;//////所上传的文件类型   o为未知 1图片 2影片
                    } else {
                        return this.fail({message: "第" + i + "个文件格式非法。" + file.name + ":" + file.type});///非法文件格式
                    }
                    ///随机文件名
                    const $name = randomStr.randomName() + '_' + Date.now() + '.' + lastName;
                    ////前端相对路径
                    const showPath = '/static/runtime/upload/' + fileDir + "/" + $name;
                    const filepath = "www" + showPath;
                    //const filepath = path.join(think.ROOT_PATH, "www"+showPath);///后台绝对路径
                    think.mkdir(path.dirname(filepath));//创建文件路径
                    await rename(file.path, filepath);//替换路径

                    const filmPath = this.model('admin/film');
                    const fileID = await filmPath.filmpath_add({url: showPath,name:$name, type: fileType, movieid: movieid});

                    fileObj.movieid = movieid;///电影ID
                    fileObj.id = fileID;///当前文件ID //图片ID
                    fileObj.url = showPath;///相对路径+文件名
                    fileObj.type = fileType;///文件类型
                    fileObj.name = $name;///文件名
                    fileArr.push(fileObj);
                } else {
                    return this.fail({message: "第" + i + "个文件不存在。" + file.name});
                }
            }
        return this.success(fileArr);
    }
    //删除文件
    async deletefileAction(){
        let $fileid=this.post("fileid");
        const filemodel=this.model('admin/film');
        const affectedRows=await filemodel.deletefiles({fileid:$fileid});
        return this.success(affectedRows);
    }
};