var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ajaxRouter = require("./routes/ajax");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret : "yang",//生成签名的字符串  自定义即可
  name : "yang" , //发送到客户端key的名字 也是自定义
  cookie : {
    maxAge : 600000 //毫秒为单位  设置session的有效时长
  },
  resave : false,
  saveUninitialized : true
}))
app.use(express.static(path.join(__dirname, 'public')));


// //清除
// app.get('/logout', function(req, res, next){
//   // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
//   // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
//   // 然后去查找对应的 session 文件，报错
//   // session-file-store 本身的bug  
 
//   req.session.destroy(function(err) {
//     if(err){
//       res.json({ret_code: 2, ret_msg: '退出登录失败'});
//       return;
//     }
     
//     // req.session.loginUser = null;
//     res.clearCookie(identityKey);
//     res.redirect('/');
//   });
// });



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ajax',ajaxRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
