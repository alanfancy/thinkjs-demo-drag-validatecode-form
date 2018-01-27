;(($)=>{
    $.fn.wylsms=function(options,callback){
        let defaults={
            staticPath:"../static/common/plugin/sms/"
        };
        let opts=$.extend(defaults,options),
            wyl=this,
            layouthtml=()=>{
                let html="<div class='wyl_smsBox'>" +
                                "<div class='wyl_wraper'>" +
                                    "<div class='wyl_row'>" +
                                        "<p class='smsTxt'>手机号：<span>13512345678</span></p>" +
                                    "</div>" +
                                    "<div class='smsSend'>" +
                                        "<p class='p1'><input name='smsInp' type='text' placeholder='验证码' minlength='4' maxlength='6' /></p>" +
                                        "<p class='p2'><a class='smsBtn' href='javascript:void(null)' >获取短信</a> </p>" +
                                    "</div>" +
                                    "<div class='wyl_row'>" +
                                        "<p class='smsTips'>请输入收到的短信验证码</p>" +
                                    "</div>" +
                                "</div>" +
                           "</div>";
                return html;
            },
            //加载样式文件
            addLink=(url,type)=>{
                let hint =document.createElement("link");
                hint.setAttribute("rel",type);
                hint.setAttribute("href",url);
                document.getElementsByTagName("head")[0].appendChild(hint);
            };
        //加载样式文件
        addLink(opts.staticPath+"css/sms.css","stylesheet");
        return wyl.each(()=>{
           $(wyl).append(layouthtml);
            $('input[name=smsInp]').focus().keyup(function(e){
                var val=$(this).val();
                if(val.length==6){
                    callback?callback({state:1}):null;
                    $('input[name=smsInp]').unbind();
                }
            });
        });
    }
})(window.jQuery);