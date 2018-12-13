let getcoll = require("../db");
let async = require("async");
// let qs = require("querystring");

module.exports = {
    //餐桌查询
    tables(req, res) {
        let { page = 1, pageSize = 5, key } = req.query;
        // key = qs.stringify(key);
        page *= 1;
        pageSize *= 1;
        let tables = getcoll("tables");
        //查询所有数据  分页需求  搜索 
        async.parallel({
            list: function (callback) {//返回的是当前页面数据 
                tables.find({ $or: [ { state: { $regex: key } },{ name: { $regex: key }}] }).skip((page - 1) * pageSize).limit(pageSize).toArray((err, list) => {
                    callback(err, list);
                })
            },
            count: function (callback) {//返回的是共多少页
                tables.find({ $or: [{ name: { '$regex': key } }, { state: { '$regex': key } }] }).count((err, count) => {
                    count = Math.ceil(count / pageSize);
                    callback(err, count);//页数正常
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
    //添加
    addTables(req, res) {
        let name = req.query.name;
        let tables = getcoll("tables");
        //首先查询 确保数据库中的餐桌名不重复 查询完再执行操作  空数据不能插入
        tables.find({ name }).toArray((err, info) => {
            let obj = {};
            if (info.length == 0) {
                tables.insert({ name: name, state: "空闲", active: "预定" }, (err, info) => {
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
    //删除
    deleteTable(req, res) {
        let name = req.query.name;
        let tables = getcoll("tables");
        tables.remove({ name }, (err, info) => {  //find才有转换成数组的toArray方法  只要判断err有没有值即可 
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
    //更新状态  预定
    updateActive(req, res) {
        let { str, name } = req.query;
        let tables = getcoll("tables");
        tables.update({ name }, { $set: { state: "预定", time: str, active: "退桌" } }, (err, info) => {
            if (!err) {
                res.json({
                    code: 200,
                    msg: "预定成功"
                })
            } else {
                res.json({
                    code: 400,
                    msg: "预定失败"
                })
            }
        })
    },
    //更新状态 退桌
    updateActive1(req, res) {
        let { name } = req.query;
        let tables = getcoll("tables");
        tables.update({ name }, { $set: { state: "空闲", active: "预定" }, $unset: { time: 1 } }, (err, info) => {
            if (!err) {
                res.json({
                    code: 200,
                    msg: "退桌成功"
                })
            } else {
                res.json({
                    code: 400,
                    msg: "退桌失败"
                })
            }
        })
    }
}