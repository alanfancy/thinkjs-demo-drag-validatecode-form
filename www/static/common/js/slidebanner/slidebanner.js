
(function($){
    var autoplay=function(_s,callback){
            return setInterval(function(){
                    if(callback){
                        callback(1);
                    }
                },_s);
            };
    var autostop=function($timeObj){
           clearInterval($timeObj);
    };
    var slideEvent=function(data,callback){
            if(data.slide==='left'){
                if(data.currentNum==0){
                    data.currentNum=data.li.length-1;
                }else{
                    data.currentNum--;
                };
                data.arr.push(data.currentNum);
                if(data.arr.length>2){
                    data.arr.shift();
                };
                if(data.arr[0]!=data.arr[1]){
                    $(data.li).eq(data.arr[1]).css({'left':-data.winWidth});
                    $(data.li).eq(data.arr[0]).animate({'opacity':0,'left':data.winWidth});
                    $(data.li).eq(data.arr[1]).animate({'opacity':1,'left':0},function(){
                        if(callback){
                            callback({
                                arr:data.arr,
                                num:data.currentNum
                            })
                        }
                    });

                }else{
                    return false;   
                };
            }else if(data.slide==='right'){
                if(data.currentNum==data.li.length-1){
                   data.currentNum=0;
                }else{
                   data.currentNum++; 
                }
                data.arr.push(data.currentNum);
                if(data.arr.length>2){
                    data.arr.shift();
                }
                if(data.arr[0]!=data.arr[1]){
                    $(data.li).eq(data.arr[1]).css({'left':data.winWidth});
                    $(data.li).eq(data.arr[0]).animate({'opacity':0,'left':-data.winWidth});
                    $(data.li).eq(data.arr[1]).animate({'opacity':1,'left':0},function(){
                        if(callback){
                            callback({
                                arr:data.arr,
                                num:data.currentNum
                            })
                        }
                    });
                }else{
                    return false;   
                };
            }else if(data.slide==='pointClick'){
                /*if(data.currentNum==data.li.length-1){
                   data.currentNum=0;
                }else{
                   data.currentNum++; 
                }*/
                data.arr.push(data.currentNum);
                if(data.arr.length>2){
                    data.arr.shift();
                }
                if(data.arr[0]!=data.arr[1]){
                    $(data.li).eq(data.arr[1]).css({'left':data.winWidth});
                    $(data.li).eq(data.arr[0]).animate({'opacity':0,'left':-data.winWidth});
                    $(data.li).eq(data.arr[1]).animate({'opacity':1,'left':0},function(){
                        if(callback){
                            callback({
                                arr:data.arr,
                                num:data.currentNum
                            })
                        }
                    });
                }else{
                    return false;   
                };
            };
            data.el.find('.sbtnUl>li').removeClass('active').eq(data.currentNum).addClass('active');
        };
    var touchEvent = function(el,leftFun,rightFun,clickFun){
        var x1,x2,x,x3,y3,moved;
        $(el).bind('touchstart',function(e){
            moved = false ; // moved用于判断是否滑动
                var _touch = e.originalEvent.targetTouches[0];
                x1= _touch.pageX;
                y1= _touch.pageY;
                //e.preventDefault();//阻止页面滚动
            });
            $(el).bind('touchmovie',function(e){
//                    e.preventDefault();
                if(moved) return;
                x3 = e.targetTouches[0].screenX ;
                y3 = e.targetTouches[0].screenY ;
//                if(x3-x1 != 0 || y3-y1 !=0) moved = true;
                if(y3-y1<30){
                    moved = true;
                }else{
                    moved = false;
                }
            });
            $(el).bind('touchend',function(e){
                var _this=$(this);
                if(!moved) // 如果没有滑动就执行
                {
                    var _touch = e.originalEvent.changedTouches[0];
                    x2= _touch.pageX;
                    y2= _touch.pageY;
                    x=x2-x1;
                    if(x>30){
                        leftFun();
                    }else if(x<-30){
                        rightFun();
                    }else{
                        clickFun(el);
                    };
                }
            });
    };
    var touchStopDefault=function(obj){
        $(obj).bind('touchstart',function(e){
            //e.stopPropagation();
            //e.preventDefault();
        });
        $(obj).bind('touchmovie',function(e){
                e.stopPropagation();
                e.preventDefault();
        });
        $(obj).bind('touchend',function(e){
            e.stopPropagation();
            e.preventDefault();
         });
    };
    var touchClick=function(obj,callback){
        var xs='';
        var xe='';
        var ys='';
        var ye='';
        $(obj).bind('touchstart',function(event){
                var _touch1 = event.originalEvent.targetTouches[0];
                xs=_touch1.clientX;
                ys=_touch1.clientY;
            });
        $(obj).bind('touchend',function(event){
                var _this=$(this);
                var _touch2 = event.originalEvent.changedTouches[0];
                xe=_touch2.clientX;
                ys=_touch2.clientY;
                if(Math.abs(xe-xs)<=30 || Math.abs(ye-ys)<=30){
                    if(callback){
                        callback(_this);
                    }
                }else{
                    if(callback){
                        callback(0);
                    }
                }
            });
    }
    $.fn.albumEvent=function(options,callback){
        var defaults={
            showBtn:true,
            showPoint:true,
            showTime:5000
        }
        var opts = jQuery.extend(defaults, options);
        return this.each(function(){
            var $this=$(this);
            var li=$this.find(".albumUl").find('li');
            var obj={};//空对象
            var arr=[];//装载图片顺序数组
            var autoTimeObj=null;//自动播放的时间对象
            //第一个出现的图片
            obj.currentNum=0;
//            var w=$(window).width()<'800'?$(window).width():'800';
            var w="100%";
            //把当前图片添加进数组
            arr.push(obj.currentNum);
            //重置图片位置
            $this.find(".albumUl>li").css({'opacity':0,'width':w,'left':-w}).eq(arr[0]).css({'opacity':1,'left':0});
            //加载图片后，重新计算图片高度
            var heightTime=setInterval(function(){
                    var height=$this.find(".albumUl>li>p>img").height();
                    //console.log("imgH:"+height);
                    if(height){
                        $this.css('height',Math.floor(height));
                        clearInterval(heightTime);
                    }
            },100);
            $(window).resize(function(){
                var heightTime=setInterval(function(){
                        var height=$this.find(".albumUl>li>p>img").height();
                        if(height){
                            $this.css('height',Math.floor(height));
                            clearInterval(heightTime);
                        }
                },100);
            });
            //自动播放事件
            autoPlayFn();
            function autoPlayFn(){
                autoTimeObj=autoplay(opts.showTime,function(e){
                    if(e){
                        slideEvent({
                            el:$this,
                            slide:'right',
                            currentNum:obj.currentNum,
                            li:li,
                            arr:arr,
                            winWidth:w
                        },function(data){
                            arr=data.arr;
                            obj.currentNum=data.num;
                        })
                    }
                });
            };
            //显示左右按钮
            if(opts.showBtn){
                obj.html="<a class='albumBtn albumleft' href='javascript:void(null)'><i class='iconfont icon-shangyige'></i></a><a class='albumBtn albumright' href='javascript:void(null)'><i class='iconfont icon-guanbi01'></i></a>";
                $this.append(obj.html);
                touchClick($this.find(".albumleft"),function(_this){
                    autostop(autoTimeObj);
                    slideEvent({
                        el:$this,
                        slide:'left',
                        currentNum:obj.currentNum,
                        li:li,
                        arr:arr,
                        winWidth:w
                    },function(data){
                        arr=data.arr;
                        obj.currentNum=data.num;
                        autoPlayFn();
                    });
                });
                touchClick($this.find(".albumright"),function(_this){
                    autostop(autoTimeObj);
                    slideEvent({
                        el:$this,
                        slide:'right',
                        currentNum:obj.currentNum,
                        li:li,
                        arr:arr,
                        winWidth:w
                    },function(data){
                        arr=data.arr;
                        obj.currentNum=data.num;
                        autoPlayFn();
                    })
                });
            };
            //显示点状图标
            if(opts.showPoint){
                obj.pointhtml="<ul class='sbtnUl'>";
                for(var i=0;i<li.length;i++){
                    obj.pointhtml+="<li class='sbtnLi' ></li>";
                }
                obj.pointhtml+="</ul>";
                $this.append(obj.pointhtml);
                $this.find('.sbtnUl>li').removeClass('active').eq(obj.currentNum).addClass('active');
                touchClick(".sbtnUl>li",function(_this){
                    autostop(autoTimeObj);
                    slideEvent({
                        el:$this,
                        slide:'pointClick',
                        currentNum:$(_this).index(),
                        li:li,
                        arr:arr,
                        winWidth:w
                    },function(data){
                        arr=data.arr;
                        obj.currentNum=data.num;
                        autoPlayFn();
                    })
                });
            };
            
            //点击事件回调
            /*touchClick(".albumUl>li",function(current){
                alert($(current).index());
                alert($(current).attr('data-url'));
                if(callback){
                    callback(current);
                }
            });*/
            //阻止父级默认事件
            touchStopDefault($this.find(".albumUl"));
            //阻止父级默认事件
            touchStopDefault($this);
            //触摸左右滑动/点击
            touchEvent(li,function(){
                    autostop(autoTimeObj);
                        slideEvent({
                            el:$this,
                            slide:'left',
                            currentNum:obj.currentNum,
                            li:li,
                            arr:arr,
                            winWidth:w
                        },function(data){
                            arr=data.arr;
                            obj.currentNum=data.num;
                            autoPlayFn();
                        })
            },function(){
                autostop(autoTimeObj);
                        slideEvent({
                            el:$this,
                            slide:'right',
                            currentNum:obj.currentNum,
                            li:li,
                            arr:arr,
                            winWidth:w
                        },function(data){
                            arr=data.arr;
                            obj.currentNum=data.num;
                            autoPlayFn();
                        })
            },function(el){
                //console.log($(el).eq(obj.currentNum));
                if(callback){
                    callback($(el).eq(obj.currentNum));
                }
            });
       });
    };
})(window.jQuery);