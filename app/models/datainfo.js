var ajax = require('../helper/ajaxp');
var UrlConfig = require('../config/urlconfig');
var Api = function(){ return ajax.init(global.ajaxQiushengConfig).api; };
var DataInfo = {}
DataInfo.content = function (fundCode) {
  return Api().post(UrlConfig.url+"?url=http://www.fencaike.com/"+UrlConfig.contentFootball)
    .send({
      // url: UrlConfig.contentFootball
    });
}
DataInfo.recommendation = function(fundCode){
  return Api().post(UrlConfig.url+"?url=http://b.fencaike.com/api/"+UrlConfig.recommendationFootball)
    .send({
      // url: UrlConfig.recommendationFootball
    });
}
DataInfo.competition = function(fundCode){
  return Api().post(UrlConfig.url+"?url=http://b.fencaike.com/api/"+UrlConfig.competition)
    .send({
      // url: UrlConfig.competition
    });
}
DataInfo.recommendationToday = function(username,day){
  return Api().post(UrlConfig.urlToday+"?day="+day+"&username=" + username)
    .send({});
}

module.exports = DataInfo;