var _ = require('underscore');
var StrHelper = require('./string');

var formHelper = {};

formHelper.getCheckboxValue = function(checkboxs){
  var _val = "";

  for(var i=0; i<checkboxs.length; i++){
    if(checkboxs[i].checked){
      _val = checkboxs[i].value;
      break;
    }
  }

  return _val;
};

formHelper.validFields = function(ctx, vlds, cb_fail, cb_success){
  var flag = true;

  vlds.forEach(function(vld){
    var _f = formHelper.validField(ctx, vld, cb_fail, cb_success);

    if(!_f){
      flag = false;
    }
  });

  return flag;
}

formHelper.validField = function(ctx, vld, cb_fail, cb_success){
  var flag = true;

  vld.name = vld.name || ("valid_" + vld.fieldName + "_" + vld.validType);

  var fld = React.findDOMNode(ctx.refs[vld.fieldName]);
  var val = fld.value;

  switch(vld.validType){
    case "required":
      if(!val || val.length === 0){
        flag = false;
      }
      break;
    case "maxLength":
    case "maxlength":
      if(val && StrHelper.getRealLength(val) > vld.maxlength){
        flag = false;
      }
      break;
    default:
      break;
  }

  if(!flag && cb_fail){
    cb_fail(vld, fld, val);
  } else if(flag && cb_success) {
    cb_success(vld, fld, val);
  }

  return flag;
}

formHelper.getSearchQueryString = function(frm){
  var _frm = frm;
  var _qryStr = $(_frm).serialize();

  return _qryStr;
}

formHelper.getFormData = function(frm, preData, ignoreEmpty){
  var _frm = frm;
  var _arrData = $(_frm).serializeArray();
  var _frmData = {};

  $(_arrData).each(function(){
    if(!ignoreEmpty || this.value){
      _frmData[this.name] = this.value;
    }
  });

  var _data = {};

  if(!preData){
    _data = _frmData;
  } else {
    _data = _.extendOwn(preData, _frmData);
  }

  return _data;
}

module.exports = formHelper;