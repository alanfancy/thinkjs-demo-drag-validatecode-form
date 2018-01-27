function errMsg(msg){
    	var html="<div class='validbox mt20'><p class='validtxt'><i class='icon icon-chucuo prt2'></i><span>"+msg+"</span></p></div>";
    	$('.validOutBox').empty().append(html);
    }
function phoneCode(mobile){
    if(mobile==''){
        errMsg('请输入手机号');
        return false;
    }
    var rex=/^(1(3|4|5|7|8)([0-9]{9}))$/;
    if (!rex.test(mobile)) {
        errMsg('手机号码格式不正确');
        return false;
    }
    return true;
}
function clearForm(){
    $('.validbox').remove();
    $("input[name='mobile']").val('');
    $("input[name='vcode']").val('');
    $("input[name='password']").val('');
}
function fetchValidCode(){
    $('.validCode').find('img').attr({"src":'/home/user/imgcode?vtime='+Math.random()});
}
function getJsonLength(jsonData){
    var jsonLength = 0;
    for(var item in jsonData){
    jsonLength++;
    }
    return jsonLength;
}
$(function(){
    $('.formBox').find('input').focus(function(){
        $(this).parents('.formBox').addClass('active');
    }).blur(function(){
        $(this).parents('.formBox').removeClass('active');
    });
    $('.validCode').click(function(){
        fetchValidCode();
    });
    $('.forgetBtn').click(function(){
    	alert('你怎么不去屎啊？')
    });
    $("#suginForm").keydown(function(e){
         var e = e || event,
         keycode = e.which || e.keyCode;
         if (keycode==13) {
            $(".signupBtn").trigger("click");
         }
    });
	$('.signupBtn').click(function(){
		var mobile=$("input[name='mobile']").val();
		if(!phoneCode(mobile)) return;
		var password=$("input[name='password']").val();
		if(password=='' || password.length<6 || password.length>14) {
            errMsg("请输入6~14位密码");
            return;
        };
		$.ajax({
			type:'POST',
			data:$('#suginForm').serialize(),
			url:'/home/user/signupvalid',
			success:function(result){
                console.log(result);
                fetchValidCode();
                if(result.errno=='0'){
                    clearForm();
                    alert('注册成功，请登陆');
                    window.open('/login','_self');
                }else{
                    if(getJsonLength(result.data)>0){
                        $.each(result.data,function(key){
                            errMsg(result.data[key]);
                            return;
                        });
                    }else{
                        errMsg(result.errmsg);
                        return;
                    };
                }
                //错误：{"errno":1000,"errmsg":"validate error","data":{"password":"密码长度为6~14位"}}
                //正确：{"errno":0,"errmsg":"","data":{"id":23,"type":"add"}}
                //fail: {"errno":1000,"errmsg":"验证码错误"}
                //fail:{"errno":1000,"errmsg":"validate error","data":{"mobile":"mobile 不能为空"}}
			},
            error:function(XMLHttpRequest,textStatus,errorThrow){
                console.log("XMLHttpRequest.status:"+XMLHttpRequest.status);  
                console.log("XMLHttpRequest.readyState:"+XMLHttpRequest.readyState);  
                console.log("textStatus:"+textStatus); 
            }
		})
	});
    $("#loginForm").keydown(function(e){
         var e = e || event,
         keycode = e.which || e.keyCode;
         if (keycode==13) {
            $(".loginBtn").trigger("click");
         }
    });
	$('.loginBtn').click(function(){
		var mobile=$("input[name='mobile']").val();
    	if(!phoneCode(mobile)) return;
    	var password=$("input[name='password']").val();
		if(password=='' || password.length<6 || password.length>14) {
            errMsg("请输入6~14位密码");
            return;
        };
		$.ajax({
			type:'POST',
			data:$('#loginForm').serialize(),
			url:"/home/user/loginvalid",
			success:function(result){
				console.log(result);
                if(result.errno=='0'){
                    alert('登陆成功，即将跳转至首页');
                    clearForm()
                    window.open('/discuss','_self');
                }else{
                    if(getJsonLength(result.data)>0){
                        $.each(result.data,function(key){
                            errMsg(result.data[key]);
                            return;
                        });
                    }else{
                        errMsg(result.errmsg);
                        return;
                    };
                }
			}
		});
	});
})