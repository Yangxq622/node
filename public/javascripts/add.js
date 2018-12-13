//渲染下拉框的数据
$(function () {
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
    //上传数据库 添加
    $("#edit").click(function () {
        let type = $(".dish-type select").val();
        let name = $(".dish-name input").val();
        let price = $(".dish-price input").val();
        let newPrice = $(".dish-new-price input").val();
        let intro = $(".dish-intro textarea").val();
        let imgSrc = $(".dish-img img").attr("src");
        let data = { type, name, price, newPrice, intro ,imgSrc}
        if (type && name && price && newPrice) {
            //都不为空 传入数据库
            $.ajax({
                url: "/ajax/addDish",
                type: "post",
                data,
                success({code,msg}){
                    if(code == 200){
                        alert(msg);
                        window.location.href = "/dish";
                    }else{
                        alert(msg);
                    }    
                }
            })
        } else {
            alert("关键字段不能为空");
        }
    })
    //返回
    $("#back").click(function(){
        window.location.href = "/dish";
    })
})

