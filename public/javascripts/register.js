$("#register").submit(function(e){
    e = window.event || e;
    e.preventDefault();

    let username = this.username.value;
    let password = this.password.value;
    let password1 = this.password1.value;

    //首先正则验证
    let nameReg = /[0-9a-zA-Z]{4,10}/;
    let passReg = /[0-9a0zA-Z_]{6,12}/;

    let flag1 = false;
    let flag2 = false;
    let flag3 = $("input[type='checkbox']").is(':checked');
    
    if(flag3){
        if(nameReg.test(username) && passReg.test(password)){
            flag1 = true;
        }else{
            $("#tip").text("用户名或密码不合法")
        }
    
        if(password == password1){
            flag2 = true;
        }else{
            $("#pwdTip").html("密码不一致");
        }
    }else{
        alert("您需要同意才能继续");
    }
    
    //正则合法后发起ajax请求
    if(flag1 && flag2 && flag3){
       $.ajax({
        url: "/ajax/register",
        type: "post",
        data: {username,password},
        success: function(result){
            if(result.code == 200){
                alert("即将前往登录界面");
                window.location.href = "/login";
            }else{
                alert(result.msg);
            }
        }
       })    
    }
})