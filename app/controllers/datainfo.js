var Promise  = require('bluebird');
var React    = require('react');
var DataInfo = require('../models/datainfo');
var exp      = require('../helper/expose');

module.exports ={
  detail : function(req,res,next){
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
            // console.log(result)
          if(result && result.body){
            result = JSON.parse(result.body);  
            return result; 
          }else{
            return {}
          }
        }
      )

      var competition = DataInfo.competition()
        .then(function(result){
            // console.log(JSON.parse(result.body))
          if(result && result.body){
            result = JSON.parse(result.body);  
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



