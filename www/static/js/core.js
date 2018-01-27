var core={
	username:null,socket:null,isMe:false,isPen:true,penData:{},ctx:null,
	/* 横竖屏时不拉伸
	$(window).resize(resizeCanvas);
 function resizeCanvas() {
        var canvas=$('#canvas');
        canvas.attr("width", $(window).get(0).innerWidth);
        canvas.attr("height", $(window).get(0).innerHeight);
        context.fillRect(0, 0, canvas.width(), canvas.height());
 };
 resizeCanvas();*/

/* 抗锯齿
let width = canvasObj.width,height=canvasObj.height;
if (window.devicePixelRatio) {
                canvasObj.style.width = width + "px";
                canvasObj.style.height = height + "px";
                canvasObj.height = height * window.devicePixelRatio;
                canvasObj.width = width * window.devicePixelRatio;
                penCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
}*/
 	//判断浏览器版本
	getBrowserInfo:function(){
		let agent = navigator.userAgent.toLowerCase() ;
        let regStr_ie = /msie [\d.]+;/gi ;
        let regStr_ff = /firefox\/[\d.]+/gi
        let regStr_chrome = /chrome\/[\d.]+/gi ;
        let regStr_saf = /safari\/[\d.]+/gi ;
		//IE
		if(agent.indexOf("msie") > 0){
            return agent.match(regStr_ie)[0].split('/');
		}
		//firefox
		if(agent.indexOf("firefox") > 0){
            return agent.match(regStr_ff)[0].split('/');
		}
		//Chrome
		if(agent.indexOf("chrome") > 0){
            return agent.match(regStr_chrome)[0].split('/');
		}
		//Safari
		if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0){
            return agent.match(regStr_saf)[0].split('/');
		}
	},
	//获取鼠标位置
	getLocation:function (obj,x, y) {  
        let bbox = obj.getBoundingClientRect();  
        return {  
            x: (x - bbox.left) * (obj.width / bbox.width),  
            y: (y - bbox.top) * (obj.height / bbox.height)  
        }
    },
    //动态link type: stylesheet / prerender 预加载所有资源; 在 Firefox 中或用 rel='next' 来声明
    addLink:function(url,type){
        let hint =document.createElement("link");
        hint.setAttribute("rel",type);
        hint.setAttribute("href",url);
        document.getElementsByTagName("head")[0].appendChild(hint);
    },
    //消息框滚动至底部
    scrollBottom:function(){
        $(".msg_detail").animate({
            scrollTop:$(".work_detailBox").height()
        },100);
    },
    //QQ表情转换
    replace_em:function(str){
        str = str.replace(/\</g,'&lt;');
        str = str.replace(/\>/g,'&gt;');
        str = str.replace(/\n/g,'<br/>');
        str = str.replace(/\[em_([0-9]*)\]/g,'<img src="../static/images/duudle/arclist/$1.gif" border="0" />');
        return str;
    },
    //消息内容
    msgHtml:{
    	//用户消息
    	usermsg:function(data){
             var repmsg=core.replace_em(data.message);
            var classname=(data.username==core.username)?"myTxt":"cusTxt";
            var html="<div class='msgBox "+classname+"'>"+
                "<div class='msginbox'>"+
                    "<div class='msgpanel'>"+
                        "<div class='face'>"+
                            "<img src='../static/images/duudle/face/zl.png' width='20' height='20' />"+
                        "</div>"+
                        "<div class='msgtxt'>"+
                            "<div class='name'>"+data.username+"</div>"+
                            "<div class='msg'>"+repmsg+"</div>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>";
            return html;
        },
        //系统消息
        systemmsg:function(data){//systemTxt
            var html='<div class="systemTxt msgBox">'+
                '<div class="msginbox">'+
                    '<div class="msgpanel">'+
                        '<div class="msgtxt">'+
                            '<div class="msg"><span>'+data.tit+'：</span>'+data.msg.username+data.stage+'了聊天室，共'+data.msg.numUsers+'人</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
            return html;
        }
    },
    ///判断手机用户使用横屏和竖屏
    orient:function () { 
	    if (window.orientation == 90 || window.orientation == -90) { 
	        //ipad、iphone竖屏；Andriod横屏 
	        $("body").attr("class", "landscape"); 
	        orientation = 'landscape'; 
	        return false; 
	    } else if (window.orientation == 0 || window.orientation == 180) { 
	        //ipad、iphone横屏；Andriod竖屏 
	        $("body").attr("class", "portrait"); 
	        orientation = 'portrait'; 
	        return false; 
	    }
	    //页面加载时调用 
		//$(function(){ orient(); }); 
		//用户变化屏幕方向时调用 
		//$(window).bind( 'orientationchange', function(e){ orient(); });
	},
	//绘画模块
	paint:{
		freeDraw:{
			s:function(ctx,data){
				if(data==undefined) return;
				ctx.beginPath();
	            ctx.lineCap = 'round';
	            ctx.lineJoin ='round';
	            ctx.lineWidth = data.lineWidth;
	            ctx.strokeStyle = data.strokeStyle;
	            ctx.moveTo(data.x,data.y);
	            ctx.stroke();
	        },
	        m:function(ctx,data){
	        	if(data==undefined) return;
	        	ctx.lineTo(data.x,data.y);
                ctx.stroke();
	        },
	        e:function(ctx,data){
	        	if(data==undefined) return;
	        	ctx.lineTo(data.x,data.y);
	        	// core.paint.freeDraw.ctx.closePath();
                ctx.stroke();
                ctx.save();
                // ctx.restore();
	        }
		},
		eraser:{
			s:function(ctx,data){
				if(data==undefined) return;
				ctx.beginPath();
	            ctx.lineCap = 'round';
	            ctx.lineJoin ='round';
	            ctx.clearRect(data.x, data.y, data.lineWidth, data.lineWidth);
	        },
	        m:function(ctx,data){
	        	if(data==undefined) return;
	        	ctx.clearRect(data.x, data.y, data.lineWidth, data.lineWidth);
	        },
	        e:function(ctx,data){
	        	if(data==undefined) return;
	        	ctx.clearRect(data.x, data.y, data.lineWidth, data.lineWidth);
	        }
		},
		touchStartHandler:function (event) {
		    core.socket.emit('myturn',{'test':'cccc'});
		    if(!core.isMe) return;
		    let e = event || window.event; 
		    let t=core.getLocation(this,e.touches[0].clientX,e.touches[0].clientY);
		    let data={x:t.x,y:t.y,lineWidth:core.penData.lineWidth,strokeStyle:core.penData.strokeStyle,isPen:core.isPen};

		    if(core.isPen){
		        core.paint.freeDraw.s(core.ctx,data);
		    }else{
		        core.paint.eraser.s(core.ctx,data);
		    }
		    core.socket.emit('paitstart',data);
		},
		touchMoveHandler:function (event){
		    if(!core.isMe) return;
		    let e = event || window.event; 
		    let t=core.getLocation(this,e.touches[0].clientX,e.touches[0].clientY);
		    let data={x:t.x,y:t.y,lineWidth:core.penData.lineWidth,isPen:core.isPen};
		    
		    if(core.isPen){
		        core.paint.freeDraw.m(core.ctx,data);
		    }else{
		        core.paint.eraser.s(core.ctx,data);
		    }
		    core.socket.emit('paitmove',data);
		},
		touchEndHandler:function (event){
		    if(!core.isMe) return;
		    let e = event || window.event; 
		    let t=core.getLocation(this,e.changedTouches[0].clientX,e.changedTouches[0].clientY);
		    let data={x:t.x,y:t.y,lineWidth:core.penData.lineWidth,isPen:core.isPen};
		    
		    if(core.isPen){
		        core.paint.freeDraw.e(core.ctx,data);
		    }else{
		        core.paint.eraser.s(core.ctx,data);
		    }
		    core.socket.emit('paitend',data);
		}
	}
};