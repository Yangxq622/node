/**
 * 1.获取所点击的商品的详细信息并渲染到页面
 * 2.需要所有菜系 渲染下拉框
 * 3.更新后同步数据库
 */
$(function(){
    //渲染下拉框
    $.ajax({
        url: "/ajax/findType",
        type: "get",
        success({ list, sum }) {
            let html = "";
            for (let i = 0; i < list.length; i++) {
                html += `<option>${list[i].name}</option>`;
            }
            $(".dish-type select").html(html);
        }
    })
    //渲染对应数据的页面 通过地址栏的关键字
    let name =decodeURI( window.location.search.split("=")[1]);
    //数据库查找数据渲染页面
    $.ajax({
        url:"/ajax/allDishes",
        type:"get",
        data:{name},
        success({code,msg}){
            $(".dish-type select").val(msg.type);
            $(".dish-name input").val(msg.name);
            $(".dish-price input").val(msg.price);
            $(".dish-new-price input").val(msg.new_price);
            $(".dish-intro textarea").val(msg.intro);
            $(".dish-img img").attr("src",msg.imgSrc);
        }
    })
    //点击返回的函数
    $("#back").click(function(){
        window.location.href = "/dish";
    })
     //显示预览图
     
     $(".dish-img input").change(function () {
        let fd = new FormData()
        let file = this.files[0]
        fd.append("file", file)
        $.ajax({
            url: "/ajax/updateFile",
            type: "post",
            data: fd,
            contentType: false,
            processData: false,
            success({ url }) {
                $(".dish-img img").attr("src", url)
            }
        })
    })
    //上传数据库 修改 需要原名字作为识别符进行更新
    $("#edit").click(function () {
        let oldName = decodeURI(window.location.search.split("=")[1]);
        let type = $(".dish-type select").val();
        let name = $(".dish-name input").val();
        let price = $(".dish-price input").val();
        let newPrice = $(".dish-new-price input").val();
        let intro = $(".dish-intro textarea").val();
        let imgSrc = $(".dish-img img").attr("src");
        let data = { type, name, price, newPrice, intro ,imgSrc,oldName}
        if (type && name && price && newPrice) {
            //都不为空 传入数据库
            $.ajax({
                url: "/ajax/updateDish",
                type: "post",
                data,
                success({code,msg}){
                    if(code == 200){
                        alert(msg);
                        window.location.href = "/dish";
                    }   else{
                        alert(msg);
                    }
                }
            })
        } else {
            alert("关键字段不能为空");
        }
    })

})