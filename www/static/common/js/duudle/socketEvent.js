core.socket=io('ws://192.168.0.45:8360');
core.socket.on('connect',function(){
    console.log('已连接');
    // socket.emit('adduser', _username);
});
core.socket.on('useropen',function(data){
    core.username=data.username;
});
core.socket.on('userjoin',function(data){
    // username=data.username;
    // topTips(joinhtml(data,'加入'));
    $('.work_detailBox').append(core.msgHtml.systemmsg({tit:"系统通知",stage:"加入",msg:data}));
    core.scrollBottom();
});
core.socket.on('userleave',function(data){
    // topTips(joinhtml(data,'退出'));
    $('.work_detailBox').append(core.msgHtml.systemmsg({tit:"系统通知",stage:"退出",msg:data}));
    core.scrollBottom();
});
core.socket.on('showmessage',function(data){
    // console.log("show:"+data.message);
    // let userinfo=await this.session('userinfo');
    console.log('session:'+core.username);
    console.log('data:'+data.username);
    $('.work_detailBox').append(core.msgHtml.usermsg(data));
    core.scrollBottom();
});
core.socket.on('isme',function(data){
    if(data.turnname===data.username){
        core.isMe=true;
    }else{
        core.isMe=false;
    };
});

////绘画
core.socket.on('sharepaitstart',function(data){
        // console.log("startx:"+data.x,"starty:"+data.y);
    if(data.isPen){
        core.paint.freeDraw.s(core.ctx,data);
    }else{
        core.paint.eraser.s(core.ctx,data);
    }
});
core.socket.on('sharepaitmove',function(data){
    // console.log("movex:"+data.x,"movey:"+data.y);
    if(data.isPen){
        core.paint.freeDraw.m(core.ctx,data);
    }else{
        core.paint.eraser.m(core.ctx,data);
    }
});
core.socket.on('sharepaitend',function(data){
        // console.log("endx:"+data.x,"endy:"+data.y)
    if(data.isPen){
        core.paint.freeDraw.e(core.ctx,data);
    }else{
        core.paint.eraser.e(core.ctx,data);
    }
});

