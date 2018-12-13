let multer = require("multer");
 var storage = multer.diskStorage({
     destination:function(req,file,callback){
         //设置文件路径
         callback(null,'./public/images');
     },
     filename:function(req,file,callback){
         //获取文件的原后缀名
         let fileList = file.originalname.split(".");
         let ext = fileList[fileList.length - 1];
         //用时间戳命名  保证文静名称的唯一性
         let times = new Date();
         times = times.getTime();
         //通过时间戳和原文件的后缀名生成新的文件名
         let newName = `${times}.${ext}`;
         callback(null,newName);
     }
 })
 module.exports = multer({storage});