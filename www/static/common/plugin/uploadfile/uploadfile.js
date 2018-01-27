/**
 * wang yun liang
 * 2017/11/1
 * 使用时在页面创建div 设置class , js 调用：$(class).uploadFile();
 * 上传格式相同时，options为统一设置; 不相同时，需要在div上添加属性区分
 * <div id="myUpload"></div>
 * title: input前的文件默认为 文件上传，accept：上传文件格式默认为 image，url 上传路径默认为 /files
 * **/
(function($){

    $.fn.uploadFile=function(options,callback){
        var defaults={
            movieid:0,
            label:'选择上传',///选择框前面的文字
            haslabel:'已经上传',///已上传
            type:'image',////上传文件件类型  image video
            url:'/addfiles',///上传路径
            loadFiles:'/loadfiles',///加载已上传pop图片列表
            cssUrl:'',  ///样式路径补充 用于拼接 '../static/common/plugin/uploadfile/'
            multiple:'',///多选 multiple
            curFiles:[],//转存所选择的文件
            total:5,
            acceptImg:"image/gif,image/jpeg,image/png",///'video/mp4,video/mpeg'
            acceptVideo:"video/mp4,video/mpeg"
        };
        var opts=$.extend(defaults,options),
            wylThis=this,
            deleteFile=function(){
                ////删除单张图片
                var currentObj=$(this).parent();//filePathBox
                var $fileid=$(this).parent().attr('fileid');
                console.log('fileid:'+$fileid);
                console.log(typeof ($fileid));
                if($fileid != '' && $fileid != 'undefined'&& typeof ($fileid*1)=='number'){
                    ////上传之后删除
                    $.post('/deletefile',{fileid:$fileid},function(res){
                        if(res.data>0){
                            opts.total++;
                            checkTotal();
                            $(currentObj).empty().remove();
                        }else{
                            console.log(res);
                        }
                    })
                }else {
                    ////上传之前删除
                    var _index = $(this).parent().index();
                    $(currentObj).empty().remove();
                    opts.curFiles=opts.curFiles.filter(function (el, index) {
                        if (index != _index) {
                            return true;
                        }
                        return false;
                    });
                    filePathBox_empty(currentObj.parent());
                    /*if (opts.curFiles.length) {
                        addItem(currentObj.parent(), opts.curFiles);
                    }*/
                }
            },
            checkTotal=function (){
                if(opts.total==0){
                    fullList();
                }else {
                    unfullList()
                }
            },
            fullList=function (){
                // $(wylThis).find('.file_selectBtn').hide();
                $(wylThis).find('.upload_formBox').hide();
                $(wylThis).find('.file_selectBtn').unbind();
                $(wylThis).find('.fileSelect').unbind();
            },
            unfullList=function (){
                // $(wylThis).find('.file_selectBtn').show();
                $(wylThis).find('.upload_formBox').show();
//绑定所有type=file的元素的onchange事件的处理函数
                $(wylThis).find('.file_selectBtn').unbind().bind('click',file_selectBtn);
                //默认选择上传文件事件// 初始选择文件时触发
                //$(wylThis).find('.fileSelect').unbind().bind('change',fileSelect);
                $(wylThis).find('.fileSelect').unbind();
                $(document).on('change','.fileSelect',fileSelect);
            },
            file_selectBtn=function (){
                var fileInp='<input type="file" name="imgfile" class="fileSelect upload_btn"  accept='+opts.accept+' '+opts.multiple+' >';
                $(this).siblings('.fileSelect').remove();
                $(this).after(fileInp);
                $(this).siblings('.fileSelect').unbind();
                $(this).siblings('.fileSelect').unbind().click();
            },
            fileSelect=function (){
                console.log(this.files);
                var files = this.files;
                var myFileArr = [];

                if (files && files.length) {
                    // 原始FileList对象不可更改，所以将其赋予curFiles提供接下来的修改
                    Array.prototype.push.apply(myFileArr, files);
                    var filePathBox=$(this).siblings('.filePathBox');
                    addItem(filePathBox, myFileArr);
                }
            },
            addItem=function (filePathBox,files) {
                //var filePathBox = $(_this).siblings('.filePathBox'),
                    filehtml='';
                opts.curFiles=[];
                for (var i = 0; i< files.length; i++) {
                    if(i<=opts.total-1){
                        opts.curFiles.push(files[i]);
                        filehtml+=fileHtml(opts.curFiles[i].name,'upload_'+i);

                        filePathBox.html(filehtml);
                    }
                }
                //styleChange(filePathBox);
                filePathBox_empty(filePathBox);
                //点击开始上传
                var file_uploadBtn=filePathBox.siblings('.file_uploadBtn');
                ////unbind()防止重复上传
                file_uploadBtn.unbind().click(function(){
                    uploadFn(this);
                });
            },
        ///上传函数
            uploadFn=function (file_uploadBtn) {
                for(var i in opts.curFiles) {
                    //console.log(opts.curFiles[i]);
                    if(opts.movieid==0){
                        console.log("电影ID不存在");
                        return false;
                    };
                    var formData = new FormData();
                    formData.append('movieid', opts.movieid);
                    formData.append('myFileTest' + i, opts.curFiles[i]);

                    $.ajax({
                        url: opts.url,
                        type: 'POST',
                        cache: false,
                        async:false,
                        data: formData,
                        processData: false,
                        contentType: false,
                        xhr: function () { //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
                            var myXhr = $.ajaxSettings.xhr();
                            if (myXhr.upload) { //检查upload属性是否存在
                                //绑定progress事件的回调函数
                                myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
                            }
                            return myXhr; //xhr对象返回给jQuery使用
                        },
                        success: function (res) {
                            console.log(res);
                            if (res.data.length) {//判断是否最终上传成功
                                ///上传完后隐藏上传按钮和上传进度条
                                var filehtml = '';
                                filehtml=fileHtml(res.data[0].name,'hasUpload',res.data[0].id);
                                $(wylThis).children('.uploadResult').children('.resultBox').find('.filePathBox').append(filehtml);
                                //$(file_uploadBtn).unbind();
                                $(file_uploadBtn).siblings('.filePathBox').find('.file_path_panel').eq(0).remove();
                                opts.total--;
                                checkTotal();
                            } else {
                                console.log("返回错误:" + res.data.message);
                            }
                        },
                        //(默 认: 自动判断 (xml 或 html)) 请求失败时调用时间。
                        //参数有以下三个：XMLHttpRequest 对象、错误信息、（可选）捕获的错误对象。
                        //如果发生了错误，错误信息（第二个参数）除了得到null之外，
                        //还可能是"timeout", "error", "notmodified" 和 "parsererror"。
                        //textStatus: "timeout", "error", "notmodified" 和 "parsererror"。
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            /*XMLHttpRequest.readyState: 状态码的意思
                             0 － （未初始化）还没有调用send()方法
                             1 － （载入）已调用send()方法，正在发送请求
                             2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
                             3 － （交互）正在解析响应内容
                             4 － （完成）响应内容解析完成，可以在客户端调用了

                             发送error可能有下面两张引起的，或者其他程序问题，需要我们认真仔细。
                             1、data:"{}", data为空也一定要传"{}"；不然返回的是xml格式的。并提示parsererror.
                             2、parsererror的异常和Header 类型也有关系。及编码header('Content-type: text/html; charset=utf8');*/
                            console.log(XMLHttpRequest.readyState);
                        }
                    });
                    //上传进度回调函数：
                    function progressHandlingFunction(e) {
                        if (e.lengthComputable) {
                            //$('progress').attr({value : e.loaded, max : e.total}); //更新数据到进度条
                            var percent = e.loaded / e.total * 100 + '%';
                            //$('#progress').html(e.loaded + "/" + e.total+" bytes. " + percent.toFixed(2) + "%");
                            //$(file_uploadBtn).siblings('.uploadProgress').find('.pop').width(percent);
                            $('.upload_'+i).children('.file_path_bg').width(percent);
                        }
                    }
                }
            },
            //请求已有的海报
            loadPopList=function (){
                $.ajax({
                    url: opts.loadFiles,
                    type: 'POST',
                    cache: false,
                    data:{"movieid":opts.movieid},
                    async:false,
                    success:function(res){
                        //opts.total=res.data.total;
                        opts.total=res.data.total-res.data.list.length;
                        if(res.data.list.length>0) {
                            for (var i = 0; i < res.data.list.length; i++) {
                                if (i > 4) return;
                                var filehtml = '';
                                filehtml = fileHtml(res.data.list[i].name, 'hasUpload', res.data.list[i].id);
                                $(wylThis).children('.uploadResult').children('.resultBox').find('.filePathBox').append(filehtml);
                            }
                        }else{
                            return false;
                        }
                    }
                })
            },
            uploadHtml=function (){
                var html='<form enctype="multipart/form-data" method="post" name="uploadForm">'+
                    '<div class="upload_formBox">'+
                    '<p class="p1">'+opts.label+':</p>'+
                    '<div class="upload_inpBox uploadBox ">'+
                    '<div class="filePathBox"></div>'+
                    '<input type="file" name="imgfile" class="fileSelect upload_btn" accept='+opts.accept+' '+opts.multiple+' />'+
                    '<input type="button" class="file_selectBtn upload_btn" value="请选择..." />'+
                    '<input type="button" class="file_uploadBtn upload_btn" value="开始上传" />'+
                    '<div class="uploadProgress"><p class="pop"></p></div>'+
                    '<a class="file_closeBtn" href="javascript:void(null)">X</a>'+
                    '</div>'+
                    '<p class="p3">*</p>'+
                    '</div>'+
                    '</form>' +
                    '<div class="uploadResult">'+
                    '<p class="p1">'+opts.haslabel+':</p>'+
                    '<div class="resultBox">'+
                    '<div class="filePathBox "></div>'+
                    '<a class="file_closeBtn" href="javascript:void(null)">X</a>'+
                    '</div>'+
                    '<p class="p3"></p>'+
                    '</div>';
                return html;
            },
            fileHtml=function ($name,cls,$fileid){
                var html='<div class="file_path_panel '+cls+'"  fileid='+$fileid+' >' +
                    '<p class="file_txt">'+$name+'</p>' +
                    '<a class="file_delete" href="javascript:void(null)">X</a>'+
                    '<div class="file_path_bg"></div>'+
                    '</div>';
                return html;
            },
            filePathBox_empty=function (){
                if($(wylThis).find('.filePathBox').html()){
                    $(wylThis).find('.file_selectBtn').val('重新选择');
                    $(wylThis).find('.file_uploadBtn').addClass('cls_show');
                }else{
                    $(wylThis).find('.file_selectBtn').val('请选择...');
                    $(wylThis).find('.file_uploadBtn').removeClass('cls_show');
                }
            },
            addLink=function (url,type){
                var hint =document.createElement("link");
                hint.setAttribute("rel",type);
                hint.setAttribute("href",url);
                document.getElementsByTagName("head")[0].appendChild(hint);
            };
        ///加载样式
        addLink(opts.cssUrl+"css/uploadfile.css","stylesheet");
        return this.each(function(){
            ///初始化
            ////重置属性值
            opts.accept=opts.type=='image'?'image/gif,image/jpeg,image/png':'video/mp4,video/mpeg';
            $(wylThis).append(uploadHtml());
            if(!opts.movieid || typeof(opts.movieid*1) != 'number'){
                console.log('error:无效ID')
                return false;
            }else{
                loadPopList();
            };
            checkTotal();
            //封面图片上传
            $(document).on('click','.file_delete',deleteFile);
        });
    }
})(window.jQuery);