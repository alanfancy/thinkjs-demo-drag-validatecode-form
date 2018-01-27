function istel(tel) {
    var rtn = false;
    //移动号段
    var regtel = /^((13[4-9])|(15([0-2]|[7-9]))|(18[2|3|4|7|8])|(178)|(147))[\d]{8}$/;
    if (regtel.test(tel)) {
        rtn = true;
    }
    //电信号段
    regtel = /^((133)|(153)|(18[0|1|9])|(177))[\d]{8}$/;
    if (regtel.test(tel)) {
        rtn = true;
    }
    //联通号段
    regtel = /^((13[0-2])|(145)|(15[5-6])|(176)|(18[5-6]))[\d]{8}$/;
    if (regtel.test(tel)) {
        rtn = true;
    }
    return rtn;
}
function tipsMsg(msg){
    //{"errno":1000,"errmsg":"validate error","data":{"username":"username can not be blank"}}
    var txt=msg.errno>=1?msg.errno:'';
    txt+=msg.errno>=1?"-":'';
    for(var i in msg.data){
        txt+=msg.data[i];
    }
    $('.msgTips').removeClass().addClass("msgTips "+msg.type).html(txt);
}
function valideFormPromise(_data){
    return new Promise((resolve,reject)=>{
        if(!istel(_data.phone)){
            reject('请输入正确的手机号码');
        }else if(!_data.pass || _data.pass.length<6|| _data.pass.length>18){
            reject('请输入正确的密码');
        }else{
            resolve(1);
        }
    })
}
function formReset(link){
    if(link==0){
        window.location.href="/login/state=1";//注册
    }else{
        window.location.href="/login/state=0";//登陆
    }
    $('input[name=username], input[name=password]').val('');
    $('input[name=username]').focus();
    tipsMsg({errno:0,type:'warn',data:{"txt":""}});
}
var html="<div id='validateOutBox'></div>";
function loginEvent(data){
    $('body').dialog({
        con:html,
        width:'320'
    });
    $("#validateOutBox").wylValidate({},function(smsRes){
        if(smsRes.state){
            ///传入state 为1时是登陆，为2时是注册
            $.post('/loginvalidate',data, function (res) {
                if(res.errno>0){///后台验证不通过
                    tipsMsg({errno:res.errno,type:'error',data:res.data});
                    $.closeDlg();
                    return false;
                }
                if(res.data.state == 1) {//登录成功
                    sessionStorage.setItem('token',res.data.token);
                    tipsMsg({errno:0,type:'success',data:{'txt':'登陆成功'}});
                    window.location.href='/admin';
                }else if(res.data.state == -2) {//用户不存在
                    tipsMsg({errno:-1,type:'error',data:res.data});
                    $('body').dialog({
                        tit:'注册验证',
                        con: "亲还没注册哦，输入接收到的短信验证码，即可完成注册！",
                        btns:[{state:0,txt:'取消'},{state:1,txt:'注册'}]
                    },function(res) {
                        if(res.num==1){
                            formReset(0);
                        }
                        $.closeDlg();
                    });
                    return false;
                }else if(res.data.state == -1) {//密码错误
                    tipsMsg({errno:-1,type:'error',data:res.data});
                }else{//未知错误
                    tipsMsg({errno:-1,type:'error',data:{"txt":"未知错误"}});
                }
                $.closeDlg();
            }).fail(function(err){
                if(err.status==500){
                    $('body').dialog({
                        tit:'@_@!抱歉哦出错了',
                        con: "服务器好像崩了，快联系管理员！",
                        btns:[{state:1,txt:'重试'}]
                    },function(res) {
                        $.closeDlg();
                    });
                };
            });
        }
    });
}
function signEvent(data){
    $('body').dialog({
        con:html,
        width:'320'
    });
    $("#validateOutBox").wylValidate({},function(res){
        if(res.state) {
            ///验证短信注册
            $('body').dialog({
                con: html,
                width: '320'
            });
            $("#validateOutBox").wylsms({}, function (smsRes) {
                if (smsRes.state) {
                    $.post('/loginvalidate', data, function (res) {
                        console.log(res);
                        if (res.data.state == 2) {//注册成功
                            //console.log(res.data.uID);
                            tipsMsg({errno: 0, type: 'success', data:{'txt':'注册成功'}});
                            let s=5,t=null;
                            $('body').dialog({
                                tit:'注册成功',
                                con: "<p class='tc'><span style='font-weight:bold;color:#23ac38;'>"+s+"</span>秒后自动跳转至登陆页面</p>",
                                btns:[{state:1,txt:'立即跳转'}]
                            },function(res) {
                                if (res.num == 1) {
                                    formReset(1);
                                    clearInterval(t);
                                    $.closeDlg();
                                    return false;
                                }
                            });
                            t=setInterval(function(){
                                if(s>0){
                                    s--;
                                    $('.dlg_con .dlg_wraper').html("<p class='tc'><span style='font-weight:bold;color:#23ac38;'>"+s+"</span>秒后自动跳转至登陆页面</p>");
                                }else{
                                    formReset(1);
                                    clearInterval(t);
                                    $.closeDlg();
                                    return false;
                                }
                            },1000);
                            return false;
                        } else {//注册失败
                            $.closeDlg();
                            tipsMsg({errno: 1, type: 'success', data: res.data});
                            return false;
                        }
                    });
                }
            });
        }
    });
}
$(function(){

    ////密码栏焦点事件
    $('input[name=password]').focus(function(){
        $(this).attr('type','password');
    }).blur(function(){
        if(!$(this).val()){
            $(this).attr('type','text');
        }
    });
    //回车事件绑定
    $('input[name=username], input[name=password]').bind('keyup', function(event) {
        if (event.keyCode == "13") {
            //回车执行
            $('.sumbitBtn').click();
        }
    });
    $('.top_loginBtn').click(function(){
        var link=$(this).attr('link');
        formReset(link);
    });
    $('.sumbitBtn').click(function(){
        var link=$('.top_loginBtn').attr('link');
        let phone=$.trim($('input[name=username]').val());
        let pass=$.trim($('input[name=password]').val());
        let validePromise=valideFormPromise({phone:phone,pass:pass});
        validePromise.then(function(res){
            if(res>0){
                if(link==1){//注册
                    signEvent({state:1,phone:phone,pass:pass});
                }else{//登陆
                    loginEvent({state:0,phone:phone,pass:pass});
                }
            }
        }).catch(
            (error)=>{
                console.log(error);
                tipsMsg({errno:-1,type:'error',data:{msg:error}});
            }
        );
        //
    });
});