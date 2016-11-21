var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

/**
* @synopsis 签名算法 
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须与调用 JSAPI 时的页面 URL 完全一致
*
* @returns
*/
var crypto = require('crypto');
//sha1
function sha1(str) {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}
var sign = function (jsapi_ticket, url) {

  // var ret = {
  //   jsapi_ticket: jsapi_ticket,
  //   nonceStr: createNonceStr(),
  //   timestamp: createTimestamp(),
  //   url: url
  // };
  //var string = raw(ret);
  var  _noncestr=createNonceStr();
  var  _createTimestamp=createTimestamp();
 var string1="jsapi_ticket="+jsapi_ticket+"&noncestr="+_noncestr+"&timestamp="+_createTimestamp+"&url="+url+"";
 var signature=sha1(string1);
 // console.log("aaaa:"+signature+"&&"+_noncestr+"&&"+_createTimestamp);
 return signature+","+_noncestr+","+_createTimestamp;
};

module.exports = sign;