import globleImport from '../helper/globalImport.js'
var express = require('express');
var router = express.Router();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var fs= require('fs')
var patha = require('path');

global.ajaxConfig = {url:"http://localhost:8080/api/app",header:{'Content-Type': 'application/json','X-KJT-Agent': 'h511111111111111111111111;h511111111111111111111111;h5;h5;;h5;h5;1.0.0;WIFI;h511111111111111111111111'}}
global.ajaxQiushengConfig = {url:"http://localhost:8080/api",header:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}
// global.ajaxQiushengConfig = {url:"http://139.196.203.86:8080/api",header:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}

var DataInfoController = require('../controllers/datainfo');
var Exp =require('../helper/expose');

var ErrorView = React.createFactory(require('../pages/error'));
var Home = React.createFactory(require('../pages/home'));

var Specialist = React.createFactory(require('../pages/specialist'));
var Specialinfo = React.createFactory(require('../pages/specialinfo'));
var QiuSheng = React.createFactory(require('../pages/qiusheng'));
var Hotmatch = React.createFactory(require('../pages/hotmatch'));
var HotmatchDetail = React.createFactory(require('../pages/hotmatchdetail'));
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
// var t=later.setInterval(sendMessage,sched);

function sendMessage(){
  DataInfoController.detailA()
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

// global.socket.on('message',function(event){ 
//   console.log('Received message from client!',event); 
// }); 

router.get('/error',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(ErrorView({message:"出错啦！"}));
  res.render('index', {reactOutput: reactHtml,title:'出错啦'});
})

router.get('/',function(req,res){

  DataInfoController.detail(req, res)
    .spread(function(content,recommendation,competition, recommendationToday){
      // .spread(function(content){
      var data = {
        time: new Date().toLocaleString(),
        recommendationToday: recommendationToday,
        content:content,
        recommendation:recommendation,
        competition:competition
      };
      res.expose(Exp.dehydrate(data));
      
      var reactHtml = ReactDOMServer.renderToString(Home({data: data}));
      res.render('home', {reactOutput: reactHtml,title:'首页', stateData: res.locals.state});
    })
    .catch(function(err){
      var data={
        time: new Date().toLocaleString(),
        content: {},
        recommendation:{},
        competition:{},
        recommendationToday:{}
      }
      console.log("server router error: /");
      console.log(err);
      res.expose(Exp.dehydrate({data}));
      var reactHtml = ReactDOMServer.renderToString(Home({data: data}));
      res.render('home', {reactOutput: reactHtml,title:'首页'});
    })
})

router.get('/specialist',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Specialist());
  res.render('home', {reactOutput: reactHtml,title:'专家列表'});
})

router.get('/specialifo',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Specialinfo());
  res.render('home', {reactOutput: reactHtml,title:'专家详情'});
})

router.get('/qiusheng',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(QiuSheng());
  res.render('home', {reactOutput: reactHtml,title:'首页'});
})

router.get('/hotmatch',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Hotmatch());
  res.render('home', {reactOutput: reactHtml,title:'热门赛事'});
})

router.get('/hotmatchdetail',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(HotmatchDetail());
  res.render('home', {reactOutput: reactHtml,title:'赛事推荐列表'});
})

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