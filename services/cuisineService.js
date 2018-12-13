let getcoll = require("../db");
let async = require("async");

module.exports = {
    //菜系查询
    cuisines(req, res) {
        let { page = 1, pageSize = 5, key } = req.query;
        page *= 1;
        pageSize *= 1;
        let cuisines = getcoll("cuisines");
        //查询所有数据  分页需求  搜索 
        async.parallel({
            list: function (callback) {//返回的是当前页面数据
                cuisines.find({ name: { $regex: key } }).limit(pageSize).skip((page - 1) * pageSize).toArray((err, list) => {
                    callback(err, list);//list正常
                })
            },
            count: function (callback) {//返回的是共多少页
                cuisines.find({ name: { $regex: key } }).count((err, count) => {
                    count = Math.ceil(count / pageSize);
                    callback(err, count);
                })
            }
        }, (err, data) => {
            if (!err) {
                res.json(data);
            } else {
                res.json(err);
            }
        })
    },
    //新增菜系
    addCuisine(req, res) {
        let name = req.query.name;
        console.log(name);
        let cuisines = getcoll("cuisines");
        //首先查询 确保数据库中的餐桌名不重复 查询完再执行操作  空数据不能插入
        cuisines.find({ name }).toArray((err, info) => {
            let obj = {};
            if (info.length == 0) {
                cuisines.insert({ name }, (err, info) => {
                    obj = {
                        code: !err ? 200 : 500,
                        msg: !err ? "录入成功" : "录入失败"
                    }
                    res.json(obj);
                })
            } else {
                obj.code = 400;
                obj.msg = "该名字已经存在";
                res.json(obj);
            }
        })
    },
    //删除菜系
    delCuisine(req, res) {
        let name = req.query.name;
        let cuisines = getcoll("cuisines");
        cuisines.remove({ name }, (err, info) => {  //find才有转换成数组的toArray方法  只要判断err有没有值即可 
            if (!err) {
                res.json({
                    code: 200,
                    msg: "删除成功"
                })
            } else {
                res.json({
                    code: 400,
                    msg: "删除失败"
                })
            }
        })
    },
    //更新菜系
    updateCuisine(req, res) {
        let { oldName, newName } = req.query;
        console.log(req.query);
        let cuisines = getcoll("cuisines");
        cuisines.update({ name: oldName }, { $set: { name: newName } }, (err, info) => {
            res.json({
                code: !err ? 200 : 500,
                msg: !err ? "更新成功" : "更新失败"
            })
        })
    }
}