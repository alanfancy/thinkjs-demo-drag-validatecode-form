function error101Time(sec){
    $('.errTips').html("<span>"+sec+"</span>秒后跳转至登陆页");
    setInterval(function(){
        if(sec>0){
            sec--;
            $('.errTips').html("<span>"+sec+"</span>秒后跳转至登陆页");
        }else{
            window.location.href='/login/state=0';
        }
    },1000)
};
$(function(){
    $('.errBtn').click(function(){
        window.location.href='/login/state=0';
    });
});