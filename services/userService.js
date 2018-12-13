let jm = require("../tools/jm");
let getcoll = require("../db");

module.exports = {
    //注册
    register:function(req,res){
        let {body:data} = req;
        data.password = jm(data.password);
        let {username,password} = data;
        console.log(data);
        let admin = getcoll("admin");
        //用户名不存在  即可注册
        let obj = {};
        admin.find({username}).toArray((error,result) => {
            if(result.length == 0){
                //用户名不存在 可以注册
                admin.insert(data,(err,info) => {
                    obj.code = !err ? 200 : 500;
                    obj.msg = !err ? "注册成功" : "注册失败";
                    res.json(obj);
                })
            }else{
                obj.code = 0;
                obj.msg = "用户名已存在，请重新注册";
                res.json(obj);
            }
        })
    },
    //登录
    login(req,res){
        let {username,password} = req.body;
        password = jm(password);
        let admin = getcoll("admin");

        admin.find({username}).toArray((err,result) => {
            if(!err){
                let obj = {};
                if(result.length == 0 || result[0].password != password){
                    obj.code = 400;
                    obj.msg = "用户名与密码不匹配";
                }else{
                    obj.code = 200;
                    obj.msg = "登录成功";
                    req.session.userObj = result[0];
                    
                }
                res.json(obj);
            }else{
                res.json({
                    code:500,
                    msg:"服务器错误，请联系管理员"
                })
            }
        })
    },
    //退出登录
    logOut(req,res){
     delete req.session.userObj;
     if(req.session.userObj){
         res.json({
             code:400,
             msg:"退出失败"
         })
     }else{
         res.json({
             code:200,
             msg:"退出成功"
         })
     }
    }
}