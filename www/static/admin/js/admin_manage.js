function htmlEncode(value){
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}
//html字符串转html
function htmlDecode(value){
    return $('<div/>').html(value).text();
}
$(function(){
    //select2 下拉选择 初始化
    $('.type_select').select2({
        data:[{id:0,text:'恐怖'},{id:1,text:'惊悚'},{id:2,text:'悬疑'}],
        placeholder: "请选择影片类型"
    });
    //$(".js-example-basic-multiple").select2('val','1')
    var typeval=$(".type_select").attr('typeval');//.split(',');
    var b=typeval.split(",");
    if(b.length>0){
        $(".type_select").val(b).trigger('change');
    }

    $('.area_select').select2({
        data:[{id:0,text:'大陆'},{id:1,text:'港澳台'},{id:2,text:'日韩'},{id:3,text:'中欧'},{id:4,text:'西欧'},{id:5,text:'北美'}],
        placeholder: "请选择上影地区"
    });

    var areaval=$(".area_select").attr('areaval');//.split(',');
    if(areaval) {
        $(".area_select").select2('val', areaval);
    }
    //日期转换
    var tsamp=$('.datetamp').attr('datetamp');
    console.log(tsamp);
    if(tsamp>0) {
        var d = new Date(tsamp * 1000);    //根据时间戳生成的时间对象
         console.log(d);
         var mon,day;
        if((d.getMonth() + 1)<10){
            mon='0'+(d.getMonth()+ 1);
        }else{
            mon=(d.getMonth()+ 1);
        }
         if(d.getDate()<10){
         day='0'+d.getDate();
         }else{
         day=d.getDate();
         }
         var _date = (d.getFullYear()) + "-" + mon + "-" + day;
        $('.datetamp').val(_date);
    }
    //文本编辑器初始化
    var ue = UE.getEditor('editor');
    ue.addListener("ready", function () {
        // editor准备好之后才可以使用
        var con=$('#defHtml').html();
        var defHtml=htmlDecode(con);
        if(defHtml){
            ue.setContent(defHtml);
        }
    });
    //封面图片提交
    ///上传控件
    var mid=$('input[name=movieid]').val();
    if(mid) {
        $('#myUpload').uploadFile({
            movieid: mid,
            label: '海报上传',///选择框前面的文字
            haslabel: '当前海报',///已上传
            type: "image",
            multiple: "multiple",
            cssUrl: '../static/common/plugin/uploadfile/'
        }, function (res) {
            console.log(res);
        });
    }
    //数据页面 保存
    $('.submitBtn').click(function(){
        //var formData=$('form[name=manageForm]').serialize();
        let name_cn=$('input[name=name_cn]').val(),
            name_en=$('input[name=name_en]').val(),
            director=$('input[name=director]').val(),
            costars=$('input[name=costars]').val(),
            vtype=$(".type_select").val(),
            area=$(".area_select").val(),
            date=$('input[name=date]').val(),
            editor_value=ue.getContent();
        //日期转时间戳
        var timestamp = Date.parse(new Date(date))/1000;
        //处理影片类型 数组转字符串
        var a='';
        for(var i in vtype){
            if(i>0){
                a+=',';
            }
            a+=vtype[i];
        }
        //console.log(a);
        $.post('/manageform',{
            movieid:mid?mid:0,
            name_cn:name_cn,
            name_en:name_en,
            director:director,
            costars:costars,
            movietype:a,
            area:area,
            date:timestamp,
            editor_value,editor_value
        },function(res){
            console.log(res);
            //console.log(res.data.id);
            //$('input[name=movieid]').val(res.data.id);
            window.location.href='/manage/state='+res.data.id;
        }).fail(function(err){
            console.log(err);
        })
    });

})