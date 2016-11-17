var _ = require('underscore');
var strHelper = {};

strHelper.getRealLength = function(str){
  ///<summary>获得字符串实际长度，中文2，英文1</summary>
  ///<param name="str">要获得长度的字符串</param>
  var realLength = 0, len = str.length, charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) realLength += 1;
    else realLength += 2;
  }
  return realLength;
};


strHelper.containsArrayStr = function(arrStr, itemStr, seperator){
  if(!arrStr || !itemStr){
    return false;
  }

  var seperator = seperator || ",";

  var strArr = arrStr.split(seperator);

  return _.contains(strArr, itemStr);
}

strHelper.getArrayString = function(objArr, fldName){
  var fldArr = [];
  objArr.forEach(function(v, i, a){
    if(v[fldName]){
      fldArr.push(v[fldName]);
    }
  });

  var fldArrStr = fldArr.join();

  return fldArrStr;
}

module.exports = strHelper;