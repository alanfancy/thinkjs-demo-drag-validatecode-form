//底部导航
$('.footerbarUl').find('li.foot_iconBox').click(function(){
   var _url=$(this).attr('thisurl');
   window.open(_url,'_self');
});
//返回 左箭头
$('.pre_btn').click(function(){
   window.history.go(-1);
});
//ul li 公共点击事件
$('.commonUl>li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
});
//搜索筛选条件 点击下拉
$('.slideBtn').click(function(){
   $(this).toggleClass('active');
   $('.temp_screenTerm').slideToggle();
});
//搜索筛选条件 点击选中
/*$('.searchUl>li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
});*/
//搜索输入框
$('.search_inp').click(function(){
    window.open('/search','_self');
});
//搜索按钮
$('.search_btn').click(function(){
    window.open("/result","_self");
});
//搜索图标
$('.header_btn>.searchIcon').click(function(){
    window.open('/search','_self');
});
//取消搜索
$('.search_cancelBtn').click(function(){
    window.open("/","_self");
});
//