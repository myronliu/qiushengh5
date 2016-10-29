var ajax = require('../helper/ajaxp');
var UrlConfig = require('../config/urlconfig');
var Api = function(){ return ajax.init(global.qsH5Config).api; };
var QSInfo = {}
QSInfo.banner = function (token) {
  return Api().post(UrlConfig.banner)
    .send({
      token: token
    });
}
QSInfo.match = function (token) {
  return Api().post(UrlConfig.match)
    .send({
      token: token
    });
}
QSInfo.expert = function (token) {
  return Api().post(UrlConfig.expert)
    .send({
      token: token
    });
}
QSInfo.recommend = function (token) {
  return Api().post(UrlConfig.recommend)
    .send({
      token: token
    });
}
QSInfo.hots = function (token) {
  return Api().post(UrlConfig.hots)
    .send({
      token: token
    });
}

module.exports = QSInfo;