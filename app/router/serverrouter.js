import globleImport from '../helper/globalImport.js'
var express = require('express');
var router = express.Router();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var fs= require('fs')
var patha = require('path');

global.ajaxConfig = {url:"http://localhost:8080/api/app",header:{'Content-Type': 'application/json','X-KJT-Agent': 'h511111111111111111111111;h511111111111111111111111;h5;h5;;h5;h5;1.0.0;WIFI;h511111111111111111111111'}}
global.ajaxQiushengConfig = {url:"http://139.196.203.86:8080/api",header:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}

var DataInfoController = require('../controllers/datainfo');
var Exp =require('../helper/expose');

var ErrorView = React.createFactory(require('../pages/error'));
var Home = React.createFactory(require('../pages/home'));

// var List = React.createFactory(require('../pages/list'));
// var Vote = React.createFactory(require('../pages/vote'));
// var Result = React.createFactory(require('../pages/result'));






// 加入定时计划
var later = require('later');
/*var a = new Date();
a.setSeconds(a.getSeconds() + 20);
var basic = {h:[a.getHours()], m:[a.getMinutes()], s:[a.getSeconds()]};*/
/*var basic = {h:[1],m:[15],s:[0]};  //设置每天凌晨执行
var composite=[
    basic
];
var sched={
    schedules:composite
};*/
// var textSched = later.parse.text('at 03:00am every weekday');
// var textSched = later.parse.text('at 06:19pm every weekday');
var sched = later.parse.text('every 5 sec');
later.date.localTime();  //设置本地时区
var t=later.setInterval(sendMessage,sched);

function sendMessage(){
  DataInfoController.detail()
    .spread(function(content,recommendation,competition){
    // .spread(function(content){
      var data = {
        time: new Date().toLocaleString(),
        content:content,
        recommendation:recommendation,
        competition:competition
      };
      global.socket.emit('message', JSON.stringify(data));
    })
    .catch(function(err){
      
    })
}

router.get('/error',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(ErrorView({message:"出错啦！"}));
  res.render('index', {reactOutput: reactHtml,title:'出错啦'});
})

router.get('/',function(req,res){

  DataInfoController.detail(req, res)
    .spread(function(content,recommendation,competition){
    // .spread(function(content){
      // console.log(recommendation)
      var data = {
        time: new Date().toLocaleString(),
        content:content,
        recommendation:recommendation,
        competition:competition
      };
      res.expose(Exp.dehydrate(data));
      
      var reactHtml = ReactDOMServer.renderToString(Home({data: data}));
      res.render('guanka', {reactOutput: reactHtml,title:'首页', stateData: res.locals.state});
    })
    .catch(function(err){
      var data={
        content: {},
        recommendation:{},
        competition:{}
      }
      console.log("server router error: /");
      console.log(err);
      res.expose(Exp.dehydrate({data}));
      var reactHtml = ReactDOMServer.renderToString(Home());
      res.render('guanka', {reactOutput: reactHtml,title:'首页'});
    })
})

// router.get('/guanka',function(req,res){
//   var reactHtml = ReactDOMServer.renderToString(GuanKa());
//   res.render('guanka', {reactOutput: reactHtml,title:'关卡'});
// })

function renderToPath(req,res,path){
  let filePath=patha.join(__dirname,'..','/pages'+path+'.js');
  console.log('page==='+filePath);
  var folder_exists = fs.existsSync(filePath);
  if(folder_exists){
    var pageClass = require('../pages'+path);
    pageClass.serverData(req,res);
  }else{
    console.log('404'+path);
    res.redirect('/error')
    // res.render('index', {reactOutput: '',title:'海融易'});
  }
}
module.exports = router;