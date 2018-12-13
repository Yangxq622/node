let express = require("express");
let router = express.Router();
let {register,login,logOut} = require("../services/userService");
let {tables,addTables,deleteTable,updateActive,updateActive1} = require("../services/goodsService");
let {cuisines,addCuisine,delCuisine,updateCuisine} = require("../services/cuisineService");
let {dishes,delDish,findType,addDish,allDishes,updateDish} = require("../services/dishService");
let multer = require("../tools/updateFile");

//注册
router.post("/register",(req,res) => {
    register(req,res);
})
//登录
router.post("/login",(req,res) => {
    login(req,res);
})
//退出登录
router.post("/logOut",(req,res) => {
   logOut(req,res);
})
//餐桌管理
router.get("/tables",(req,res) => {
    tables(req,res);
})
//新增餐桌
router.get("/addTables",(req,res) => {
    addTables(req,res);
})
//删除餐桌
router.get("/deleteTable",(req,res) => {
    deleteTable(req,res);
})
//更新餐桌当前的状态  预定
router.get("/updateActive",(req,res) => {
    updateActive(req,res);
})
//更新餐桌状态 退桌
router.get("/updateActive1",(req,res) => {
    updateActive1(req,res);
})
//菜系管理
router.get("/cuisines",(req,res) => {
    cuisines(req,res);
})
//新增菜系
router.get("/addCuisine",(req,res) => {
    addCuisine(req,res);
})
//删除菜系
router.get("/delCuisine",(req,res) => {
    delCuisine(req,res);
}),
//更新菜系信息
router.get("/updateCuisine",(req,res) => {
    updateCuisine(req,res);
})
//菜品信息
router.get("/dishes",(req,res) => {
    dishes(req,res);
})
//删除菜品信息
router.get("/delDish",(req,res) => {
    delDish(req,res);
})
//查询所有菜系
router.get("/findType",(req,res) => {
    findType(req,res);
})
//file的名字为ejs页面注入的名字
router.post("/updateFile",multer.single("file"),(req,res) => {
    res.json({
        url:`images/${req.file.filename}`
    })
})
//添加菜品
router.post("/addDish",(req,res) => {
    addDish(req,res);
})
//编辑前根据菜品名查询对应信息
router.get("/allDishes",(req,res) => {
    allDishes(req,res);
})
//修改原有的菜品信息
router.post("/updateDish",(req,res) => {
    updateDish(req,res);
})
module.exports = router;