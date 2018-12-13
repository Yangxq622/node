let getcoll = require("../db");
let async = require("async");
module.exports = {
    //查询菜品
    dishes(req, res) {
        let { page = 1, pageSize = 5, key } = req.query;
        page *= 1;
        pageSize *= 1;
        let dishes = getcoll("dishes");
        //查询所有数据
        async.parallel({
            list: function (callback) {//返回的是当前页面数据
                dishes.find({ $or: [{ name: { $regex: key } }, { type: { $regex: key } }] }).limit(pageSize).skip((page - 1) * pageSize).toArray((err, list) => {
                    callback(err, list);
                })
            },
            count: function (callback) {//返回的是共多少页
                dishes.find({ $or: [{ name: { $regex: key } }, { type: { $regex: key } }] }).count((err, count) => {
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
    //删除菜品
    delDish(req, res) {
        let { name } = req.query;
        let dishes = getcoll("dishes");
        dishes.remove({ name }, (err, info) => {  //find才有转换成数组的toArray方法  只要判断err有没有值即可 
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
    //添加菜品时查询所有菜系生成下拉框
    findType(req, res) {
        let cuisines = getcoll("cuisines");
        async.parallel({
            list: function (callback) {
                cuisines.find({}).toArray((err, list) => {
                    callback(err, list);
                })
            },
            count: function (callback) {
                cuisines.find({}).count((err, sum) => {
                    callback(err, sum);
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
    //添加菜品
    addDish(req, res) {
        let { body: data } = req;
        // 菜名原本不存在才能添加  串行有关联
        let dishes = getcoll("dishes");
        dishes.find({ name: data.name }).toArray((err, list) => {
            if (list.length == 0) {
                dishes.insert({ name: data.name, type: data.type, price: data.price, new_price: data.newPrice, intro: data.intro, imgSrc: data.imgSrc }, (err, info) => {
                    res.json({
                        code: !err ? 200 : 500,
                        msg: !err ? "新增菜品成功" : "新增菜品失败"
                    })
                })
            } else {
                res.json({
                    code: 400,
                    msg: "该菜品已存在"
                })
            }
        })
    },
    //查询唯一对应信息
    allDishes(req, res) {
        let { name } = req.query;
        let dishes = getcoll("dishes");
        dishes.find({ name }).toArray((err, info) => {
            //返回的info为object类型的伪数组
            res.json({
                code: !err ? 200 : 400,
                msg: !err ? info[0] : "查询失败"
            })
        })
    },
    //更新原有的信息
    updateDish(req, res) {
        let { body: data } = req;
        let{oldName,name,type,price,newPrice,intro,imgSrc} = data;
        let dishes = getcoll("dishes");
        dishes.update({name:oldName},{$set:{name,type,price,new_price:newPrice,intro,imgSrc}},(err,info) => {
            res.json({
                code:!err?200:400,
                msg:!err?"更新成功":"更新失败"
            })
        })
    }
}