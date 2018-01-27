;(function($){
    $.fn.dialog=function(options,callback){
            var defaults={
                    tit:'',
                    con:'',
                    btns:[],//{state:0,txt:"取消修改"},{state:1,txt:"确定提交"}
                    close:'X',//X
                    width:'500',
                    showClose:false,
                    dlgStyle:'black',//black white
                    cssUrl:'../static/common/plugin/dialog/'
                },opts=$.extend(defaults,options),
                $this=this,
                addLink=function (url,type){
                    var hint =document.createElement("link");
                    hint.setAttribute("rel",type);
                    hint.setAttribute("href",url);
                    document.getElementsByTagName("head")[0].appendChild(hint);
                },
                dlgStyle=function(){
                    $('.dlg_box').css({
                        width:opts.width
                    })
                },
                dlgHtml=function(_opts){
                    var html="<div class='dlg_outBox "+_opts.dlgStyle+"'>" +
                        "<div class='dlg_box'>";
                    if(_opts.showClose){
                        html+="<p class='dlg_close'><a class='dlg_closeBtn' href='javascript:void(null)'> "+_opts.close+"</a></p>";
                    }
                    if(_opts.tit){
                        html+="<div class='dlg_tit'>"+_opts.tit+"</div>";
                    }
                    html+="<div class='dlg_con'><div class='dlg_wraper'>"+_opts.con+"</div></div>";
                    if(_opts.btns.length>0){
                        html+="<div class='dlg_footer'><div class='dlg_wraper'>";
                        var btnCls='';
                        for(var i in _opts.btns){
                            btnCls=_opts.btns[i].state?'ensureBtn':'cancelBtn';
                            html+="<p class='dlg_btn "+btnCls+"' state="+_opts.btns[i].state+">"+_opts.btns[i].txt+"</p>";
                        }
                        html+="</div></div>";
                    }
                    html+="</div>" +
                        "<div class='dlg_masker'></div>" +
                        "</div>";
                    return html;
                };
            ///加载样式
            addLink(opts.cssUrl+"css/dialog.css","stylesheet");
            return $this.each(function(index,el){
                if($('.dlg_outBox').html()!='undefined'){
                    $('.dlg_outBox').empty().remove();
                }
                $(el).append(dlgHtml(opts));
                dlgStyle();
                $('.dlg_outBox').css('opacity',0).animate({
                    opacity:1
                },500);
                $('.dlg_closeBtn, .dlg_masker').click(function(){
                    $.closeDlg(this);
                    if(callback){
                        callback({obj:this,num:'-1'});
                    }
                });
                $('.dlg_btn').click(function(){
                    var ind=$(this).attr('state');
                    if(callback){
                        callback({obj:this,num:ind});
                    }
                })
            })
    };
    $.closeDlg=function (obj) {
        if(obj){
            $(obj).parents('.dlg_outBox').animate({
                opacity:0
            },500,function(){
                $(".dlg_outBox").empty().remove();
            });
        }else{
            $(".dlg_outBox").animate({
                opacity:0
            },500,function(){
                $(".dlg_outBox").empty().remove();
            });
        }
    }
})(window.jQuery);