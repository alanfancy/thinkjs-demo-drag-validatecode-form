;(($)=>{
    $.fn.wylValidate=function(options,callback){
        let defaults={
            font:{///图片内文字样式
                size:"2.6rem",
                family:"serif",
                txt:"拖动拼图完成验证",
                x:20,//文字位置
                y:50//文字位置
            },
            ///拼图方块参数
            puzzle:{
                //小格子尺寸
                draw:{
                    w:8,
                    h:8,
                    offset:4
                },
                //方块尺寸
                make:{
                    w:60,
                    h:60
                }
            },
            sbardata:{//滑动手柄
                txt:"向右滑动滑块填充拼图"
            },
            ///样式路径补充 用于拼接 '../static/common/plugin/uploadfile/'
            staticPath:'../static/common/plugin/slidevalidate/'
        };
        let opts=$.extend(defaults,options),wyl=this,
            bgArr=["test","test2"],
            barSize=60,//拖动手柄宽度
            canvasBox=null,
            boxW=320,//背景图片尺寸
            boxH=160,//背景图片尺寸
            imgObj={},//装载背景
            //生成随机数  offset 值范围控制，max 偏移控制
            newRandom= (max,offset)=>{
                let random=Math.floor(Math.random()*max);
                if(offset){
                    random+=offset;
                }
                return random;
            },
            //程序初始化
            init=()=>{
                ///处理背景图片，加文字
                getBase64(randomBgUrl(),function(_dataURL){
                    //创建背景
                    imgObj.bg = drawBgImage({
                        url: _dataURL
                    },function(bgRes){
                        //imgObj.bg=bgRes.url;
                        drawValidateBar({
                            url: _dataURL
                        },function(barRes){
                            //imgObj.bar =barRes.url;
                            imgObj.x=_tx;
                            imgObj.state=1;///stage=1为上传参数 2 为对比参数
                            if(!imgObj.x)return;
                            /*$.post('/validateimg', imgObj, function (res) {
                                console.log(res);
                                if(res.data.state==1){
                                    $(canvasBox).append(createImg(barRes.url, 'imgValid'));
                                    $(canvasBox).append(createImg(bgRes.url,'imgBg'));
                                }
                            });*/
                            $(canvasBox).append(createImg(barRes.url, 'imgValid'));
                            $(canvasBox).append(createImg(bgRes.url,'imgBg'));
                        });
                    });
                });
            },
            //随机背景
            randomBgUrl=()=>{
                var num=Math.floor(Math.random()*bgArr.length);
                var imgurl=opts.staticPath+"images/"+bgArr[num]+'.png';
                return imgurl;
            },
            //背景图片加载并转换
            getBase64=(url,callback)=>{
                //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
                let Img = new Image(),dataURL='';
                Img.src=url;
                Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
                    //获取外围尺寸
                    boxW=$(canvasBox).width();
                    _tx=newRandom(boxW/2-barSize,boxW/2);_ty=newRandom(boxH-barSize,0);
                    let canvas = document.createElement("canvas"), //创建canvas元素
                        width=boxW, //确保canvas的尺寸和图片一样
                        height=boxH,
                        ctx=canvas.getContext("2d");
                    canvas.width=width;
                    canvas.height=height;
                    ctx.drawImage(Img,0,0,width,height); //将图片绘制到canvas中
                    ctx.font = opts.font.size+" "+opts.font.family;
                    ctx.strokeText(opts.font.txt, opts.font.x, opts.font.y);
                    dataURL=canvas.toDataURL('image/jpeg'); //转换图片为dataURL
                    callback?callback(dataURL):null; //调用回调函数
                };
            },
            //绘制背景
            drawBgImage=(_data,callback)=>{
                let Img = new Image(),dataURL='';
                Img.src=_data.url;
                Img.onload=()=>{ //要先确保图片完整获取到，这是个异步事件
                    //let canvas=document.getElementById('canvas1');
                    let canvas = document.createElement("canvas"), //创建canvas元素
                    ctx = canvas.getContext('2d'),
                        width=Img.width, //确保canvas的尺寸和图片一样
                        height=Img.height;
                    canvas.width=width;
                    canvas.height=height;
                    canvas.getContext("2d").drawImage(Img,0,0,width,height); //将图片绘制到canvas中
                    drawPuzzle({
                        ctx:ctx,
                        x:_tx,
                        y:_ty,
                        isValid:false
                    },(res)=>{
                        //console.log(res.dy);
                    });
                    dataURL=canvas.toDataURL('image/jpeg'); //转换图片为dataURL
                    callback?callback({url:dataURL}):null; //调用回调函数
                };
                //}
            },
            //拼图合成程序
            drawValidateBar=(_data,callback)=>{
                let Img = new Image(),dataURL='';
                Img.src=_data.url;
                Img.onload=()=>{ //要先确保图片完整获取到，这是个异步事件
                    //let canvas=document.getElementById('canvas1');
                    let canvas = document.createElement("canvas"), //创建canvas元素
                    ctx = canvas.getContext('2d'),
                    width=Img.width, //确保canvas的尺寸和图片一样
                        height=Img.height;
                    canvas.width=width;
                    canvas.height=height;
                    canvas.getContext("2d").drawImage(Img,0,0,width,height); //将图片绘制到canvas中
                    ctx.globalCompositeOperation="destination-in";
                    drawPuzzle({
                        ctx:ctx,
                        x:_tx,
                        y:_ty,
                        isValid:true
                    },(res)=>{
                        //console.log(res.dy);
                    });

                    let canvas2 = document.createElement("canvas"), //创建canvas元素
                        ctx2 = canvas2.getContext('2d'),
                        width2=opts.puzzle.make.w, //确保canvas的尺寸和图片一样
                        height2=opts.puzzle.make.h;
                    canvas2.width = width2;
                    canvas2.height = 160;
                    let dataImg=ctx.getImageData(_tx,_ty,canvas2.width,canvas2.height);
                    ctx2.putImageData(dataImg,0,_ty,0,0,canvas2.width,canvas2.height);

                    dataURL=canvas2.toDataURL('image/png'); //转换图片为dataURL
                    callback?callback({url:dataURL}):null; //调用回调函数
                };
            },
            //绘制拼图
            drawPuzzle=(_data,callback)=>{
                /////绘制拼图的形状
                _data.ctx.save();
                //opts.ctx.lineWidth = 15;
                //opts.ctx.lineCap ="butt";
                _data.ctx.beginPath();
                _data.ctx.translate(_data.x,_data.y);
                let dx=opts.puzzle.draw.w;
                let dy=opts.puzzle.draw.h;
                let offset=opts.puzzle.draw.offset;
                _data.ctx.moveTo(dx,dy*2);
                _data.ctx.lineTo(dx,dy*3);
                //_data.ctx.bezierCurveTo(-dx-offset/2, dy*2,-dx-offset/2,dy*4, 0, dy*4);
                _data.ctx.quadraticCurveTo(-offset, dy*4, dx, dy*5);//圆弧左
                _data.ctx.lineTo(dx,dy*6);
                _data.ctx.quadraticCurveTo(dx, dy*7, dx*3, dy*7);//圆角左下
                _data.ctx.lineTo(dx*3,dy*7);
                _data.ctx.quadraticCurveTo(dx*4, dy*6-offset, dx*5, dy*7);//圆弧下
                _data.ctx.lineTo(dx*6,dy*7);
                _data.ctx.quadraticCurveTo(dx*7, dy*7, dx*7, dy*6);//圆角右下
                _data.ctx.lineTo(dx*7,dy*5);
                _data.ctx.quadraticCurveTo(dx*6-offset, dy*4, dx*7, dy*3);//圆弧右
                _data.ctx.lineTo(dx*7,dy*2);
                _data.ctx.quadraticCurveTo(dx*7, dy, dx*6, dy);//圆角右上
                _data.ctx.lineTo(dx*5,dy);
                _data.ctx.quadraticCurveTo(dx*4, -offset, dx*3, dy);//圆弧上
                _data.ctx.lineTo(dx*2,dy);
                _data.ctx.quadraticCurveTo(dx, dy, dx, dy*2);//圆角左上
                _data.ctx.closePath();
                ///isValid为true时，判断是活动的滑块, 否则是固定在背景的滑块，
                if(!_data.isValid){
                    ///固定在背景的滑块
                    // 创建渐变
                    /*let radgrad = opts.ctx.createRadialGradient(45,45,10,52,50,30);
                     radgrad.addColorStop(0, '#A7D30C');
                     radgrad.addColorStop(0.9, '#019F62');
                     radgrad.addColorStop(1, 'rgba(1,159,98,0)');*/

                    // opts.ctx.globalAlpha = 0.8;
                    _data.ctx.fillStyle="rgba(0,0,0,0.5)";
                    // opts.ctx.shadowBlur = 10;
                    _data.ctx.shadowColor = "rgba(255,255,255,1)";
                    _data.ctx.shadowOffsetY = 1;
                    _data.ctx.shadowOffsetX = 1;
                    _data.ctx.shadowBlur = 2;
                }
                _data.ctx.fill();
                if(callback){
                    callback({
                        dy:dy
                    });
                }
            },
            //创建图像
            createImg=(_url,cls)=>{
                let html="<p class='wyl_validatebg "+cls+"' ><img src="+_url+" /></p>";
                return html;
            },
            //移除画布
            /*removeCanvas=(canvas)=>{
            canvas.parentNode.removeChild(canvas);
        },*/
            //框架结构
            layoutHtml=()=>{
                let html="<div class='wyl_validateBox'>" +
                        "<i class='refresh'></i>"+
                        "<div class='wyl_canvasBox'>&nbsp;</div>" +
                        "<div class='wyl_barBox'>" +
                            "<p id='slideBar' class='wp1 slideBar'></p>" +
                            "<p class='wp1 slideBarBg'></p>"+
                            "<p class='wp2 slideTips start'><i></i><span>"+opts.sbardata.txt+"</span></p>" +
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
            },mx1,mx2,mx3,
            //拖动手柄时底层效果
            slideBarWidth=(width)=>{
                if(width<=1){
                    $('.slideBarBg').hide();
                }else{
                    $('.slideBarBg').show().width(width+10);
                }
            },
            //重置 重置拖动位置，事件，显示，刷新
            slideReset=()=>{
                $(wyl).find('.slideBarBg').show();
                $(wyl).find('.slideBar').show();
                $(wyl).find('.slideBar').animate({
                    left:0
                },200);
                $(wyl).find('.imgValid').animate({
                    left:0
                },200);
                $(wyl).find('.slideBarBg').animate({
                    width:0
                },200,()=>{
                    $(wyl).find('.slideBarBg').hide();
                    //提示文字
                    $(wyl).find('.slideTips').removeClass().addClass('wp2 slideTips start').find("span").html(opts.sbardata.txt).show();
                    refresh();
                });

            },
            //拖动成功
            slideSuccess=()=>{
                $(wyl).find('.refresh').hide();
                $(wyl).find('.slideBarBg').hide();
                $(wyl).find('.slideBar').hide();
                $(wyl).find('.slideTips').removeClass().addClass('wp2 slideTips success').find("span").html("验证成功").show();
                callback?callback({state:1}):null;
            },
            //拖动范围计算
            slideY=(x1,x2)=>{
                let x3=x2-x1;
                if(x3<barSize/2){
                    x3=barSize/2;
                }else if(x3>boxW-barSize/2-2){
                    x3=boxW-barSize/2-2;
                }
                return x3;
            },
            //拖动范围计算
            slideArea=(e)=>{
                mx2=e.clientX;
                mx3=slideY(mx1,mx2);
                $('.slideBar').css({
                    left:mx3-barSize/2
                });
                $('.imgValid').css({
                    left:mx3-barSize/2
                });
                $(wyl).find('.slideTips').find('span').html('');
                slideBarWidth(mx3-barSize/2);
            },
            touchEvent=(x3)=>{
                if(x3<barSize/2){
                    x3=barSize/2;
                }else if(x3>boxW-barSize/2-2){
                    x3=boxW-barSize/2-2;
                }
                $('.slideBar').css({
                    left:x3-barSize/2
                });
                $('.imgValid').css({
                    left:x3-barSize/2
                });
                slideBarWidth(x3-barSize/2);
            },
            ///鼠标事件
            slideHandler=()=>{
                //鼠标拖动
                $(wyl).find('.slideBar').mousedown((e)=>{
                    $(this).addClass('action');
                    mx1=$(this).offset().left;
                    $(wyl).find('.slideBar').mousemove((e)=>{
                        slideArea(e);
                    });
                    $(document).mouseup((e)=>{
                        //手动事件
                        slideArea(e);
                        //禁止事件
                        disableHandler();
                        ///分析是否吻合
                        analysis((res)=>{

                            if(res==1){
                                slideSuccess();
                                //console.log("验证成功")
                            }else{
                                slideReset();
                                //console.log("验证失败")
                            }
                        })
                    }).mousemove((e)=>{
                        slideArea(e);
                    });
                });
                //触摸拖动
                var slideBar = document.getElementById('slideBar');
                slideBar.addEventListener('touchmove', function (event) {
                    $(wyl).find('.slideTips').find('span').html('');
                }, false);
                slideBar.addEventListener('touchmove', function (event) {
                    // 如果这个元素的位置内只有一个手指的话
                    if (event.targetTouches.length == 1) {
                        event.preventDefault();// 阻止浏览器默认事件，重要
                        var touch = event.targetTouches[0];
                        // 把元素放在手指所在的位置
                        var x3 = touch.pageX - 30;
                        touchEvent(x3);
                    }
                }, false);
                slideBar.addEventListener('touchend', function (event) {
                    //禁止事件
                    disableHandler();
                    ///分析是否吻合
                    analysis((res) => {
                        if (res == 1) {
                            slideSuccess();
                        } else {
                            slideReset();
                        }
                    })
                }, false);
                //刷新
                $(wyl).find('.refresh').unbind().click(()=>{
                    refresh();//刷新
                });
            },
            //刷新
            refresh=()=>{
                    ///禁止拖动
                    disableHandler();
                    $(canvasBox).empty();
                    //$(canvasBox).find('.imgValid').css("left",0);
                    //开始
                    start();
            },
            ///分析是否吻合
            analysis=(callback)=>{
                let left=parseInt($(canvasBox).find('.imgValid').css("left")),_data={};
                _data.state=2;
                _data.x=left;
                if(_tx <= left*1 + 5 && _tx >= left*1 - 5){
                    callback?callback(1):null;
                }else{
                    callback?callback(0):null;
                };
                /*$.post('/validateimg',_data, function (res) {
                    if(res.data.state==1){
                        callback?callback(1):null;
                    }else{
                        callback?callback(0):null;
                    };
                });*/
            },
            ///禁止拖动
            disableHandler=()=>{
                $(wyl).find('.slideBar').removeClass('action').unbind();
                $(document).unbind();
                $(wyl).find('.refresh').unbind();
            },
            //开始
            start=()=>{
                //初始化
                init();
                //拖动事件
                slideHandler();
            };
            //加载样式文件
            addLink(opts.staticPath+"css/slidevalidate.css","stylesheet");
            return wyl.each(()=>{
                //加载html框架
                $(this).append(layoutHtml());
                canvasBox=$(this).find(".wyl_canvasBox");
                //初始化
                start();
            });
    }
})(window.jQuery);