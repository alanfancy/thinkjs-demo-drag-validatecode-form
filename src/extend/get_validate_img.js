
function getBase64(url)
{
    //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
    //console.log(boxW,boxH);
    let Img = new Image(), dataURL = '';
    Img.src = url;
    Img.onload = function () { //要先确保图片完整获取到，这是个异步事件
        let canvas = document.createElement("canvas"), //创建canvas元素
            width = boxW, //确保canvas的尺寸和图片一样
            height = boxH,
            ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
        ctx.font = opts.font.size + " " + opts.font.family;
        ctx.strokeText(opts.font.txt, opts.font.x, opts.font.y);

        dataURL = canvas.toDataURL('image/jpeg'); //转换图片为dataURL
        return dataURL;
        //callback ? callback(dataURL) : null; //调用回调函数
    };
}
//绘制背景
function drawBgImage(_data)
{
    let Img = new Image();
    let dataURL = '';
    Img.src = _data.url;
    Img.onload = () => { //要先确保图片完整获取到，这是个异步事件
        //let canvas=document.getElementById('canvas1');
        let canvas = document.createElement("canvas"), //创建canvas元素
            ctx = canvas.getContext('2d'),
            width = Img.width, //确保canvas的尺寸和图片一样
            height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
        drawPuzzle({
            ctx: ctx,
            x: _tx,
            y: _ty,
            isValid: false
        });
        dataURL = canvas.toDataURL('image/jpeg'); //转换图片为dataURL
        return dataURL;
        //callback ? callback({url: dataURL}) : null; //调用回调函数
    };
    //}
}
//拼图合成程序
function drawValidateBar(_data)
{
    let Img = new Image(), dataURL = '';
    Img.src = _data.url;
    Img.onload = () => { //要先确保图片完整获取到，这是个异步事件
        //let canvas=document.getElementById('canvas1');
        let canvas = document.createElement("canvas"), //创建canvas元素
            ctx = canvas.getContext('2d'),
            width = Img.width, //确保canvas的尺寸和图片一样
            height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
        ctx.globalCompositeOperation = "destination-in";
        drawPuzzle({
            ctx: ctx,
            x: _tx,
            y: _ty,
            isValid: true
        });

        let canvas2 = document.createElement("canvas"), //创建canvas元素
            ctx2 = canvas2.getContext('2d'),
            width2 = opts.puzzle.make.w, //确保canvas的尺寸和图片一样
            height2 = opts.puzzle.make.h;
        canvas2.width = width2;
        canvas2.height = 160;
        let dataImg = ctx.getImageData(_tx, _ty, canvas2.width, canvas2.height);
        ctx2.putImageData(dataImg, 0, _ty, 0, 0, canvas2.width, canvas2.height);

        dataURL = canvas2.toDataURL('image/png'); //转换图片为dataURL
        return dataURL;
        //callback ? callback({url: dataURL}) : null; //调用回调函数
    };
}
//绘制拼图
function drawPuzzle(_data)
{
    /////绘制拼图的形状
    _data.ctx.save();
    //opts.ctx.lineWidth = 15;
    //opts.ctx.lineCap ="butt";
    _data.ctx.beginPath();
    _data.ctx.translate(_data.x, _data.y);
    let dx = opts.puzzle.draw.w;
    let dy = opts.puzzle.draw.h;
    let offset = opts.puzzle.draw.offset;
    _data.ctx.moveTo(dx, dy * 2);
    _data.ctx.lineTo(dx, dy * 3);
    //_data.ctx.bezierCurveTo(-dx-offset/2, dy*2,-dx-offset/2,dy*4, 0, dy*4);
    _data.ctx.quadraticCurveTo(-offset, dy * 4, dx, dy * 5);//圆弧左
    _data.ctx.lineTo(dx, dy * 6);
    _data.ctx.quadraticCurveTo(dx, dy * 7, dx * 3, dy * 7);//圆角左下
    _data.ctx.lineTo(dx * 3, dy * 7);
    _data.ctx.quadraticCurveTo(dx * 4, dy * 6 - offset, dx * 5, dy * 7);//圆弧下
    _data.ctx.lineTo(dx * 6, dy * 7);
    _data.ctx.quadraticCurveTo(dx * 7, dy * 7, dx * 7, dy * 6);//圆角右下
    _data.ctx.lineTo(dx * 7, dy * 5);
    _data.ctx.quadraticCurveTo(dx * 6 - offset, dy * 4, dx * 7, dy * 3);//圆弧右
    _data.ctx.lineTo(dx * 7, dy * 2);
    _data.ctx.quadraticCurveTo(dx * 7, dy, dx * 6, dy);//圆角右上
    _data.ctx.lineTo(dx * 5, dy);
    _data.ctx.quadraticCurveTo(dx * 4, -offset, dx * 3, dy);//圆弧上
    _data.ctx.lineTo(dx * 2, dy);
    _data.ctx.quadraticCurveTo(dx, dy, dx, dy * 2);//圆角左上
    _data.ctx.closePath();
    ///isValid为true时，判断是活动的滑块, 否则是固定在背景的滑块，
    if (!_data.isValid) {
        ///固定在背景的滑块
        // 创建渐变
        /*let radgrad = opts.ctx.createRadialGradient(45,45,10,52,50,30);
         radgrad.addColorStop(0, '#A7D30C');
         radgrad.addColorStop(0.9, '#019F62');
         radgrad.addColorStop(1, 'rgba(1,159,98,0)');*/

        // opts.ctx.globalAlpha = 0.8;
        _data.ctx.fillStyle = "rgba(0,0,0,0.5)";
        // opts.ctx.shadowBlur = 10;
        _data.ctx.shadowColor = "rgba(255,255,255,1)";
        _data.ctx.shadowOffsetY = 1;
        _data.ctx.shadowOffsetX = 1;
        _data.ctx.shadowBlur = 2;
    }
    _data.ctx.fill();
}
function newRandom(max, offset)
{
    let random = Math.floor(Math.random() * max);
    if (offset) {
        random += offset;
    }
    return random;
}
module.exports= {
    getValidImg(bgImg)
    {
        let _tx = newRandom(105, 165), _ty = newRandom(100, 0), dataURL = '', imgObj = {};
        dataURL = getBase64(bgImg);
        //创建背景
        imgObj.bg = drawBgImage({
            url: dataURL
        });
        /////创建活动格 手动手柄
        imgObj.bar = drawValidateBar({
            url: dataURL
        });
        if (imgObj.length == 2) {
            return imgObj;
        } else {
            return "error:好像哪里出错了";
        }
    }
}