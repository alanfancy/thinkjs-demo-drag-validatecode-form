//console.log(sessionStorage.getItem('token'));
//跳转 编辑数据页面
$('.editBtn').click(function(){
    var _mid=$(this).parents('tr').attr('mid');
    window.open('/manage/state='+_mid,'_self');
});
//跳转 增加数据页面
$('.admin_add').click(function(){
    //var uid=$(this).attr('uid');
    window.open('/manage/state=0','_self');
});
//管理后台 主页 tabs菜单切换
$('.admin_menuUl>li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
    var index=$(this).index();
    $('.admin_conUl>li').removeClass('active').eq(index).addClass('active');
});
