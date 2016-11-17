var fs = require('fs');
var EvoFlux = require('evoflux');
var superagent = require('superagent');
var ajax = require('../helper/ajax');
var util = require('util');

var Api = function(){ return ajax.init(global.ajaxConfigBack).api; }

module.exports = EvoFlux.createAction("uploadfile", {
  // 增加活动规则
  uploadfile: function(url, data, cb){
    var url = '/apiQS' + url;

    var request = superagent.post(url);

    for(var key in data){
      if(key === "qsFile"){
        if(data[key]){
          request = request.attach(key, data[key], data[key].name);
        }
      } else {
        request = request.field(key, data[key]);
      }
    }

    request.end(function(err, res){
      
      if(cb){
          cb(res.body);
      } else {
        if(res){
          this.dispatch({
            actionType: "uploadfile",
            data: res.body
          });
        }
      }
    }.bind(this));
  }
})