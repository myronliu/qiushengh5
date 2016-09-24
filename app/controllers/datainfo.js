var Promise  = require('bluebird');
var React    = require('react');
var DataInfo = require('../models/datainfo');
var exp      = require('../helper/expose');

module.exports ={
  detail : function(req,res,next){
    return Promise.resolve().then(function(){
      var date = new Date();
      console.log(date)
      date = "" + date.getFullYear() + (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() +1) ) + date.getDate();
      console.log(date)
      // date = "20160922"
      var content = DataInfo.content()
        .then(function(result){
          if(result && result.body){
            result = JSON.parse(result.body);  
            // console.log(result)
            return result; 
          }else{
            return {}
          }
        }
      )

      var recommendation = DataInfo.recommendation()
        .then(function(result){
          if(result && result.body){
            result = JSON.parse(result.body);  
            // console.log(result)
            return result; 
          }else{
            return {}
          }
        }
      )

      var competition = DataInfo.competition()
        .then(function(result){
          if(result && result.body){
            result = JSON.parse(result.body);  
            // console.log(result)
            return result; 
          }else{
            return {}
          }
        }
      )

      var recommendationToday = DataInfo.recommendationToday(req.query.username, date)
        .then(function(result){
          if(result && result.body){
            console.log(result.body)
            // result = JSON.parse(result.body);
            return result.body || {};
          }else{
            return {}
          }
        })

      return [content,recommendation,competition,recommendationToday];
      // return [content];
    })
  },
  detailA : function(req,res,next){
    return Promise.resolve().then(function(){
      var content = DataInfo.content()
        .then(function(result){
          if(result && result.body){
            result = JSON.parse(result.body);  
            // console.log(result)
            return result; 
          }else{
            return {}
          }
        }
      )

      var recommendation = DataInfo.recommendation()
        .then(function(result){
          if(result && result.body){
            result = JSON.parse(result.body);  
            // console.log(result)
            return result; 
          }else{
            return {}
          }
        }
      )

      var competition = DataInfo.competition()
        .then(function(result){
          if(result && result.body){
            result = JSON.parse(result.body);  
            // console.log(result)
            return result; 
          }else{
            return {}
          }
        }
      )

      return [content,recommendation,competition];
      // return [content];
    })
  }
}



