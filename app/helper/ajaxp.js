var Promise = require('bluebird');
var superagent = Promise.promisifyAll(require('superagent'));
superagent.Request.prototype.cancellable = function () { 
    return this.endAsync().cancellable();
};
superagent.Request.prototype.then = function (done) { 
    return this.endAsync().then(done); 
};
//var superagent = require('superagent');
var isService = !process.browser;
var isCors,apiAddress,headers;
// var AuthStore = require('../stores/authstore')
//todo: auth header
var ajax = {};
ajax.init = function(config) {
  //example: api/ or http://**.**.**/api/
  if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }

  var config = config || {};
  if(config.url === undefined){
    config.url = '';
  }
  config.url.search('://') != -1 ? isCors = true : isCors = false;  
  apiAddress = config.url.endsWith('/')? config.url: config.url + '/';
  headers = config.header?config.header:{}

  // console.log(ajax);
  return this;
}.bind(ajax);
var requestTimeout = (process.env.NODE_ENV == 'development')? 10000: 10000;
ajax.api = {
  get: function(url){
    return superagent.get(apiAddress + url).timeout(requestTimeout).set(headers);
    // return this
  },
  post: function(url){
    if(isService || !isCors){
      if(!isService){
        headers['X-KJT-AUTH']=AuthStore.getAuth()
      }
      return superagent.post(apiAddress + url).set('Content-Type', 'application/json').timeout(requestTimeout).set(headers)
      // return this;
    }else{
      return superagent.post(apiAddress + url).set('Content-Type', 'application/json').timeout(requestTimeout).set(headers).withCredentials()
      // return this;
    }
    
  },
  del: function(url){
    return superagent.del(apiAddress + url).timeout(requestTimeout).set(headers);
    // return this
  },
  put: function(url){
    return superagent.put(apiAddress + url).timeout(requestTimeout).set(headers);
    // return this
  }

};

module.exports = ajax;