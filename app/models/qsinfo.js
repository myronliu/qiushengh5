var ajax = require('../helper/ajaxp');
var UrlConfig = require('../config/urlconfig');
var Api = function(){ return ajax.init(global.qsH5Config).api; };
var QSInfo = {}
QSInfo.banner = function () {
  return Api().post(UrlConfig.banner)
    .send({
      // url: UrlConfig.contentFootball
    });
}
QSInfo.match = function () {
  return Api().post(UrlConfig.match)
    .send({
      // url: UrlConfig.contentFootball
    });
}
QSInfo.expert = function () {
  return Api().post(UrlConfig.expert)
    .send({
      // url: UrlConfig.contentFootball
    });
}
QSInfo.recommend = function () {
  return Api().post(UrlConfig.recommend)
    .send({
      // url: UrlConfig.contentFootball
    });
}
QSInfo.hots = function () {
  return Api().post(UrlConfig.hots)
    .send({
      // url: UrlConfig.contentFootball
    });
}

module.exports = QSInfo;