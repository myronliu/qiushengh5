var express = require('express');
var router = express.Router();
var ApiAction = require('../actions/apiaction');
var DataInfoController = require('../controllers/datainfo');

router.post('/getUserRec',function(req,res){
    // console.log(global.ajaxQiushengConfig)
    // var date = new Date();
    // console.log(date)
    // // date = date.getFullYear() + (date.getMonth() + 1) + date.getDate();
    // date = "20160922"
    // console.log(req.body)
    // ApiAction.get('lottery/dailyRecommend?username=' + req.body.username + '&day=' + date, {},function(data){
    //     res.json(data);
    // },global.ajaxQiushengConfig)
    req.query.username = req.body.username;
    DataInfoController.detail(req, res)
    .spread(function(content,recommendation,competition, recommendationToday){
      var data = {
        time: new Date().toLocaleString(),
        recommendationToday: recommendationToday,
        content:content,
        recommendation:recommendation,
        competition:competition
      };
      res.json(data);
    })
    .catch(function(err){
      var data={
        time: new Date().toLocaleString(),
        content: {},
        recommendation:{},
        competition:{},
        recommendationToday:{}
      }
      res.json(data);
    })
})

router.post('/lottery/expert/list',function(req,res){
    ApiAction.post(req.url,req.body,function(data){
        res.json(data);
    }, global.qsH5Config)
})

router.post('/lottery/expert/detail',function(req,res){
    ApiAction.post(req.url,req.body,function(data){
        res.json(data);
    }, global.qsH5Config)
})

router.post('/lottery/expert/recommend',function(req,res){
    ApiAction.post(req.url,req.body,function(data){
        res.json(data);
    }, global.qsH5Config)
})

router.post('/lottery/recommend/buy',function(req,res){
    ApiAction.post(req.url,req.body,function(data){
        res.json(data);
    }, global.qsH5Config)
})

router.post('/lottery/recommend/detail', function(req,res){
    ApiAction.post(req.url,req.body,function(data){
        res.json(data);
    }, global.qsH5Config)
})

router.post('*',function(req,res){
    let auth=req.cookies.auth
    let ssoToken=req.cookies.ssoToken
    ApiAction.post(req.url,req.body,function(data){
        res.json(data);
    })
})

router.get('*',function(req,res){
    ApiAction.get(req.url,function(data){
        res.json(data);
    })
})
module.exports = router;