let mc = require("mongodb").MongoClient;
let {host,port,dbname} = require("../config").db;

let db = null;

mc.connect(`mongodb://${host}:${port}`,(err,client) => {
    if(!err){
        db = client.db(dbname);
        console.log("数据库连接成功");
    }else{
        console.log("数据库连接失败,原因如下:");
        console.log(err);
    }
})

module.exports = collName => db.collection(collName);