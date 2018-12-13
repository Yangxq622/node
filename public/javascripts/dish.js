$(function () {
    let pageBox = $(".page")
    let box = $(".tbody ul");
    let pageBtn = $(".page .page-btn");
    let changeBtn = $(".page-box .btn-change");
    //最多有多少页
    let pageCount = 0;
    let key = "";
    getData(1, 5, key);
    //发起请求渲染页面
    function getData(page, pageSize, key) {
        $.ajax({
            url: "/ajax/dishes",
            type: "get",
            data: { page, pageSize, key },
            success({ list, count }) {
                render(list);
                pageCount = count;
                renderPage(page, count);
            }
        })
    }
    //渲染页面函数
    function render(list) {
        $(".tbody").empty();
        list.map(item => {
            let con = box.clone(false);
            let code = item._id.substring(item._id.length - 3);
            con.find("#code").text(code);
            con.find("#name").text(item.name);
            con.find("#sys").text(item.type);
            con.find("#price").text(item.price);
            con.find("#new-price").text(item.new_price);
            $(".tbody").append(con);
        })
    }
    //渲染分页函数
    function renderPage(page, count) {
        pageBox.empty();
        for (let i = 0; i < count; i++) {
            let newPageBtn = pageBtn.clone(false);
            newPageBtn.text(i + 1);
            newPageBtn.attr("data-num", newPageBtn.text());
            pageBox.append(newPageBtn);
        }
        //给当前页加选中样式
        pageBox.find(".page-btn[data-num=" + page + "]").addClass("active").css("background","pink");
    }
    //每个页码的点击事件
    pageBox.on("click", ".page-btn", function () {
        let index = $(this).text();
        getData(index, 5, key);
    })
    //其他按钮的点击事件
    changeBtn.click(function () {
        let type = $(this).attr("data-type");
        //获取当前页数判断临界条件
        let critical = pageBox.find(".active").attr("data-num") * 1;
        if (type == "first") {
            getData(1, 5, key);
        } else if (type == "last") {
            getData(pageCount, 5, key);
        } else if (type == "prev") {
            if (critical > 1) {  //只有第一页没有上一页点击事件
                getData(critical - 1, 5, key);
            }
        } else {
            if (critical < pageCount) {
                getData(critical + 1, 5, key);
            }
        }
    })
    //搜索事件
    $(".search button").click(function () {
        key = $(this).prev("input").val();
        getData(1, 5, key);
    })
    //删除事件
    $(".tbody").on("click", ".del", function () {
        let name = $(this).parent().siblings("#name").text();
        wrapBox.init({
            width: 300,
            height: 120,
            headerTip: "确认删除操作",
            headerContent: `请确认您是否要删除该菜品信息`,
            cancelContent: {
                html: "取消",
                fn: function () {
                    alert("放弃删除");
                }
            },
            confirmContent: {
                html: "确定",
                fn: function () {
                    let index = $(".page-btn.active").text();
                    $.ajax({
                        url: "/ajax/delDish",
                        type: "get",
                        data: { name },
                        success({ code, msg }) {
                            alert(msg);
                            if($(".tbody ul").length == 1){
                                getData(index-1,5,key);
                            }else{
                            getData(index,5,key);
                            }
                        }
                    })
                }
            }
        });
    })
    //添加事件
    $(".add span").click(function () {
        window.location.href = "/set";      
    })
    //编辑事件
    $(".tbody").on("click",".out",function(){
        //获取唯一识别码
        let name = $(this).parent().siblings("#name").text();
        window.location.href = "/edit?name="+ name;
    })
})
//待定
function show() {
    $.ajax({
        url: "/ajax/findType",
        type: "get",
        success({ list, sum }) {
            let html = "";
            for (let i = 0; i < list.length; i++) {
                html += `<option>${list[i].name}</option>`;
            }
            wrapBox.init({
                width: 320,
                height: 350,
                headerTip: "新增菜品",
                headerContent: `
                                    <div class="dish-box">
                                    <div class="dish-type">
                                        <span>菜系：</span>
                                        <select>${html}</select>
                                    </div>
                                    <div class="dish-name">
                                        <span>菜名：</span>
                                        <input type="text">
                                    </div>
                                    <div class="dish-price">
                                        <span>价格：</span>
                                        <input type="text">
                                    </div>
                                    <div class="dish-new-price">
                                        <span>会员价格：</span>
                                        <input type="text">
                                    </div>
                                    <div class="dish-intro">
                                        <span>简介：</span>
                                        <textarea></textarea>
                                    </div>
                                    <div class="dish-img">
                                        <span>菜品图片</span>
                                        <img>
                                        <input type="file" onchange="udi(this)" />
                                    </div>
                                </div>
                        `
                ,
                cancelContent: {
                    html: "取消",
                    fn: function () {
                        alert("放弃新增");
                    }
                },
                confirmContent: {
                    html: "确定",
                    fn: function () {
                        // //向数据库添加数据
                        // let type = $(".dish-type select").val();
                        // let name = $(".dish-name input").val();
                        // let price = $(".dish-price input").val();
                        // let new_price = $(".dish-price").val();
                    }
                }
            })
        }
    })
}
function udi(ele) {
    console.log(ele)
    // ele.change(function () {
        let fd = new FormData()
        let file = ele.files[0]
        fd.append("file", file)

        $.ajax({
            url: "/ajax/updateFile",
            type: "post",
            data: fd,
            contentType: false,
            processData: false,
            success({ url }) {
                console.log($(".dish-img img")[0])
                $(".dish-img img").attr("src", url)
            },
            error(err){
                console.log("文件上传出错")
                console.log(err)
            }
        })
    // })
}