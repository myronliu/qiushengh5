import globleImport from '../helper/globalImport.js'
var express = require('express');
var router = express.Router();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var fs= require('fs')
var patha = require('path');
var WeiXinShare=require('../helper/weixinshare');

global.ajaxConfig = {url:"http://localhost:8080/api/app",header:{'Content-Type': 'application/json','X-KJT-Agent': 'h511111111111111111111111;h511111111111111111111111;h5;h5;;h5;h5;1.0.0;WIFI;h511111111111111111111111'}}
global.ajaxQiushengConfig = {url:"http://localhost:8080/api",header:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}

global.qsH5Config = {url:"http://60.205.145.105/api",header:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}

global.qsFCKConfig = {url:"http://b.fencaike.com/api",header:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}

// global.ajaxQiushengConfig = {url:"http://139.196.203.86:8080/api",header:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}

var DataInfoController = require('../controllers/datainfo');
var QsHomeController = require('../controllers/qshome');
var Exp =require('../helper/expose');

var ErrorView = React.createFactory(require('../pages/error'));
var Home = React.createFactory(require('../pages/home'));

var Specialist = React.createFactory(require('../pages/specialist'));
var Specialinfo = React.createFactory(require('../pages/specialinfo'));
var QiuSheng = React.createFactory(require('../pages/qiusheng'));
var Hotmatch = React.createFactory(require('../pages/hotmatch'));
var MyRecommendation = React.createFactory(require('../pages/myrecommendation'));
var SelectMatch = React.createFactory(require('../pages/selectmatch'));

var LiveScore = React.createFactory(require('../pages/livescore'));
var NewAddRecommendation = React.createFactory(require('../pages/newaddrecommendation'));
var RecommendationDetail = React.createFactory(require('../pages/recommendationdetail'));

var LanchRecommendation = React.createFactory(require('../pages/lanchrecommendation'));
var HotmatchDetail = React.createFactory(require('../pages/hotmatchdetail'));
var UserRank = React.createFactory(require('../pages/userrank'));
var RecoDetail = React.createFactory(require('../pages/recodetail'));
var Mine = React.createFactory(require('../pages/mine'));
var Focus = React.createFactory(require('../pages/focus'));
// var Vote = React.createFactory(require('../pages/vote'));
// var Result = React.createFactory(require('../pages/result'));
var ApplyExpert = React.createFactory(require('../pages/applyexpert'));
var WriteArticle = React.createFactory(require('../pages/writearticle'));
var TestUpload = React.createFactory(require('../pages/testupload'));
var Deposit = React.createFactory(require('../pages/deposit'));
var DepositRecord = React.createFactory(require('../pages/depositrecord'));
var Recommend = React.createFactory(require('../pages/recommend'));
var Contract = React.createFactory(require('../pages/contract'));
var Limits = React.createFactory(require('../pages/limits'));
var Article = React.createFactory(require('../pages/article'));
var Drawapply = React.createFactory(require('../pages/drawapply'));
var DrawRecord = React.createFactory(require('../pages/drawrecord'));

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
});

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
      };
      console.log("server router error: /");
      console.log(err);
      res.expose(Exp.dehydrate({data}));
      var reactHtml = ReactDOMServer.renderToString(Home({data: data}));
      res.render('home', {reactOutput: reactHtml,title:'首页'});
    })
});

router.get('/specialist',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Specialist());
  // res.render('home', {reactOutput: reactHtml,title:'专家列表'});
  renderByWX(req, res, reactHtml, '专家列表');
});

router.get('/specialinfo',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Specialinfo({id: req.query.id}));
  // res.render('home', {reactOutput: reactHtml,title:'专家详情'});
  renderByWX(req, res, reactHtml, '专家详情');
});

router.get('/qiusheng',function(req,res){
  QsHomeController.detail(req, res)
    .spread(function(banner,match,expert,recommend,hots){
    // .spread(function(banner){
      var data = {
        banner: banner,
        match: match,
        expert:expert,
        recommend:recommend,
        hots:hots
      };
      res.expose(Exp.dehydrate(data));
      var reactHtml = ReactDOMServer.renderToString(QiuSheng({data: data}));
      // res.render('home', {reactOutput: reactHtml,title:'球盛体育', stateData: res.locals.state});
      renderByWX(req, res, reactHtml, '球盛体育',res.locals.state)
    })
    .catch(function(err){
      var data={
        banner: {},
        match: {},
        expert:{},
        recommend:{},
        hots:{}
      };
      console.log("server router error: /");
      console.log(err);
      res.expose(Exp.dehydrate({data}));
      var reactHtml = ReactDOMServer.renderToString(QiuSheng({data: data}));
      res.render('home', {reactOutput: reactHtml,title:'首页'});
    })
});

router.get('/hotmatch',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Hotmatch());
  // res.render('home', {reactOutput: reactHtml,title:'热门赛事'});
  renderByWX(req, res, reactHtml, '热门赛事');
});

router.get('/hotmatchdetail',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(HotmatchDetail({id: req.query.id}));
  // res.render('home', {reactOutput: reactHtml,title:'赛事推荐列表'});
  renderByWX(req, res, reactHtml, '赛事推荐列表');
});

router.get('/recodetail',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(RecoDetail({id: req.query.id}));
  // res.render('home', {reactOutput: reactHtml,title:'推荐详情'});
  renderByWX(req, res, reactHtml, '推荐详情');
});

router.get('/userrank',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(UserRank());
  // res.render('home', {reactOutput: reactHtml,title:'红人榜'});
  renderByWX(req, res, reactHtml, '红人榜');
});

