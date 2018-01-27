//列表点击
$('.panelBox').click(function(){
    var _type=$(this).attr('type');
    var _id=$(this).attr('uid');
    if(_type==1){
        window.open('/player/id='+_id,'_self');
    }else if(_type==2){
        window.open('/hall/id='+_id,'_self');
    }else{
        return false;
    }
});
//游戏大厅
$('.game_deskUl>li').click(function(){
    window.open('/duudle','_self');
});
