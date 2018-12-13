//调回到跳转过来的界面
$("#chat-back").click(function () {
    let backUrl = document.referrer;
    window.location.href = backUrl;
})

$(function () {
    let name = null;
    let curName = null;
    let box = $(".chat-content");
    let msg = box.find("li");
    box.empty();
    
    let ws = new WebSocket("ws://192.168.52.92:8081");
    //连接建立成功后  绑定发送按钮的点击事件
    ws.onopen = function () {
        $(".chat-foot span").click(function () {
            let v = $(".chat-foot textarea").val();
            ws.send(v);
            $(".chat-foot textarea").val("");
        })
        ws.onmessage = function ({ data }, e) {
            e = window.event || e;
            e.stopPropagation();
            data = JSON.parse(data)
            curName = data.sender.slice(5);
            console.log(data.sender)
            if (data.code) {
                name = data.name;
                compare(data);
            } else {
                render(data)
            }
        }

        function compare(data) {
            if (name == curName) {
                $(".chat-content li p").css("color", "red");
                render(data);
            } else {
                render(data)
            }
        }
        //将消息渲染到页面中
        function render(info) {
            let { sender, value } = info

            let newMsg = msg.clone(false)

            newMsg.find("span").text(sender)
            newMsg.find("p").text(value)

            box.append(newMsg)
        }
    }
})