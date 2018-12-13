let con = $(".welcome-top p span").text();
//侧边栏的点击跳转效果
$(".menu li:nth-child(1)").click(function () {
    if (con != "") {
        window.location.href = "/tables";
    } else {
        tip();
    }
})
$(".menu li:nth-child(2)").click(function () {
    if (con != "") {
        window.location.href = "/cuisine";
    } else {
        tip();
    }
})
$(".menu li:nth-child(3)").click(function () {
    if (con != "") {
        window.location.href = "/dish";
    } else {
        tip();
    }
})
// 退出登录
$(".log-out").click(function(){
    $.ajax({
        url:"/ajax/logOut",
        type:"post",
        success:function({code,msg}){
            if(code == 200){
                alert(msg);
                window.location.href = "/login"
            }
        }
    })
})
function tip() {
    wrapBox.init({
        width: 200,
        height: 80,
        headerTip: "友情提示",
        headerContent: `登录之后才有权限操作`,
        cancelContent: {
            html: "取消",
            fn: function () {
                alert("我看你是要抛弃我了")
            }
        },
        confirmContent: {
            html: "确定",
            fn: function () {
                window.location.href = "/login"
            }
        }
    });
}


