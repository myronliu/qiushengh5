var Promise  = require('bluebird');
var React    = require('react');
var QSInfo = require('../models/qsinfo');
var exp      = require('../helper/expose');

module.exports ={
  detail : function(req,res,next){
    return Promise.resolve().then(function(){
      
      var banner = QSInfo.banner(req.query.token || req.cookies.token)
        .then(function(result){
          if(result && result.body){
            result = typeof result.body == 'string' ? JSON.parse(result.body) : result.body;  
            return result; 
          }else{
            return {}
          }
        }
      )
      var match = QSInfo.match(req.query.token || req.cookies.token)
        .then(function(result){
          console.log("----->match")
          if(result && result.body){
            result = typeof result.body == 'string' ? JSON.parse(result.body) : result.body;  
            return result; 
          }else{
            return {}
          }
        }
      )
      var expert = QSInfo.expert(req.query.token || req.cookies.token)
        .then(function(result){
          console.log("----->expert")
          if(result && result.body){  
            result = typeof result.body == 'string' ? JSON.parse(result.body) : result.body;  
            return result; 
          }else{
            return {}
          }
        }
      )
      var recommend = QSInfo.recommend(req.query.token || req.cookies.token)
        .then(function(result){
          console.log("----->recommend")
          if(result && result.body){
            result = typeof result.body == 'string' ? JSON.parse(result.body) : result.body;  
            return result; 
          }else{
            return {}
          }
        }
      )
      var hots = QSInfo.hots(req.query.token || req.cookies.token)
        .then(function(result){
          console.log("----->hots")
          if(result && result.body){ 
            result = typeof result.body == 'string' ? JSON.parse(result.body) : result.body;  
            return result; 
          }else{
            return {}
          }
        }
      )

      return [banner,match,expert,recommend,hots];
    })
  }
}



