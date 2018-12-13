//需要搜索 分页  退桌 删除 添加
$(function () {
    let pageBox = $(".page")
    let box = $(".tbody ul");
    let pageBtn = $(".page .page-btn");
    let changeBtn = $(".page-box .btn-change");
    //最多有多少页
    let pageCount = 0;
    //搜索事件
    let key = "";
    getData(1, 5, key);
    $(".search button").click(function () {
        key = $(this).prev("input").val();
        getData(1, 5, key);
    })
    //发起请求渲染页面
    function getData(page, pageSize, key) {
        $.ajax({
            url: "/ajax/cuisines",
            type: "get",
            data: { page, pageSize, key },
            success({ list, count }) {
                render(list);
                pageCount = count;
                renderPage(page, count);
            }
        })
    }
    //渲染页面的函数
    function render(list) {
        $(".tbody").empty();
        list.map(item => {
            let con = box.clone(false);
            let code = item._id.substring(item._id.length - 3);
            con.find("#code").text(code);
            con.find("#name").text(item.name);
            $(".tbody").append(con);
        })
    }
    /**
    * 传入当前页和总页数 渲染分页
    * @param {Number} page 当前页码数
    * @param {Number} count  总共有多少页
    */
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
    //分页中每个页码的点击事件 动态生成利用事件委托绑定
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
    //添加事件
    $(".add span").click(function () {
        wrapBox.init({
            width: 600,
            height: 200,
            headerTip: "新增菜系",
            headerContent: `新菜系名字:<input id="csName">`,
            cancelContent: {
                html: "取消",
                fn: function () {
                    alert("放弃新增");
                }
            },
            confirmContent: {
                html: "确定",
                fn: function () {
                    //向数据库添加数据
                    let name = $("#csName").val();
                    if (name) {
                        let index = $(".page-btn").length;
                        $.ajax({
                            url: "/ajax/addCuisine",
                            type: "get",
                            data: { name },
                            success(result) {
                                alert(result.msg);
                                getData(index, 5, key)
                            }
                        })
                    } else {
                        alert("插入数据不能为空");
                    }
                }
            }
        });
    })
    //删除的点击事件
    $(".tbody").on("click", ".del", function () {
        let name = $(this).parent().siblings("#name").text();
        wrapBox.init({
            width: 300,
            height: 120,
            headerTip: "确认删除操作",
            headerContent: `请确认您是否要删除该餐桌信息`,
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
                        url: "/ajax/delCuisine",
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
    //菜系名字更新事件
    $(".tbody").on("click", ".out", function () {
        let oldName = $(this).parent().siblings("#name").text();
        wrapBox.init({
            width: 300,
            height: 120,
            headerTip: "修改菜系信息",
            headerContent: `菜系名称：<input type="text" id="cus">`,
            cancelContent: {
                html: "返回",
                fn: function () {
                    alert("放弃修改")
                }
            },
            confirmContent: {
                html: "修改",
                fn: function () {
                    let newName = $("#cus").val();//名字获取生效
                    if (newName) {
                        let index = $(".page-btn.active").text();
                        $.ajax({
                            url: "/ajax/updateCuisine",
                            type: "get",
                            data: { oldName, newName },
                            success({code,msg}) {
                                alert(msg);
                                getData(index, 5, key)
                            }
                        })
                    } else {
                        alert("修改的新数据不能为空");
                    }
                }
            }
        });
    })
})