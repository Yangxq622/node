var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/login")
});
//注册页面
router.get("/register",function(req,res){
  res.render("register")
})
//登录界面
router.get("/login",(req,res) => {
  res.render("login");
})
//后台管理首页
router.get("/admin",(req,res) => {
  let {userObj} = req.session;
  res.render("admin",{userObj});
})
//餐桌管理
router.get("/tables",(req,res) => {
  let {userObj} = req.session;
  res.render("tables",{userObj});
})
//菜系管理
router.get("/cuisine",(req,res) => {
  let {userObj} = req.session;
  res.render("cuisine",{userObj});
})
//菜品管理
router.get("/dish",(req,res) => {
  let {userObj} = req.session;
  res.render("dish",{userObj});
})
//添加新菜品
router.get("/set",(req,res) => {
  let {userObj} = req.session;
  res.render("set",{userObj});
})
//编辑菜品信息
router.get("/edit",(req,res) => {
  let {userObj} = req.session;
  res.render("edit",{userObj});
})
//管理员聊天室
router.get("/chat",(req,res) => {
  res.render("chat");
})
module.exports = router;
