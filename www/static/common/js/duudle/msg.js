$(function(){
        core.scrollBottom();
        var browser = core.getBrowserInfo();
        //提交消息
        $('.sub_btn').click(function(){
            var msg=$.trim($('#msgText').val());
            $('#msgText').val('');
            if(msg=='') return;
            core.socket.emit('sendmsg', {
                username:core.username,
                message:msg
            });
        })
        $('.emotion').click(function(){
            if(browser=='chrome/53.0.2785.146'){
                $('.footerbar').css('paddingBottom','0px');
            }
        })
        $('.emotion').qqFace({
            id : 'dis_faceBox', 
            assign:'msgText', 
            path:'../static/images/arclist/', //表情存放的路径
            faceImgBox:'dis_face'
        },function(data){});
        
        ////文本框焦点
        $("input[name='msgText']").focus(function(){
            $(this).addClass('active');
            if(browser=='chrome/53.0.2785.146'){
                $('.footerbar').css('paddingBottom','45px');
            }
        }).blur(function(){
            $(this).removeClass('active');
        });
        $(document).click(function(){
            $(this).removeClass('active');
            if(browser=='chrome/53.0.2785.146'){
                $('.footerbar').css('paddingBottom','0px');
            }
        })
        /////语音输入
        $('.voice_show').click(function(){
            $(this).toggleClass('word');
            $('#msgText').val('');
            $('.voice_btn').toggle();
            $('.msgText').toggle();
        });
});
