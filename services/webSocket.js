let Server = require("ws").Server;

let ws = new Server({
    port: 8081,
    hostname: "192.168.52.92"
})

let clientBox = {};
let count = 1;
//每当有客户端发起连接 事件会被触发
ws.on("connection", client => {
    let key = `admin${count}`
   
    let arr = {
        code : 100,
        name : count
    }

    client.send(JSON.stringify(arr));//告诉客户端身份标识

    clientBox[key] = client;
    count++;
    // client.send({count});  //可以发送
    //一旦任意一个客户端发送消息过来 则需要将其广播到其他客户端
    //message接收消息  send发送消息
    client.on("message", con => {
        let obj = {
            sender: key,
            value: con,
        } 
        obj = JSON.stringify(obj);
        sendAll(obj);
    })
    client.on("close", () => {
        delete clientBox[key];
    })
})
/**
 *  给所有的在线用户发送消息
 * @param {string} content 消息内容 
 */
function sendAll(content) {
    delete content.code;
    for (let key in clientBox) {
        clientBox[key].send(content)
    }
}