$("#login").submit(function(e){
    e = window.event || e;
    e.preventDefault();
    let username = this.username.value;
    let password = this.password.value;

    let flag = $("input[type='checkbox']").is(":checked");
    if(flag){
        $.ajax({
            url:"/ajax/login",
            type:"post",
            data:{username,password},
            success(result){
                if(result.code == 200){
                    alert("即将前往后台管理界面首页");
                    window.location.href = "/admin";
                }else{
                    $("#tip").text(result.msg);
                }
            }
        })
    }else{
        alert("您需要同意条款才能继续");
    }
})
// let app = new Vue({
//     el:".box",
//     data:{
//         inputType:"password"
//     },
//     methods:{
//         watch(){
//             this.inputType = "text"
//         },
//         hide(){
//             this.inputType = "password"
//         }
//     }
// })