router.get('/mine',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Mine());
  // res.render('home', {reactOutput: reactHtml,title:'我的'});
  renderByWX(req, res, reactHtml, '我的');
});

router.get('/myrecommendation',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(MyRecommendation());
  // res.render('home', {reactOutput: reactHtml,title:'我的推荐'});
  renderByWX(req, res, reactHtml, '我的推荐');
});

router.get('/selectmatch',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(SelectMatch());
  // res.render('home', {reactOutput: reactHtml,title:'我的推荐'});
  renderByWX(req, res, reactHtml, '我的推荐');
});


router.get('/livescore',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(LiveScore());
  // res.render('home', {reactOutput: reactHtml,title:'比分直播'});
  renderByWX(req, res, reactHtml, '比分直播');
});

router.get('/newaddrecommendation',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(NewAddRecommendation());
  // res.render('home', {reactOutput: reactHtml,title:'新增推荐'});
  renderByWX(req, res, reactHtml, '新增推荐');
});
router.get('/lanchrecommendation',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(LanchRecommendation());
  // res.render('home', {reactOutput: reactHtml,title:'发起推荐'});
  renderByWX(req, res, reactHtml, '发起推荐');
});
router.get('/recommendationdetail',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(RecommendationDetail({id: req.query.id}));
  // res.render('home', {reactOutput: reactHtml,title:'推荐详情'});
  renderByWX(req, res, reactHtml, '推荐详情');
});

router.get('/focus',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Focus());
  // res.render('home', {reactOutput: reactHtml,title:'我的关注'});
  renderByWX(req, res, reactHtml, '我的关注');
});

router.get('/applyexpert',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(ApplyExpert());
  // res.render('home', {reactOutput: reactHtml,title:'申请站长'});
  renderByWX(req, res, reactHtml, '申请站长');
});

router.get('/writearticle',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(WriteArticle());
  // res.render('home', {reactOutput: reactHtml,title:'发表文章'});
  renderByWX(req, res, reactHtml, '发表文章');
});

router.get('/testupload',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(TestUpload());
  // res.render('home', {reactOutput: reactHtml,title:'testupload'});
  renderByWX(req, res, reactHtml, 'testupload');
});

router.get('/deposit',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Deposit());
  // res.render('home', {reactOutput: reactHtml,title:'充值'});
  renderByWX(req, res, reactHtml, '充值');
});

router.get('/contract',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Contract({type: req.query.type}));
  // res.render('home', {reactOutput: reactHtml,title:'协议'});
  renderByWX(req, res, reactHtml, '协议');
});

router.get('/limits',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Limits());
  // res.render('home', {reactOutput: reactHtml,title:'极限追盘'});
  renderByWX(req, res, reactHtml, '极限追盘');
});

router.get('/depositrecord',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(DepositRecord());
  // res.render('home', {reactOutput: reactHtml,title:'充值记录'});
  renderByWX(req, res, reactHtml, '充值记录');
});

router.get('/drawapply',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Drawapply());
  // res.render('home', {reactOutput: reactHtml,title:'申请提现'});
  renderByWX(req, res, reactHtml, '申请提现');
});

router.get('/drawrecords',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(DrawRecord());
  // res.render('wxshare', {reactOutput: reactHtml,title:'提现明细',sing:'ddd', shareTitle:'ddd'});
  // res.render('home', {reactOutput: reactHtml,title:'提现明细'});
  renderByWX(req, res, reactHtml, '提现明细');
});

router.get('/article', function(req,res){
  WeiXinShare(req,res,function(sign,appid,timestamp,noncestr,url,ticket){
    var reactHtml = ReactDOMServer.renderToString(Article({id: req.query.id}));
    res.render('wxshare',
        { reactOutput: reactHtml,
          title: '球盛体育--快来看专家们的精彩文章分享',
          shareTitle:'球盛体育--快来看专家们的精彩文章分享',
          shareDes:'业界大牛的良心分享，走过路过不要错过～',
          shareImage:'http://oh3pitlhq.bkt.clouddn.com/logo.png',
          sign:sign,
          appid:appid,
          timestamp:timestamp,
          noncestr:noncestr,
          url:url,
          ticket:ticket});
  });
})

router.get('/recommend',function(req,res){
  var reactHtml = ReactDOMServer.renderToString(Recommend({type: req.query.type}));
  // res.render('home', {reactOutput: reactHtml,title:'免费推荐'});
  renderByWX(req, res, reactHtml, '免费推荐');
});

function renderByWX(req, res, reactHtml, title, data){
  WeiXinShare(req,res,function(sign,appid,timestamp,noncestr,url,ticket){
    res.render('wxshare', {reactOutput: reactHtml, title: title, shareTitle: title, shareDes:'球盛体育--精彩分享，走过路过不要错过～', shareImage:'http://oh3pitlhq.bkt.clouddn.com/logo.png', sign:sign, appid:appid, timestamp:timestamp, noncestr:noncestr, url:url, ticket:ticket, stateData: data});
  });
}

function renderToPath(req,res,path){
  let filePath=patha.join(__dirname,'..','/pages'+path+'.js');
  console.log('page==='+filePath);
  var folder_exists = fs.existsSync(filePath);
  if(folder_exists){
    var pageClass = require('../pages'+path);
    pageClass.serverData(req,res);
  }else{
    console.log('404'+path);
    res.redirect('/error');
    // res.render('index', {reactOutput: '',title:'海融易'});
  }
}
module.exports = router;
