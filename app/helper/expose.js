module.exports = {

  name: 'QiuSheng',

  setItems: function(items){
    this.items = items;
  },

  getItems: function(){
    return this.items;
  },

  rehydrate: function(){

    this.items = global[this.name].items;
  },

  dehydrate: function(items, schema){
    if(items && schema){
      var fSchema = formatSchema(schema);

      items = dataFilter(items, fSchema);
    }

    return { items: items }
  },

  // 对指定的数据按照schema进行过滤(schema为白名单，不在schema中的数据会被隐藏)
  filterData: function(data, schema){
    var fSchema = formatSchema(schema);

    var _data = dataFilter(data, fSchema);

    return _data;
  }
};

// 对schema进行标准化, schema是一个数组，包含data中的字段，及字段的处理方式
// 如果没有找到对应的处理方式，默认删除相关字段
// 转化模式:
// eg. ["a", "b", { "c": ["d", "e"], "f": [{ "g": ["h", "i"] }] }, "j"] => 
// [
//   {name: "a", proc: "keep"}, 
//   {name: "b", proc: "keep"}, 
//   { name: "c", schema: [
//       {name: "d": proc: "keep"}, 
//       {name: "e": proc: "keep"} 
//     ]
//   }, 
//   { name: "f", schema: [
//       {name: "g", schema: [{
//         {name: "h": proc: "keep"}, 
//         {name: "i": proc: "keep"}
//       }]}
//   ]}
//   {name: "h", proc: "keep"}
// ]
function formatSchema(schema){
  if(!schema || !Array.isArray(schema)){
    return null;
  }

  var _fSchema = [];

  schema.forEach(function(s){
    if(typeof s === "string"){
      _fSchema.push({ name: s, proc: "keep" });
    } else if(typeof s === "object"){
      Object.keys(s).forEach(function(sk){
        var sv = s[sk];
        
        if(Array.isArray(sv)){
          var _sfSchema = formatSchema(sv);
          _fSchema.push({name: sk, schema: _sfSchema});
        } else if(typeof sv === "function" || typeof sv === "string"){
          _fSchema.push({name: sk, proc: sv});
        } else if(typeof sv === "object") {
          throw "嵌套schema '" + sk + "'必须为数组，此处为对象，请调整"
        }
      });
    }
  });

  return _fSchema;
}

// 对指定的数据按照schema进行过滤(schema为白名单，不在schema中的数据会被隐藏)
// flag为true则，当处理对象对数组时，向下传递处理方法，默认只传递一级(默认为true, 不支持二维数组)
function dataFilter(data, schema, flag){
  if(!data 
    || typeof data !== "object"
    || !Array.isArray(schema)
  ){
    return data;
  }

  // 向下传递处理方式
  if(Array.isArray(data)){
    if(flag === false){
      return data;  // 不对当前方法进行处理
    } else {
      var newArrData = [];
      data.forEach(function(d, i){
        newArrData[i] = dataFilter(d, schema, false);
      });

      return newArrData;
    }
  }

  var newData = {};

  Object.keys(data).forEach(function(k){
    var _proc = null;
    var _schema = null;

    schema.forEach(function(s){
      if(k === s.name){
        _proc = s.proc || null;
        _schema = s.schema || null;
      }
    });

    // 如果没有proc或schema则丢弃处理
    if(!_proc && !_schema){
      return;
    }

    var _data = data[k];

    if(_proc || _schema){
      _data = processFilterData(_data, _proc);
    }

    if(_data && _schema){
      _data = dataFilter(_data, _schema);
    }

    newData[k] = _data;
  });

  return newData;
}

// 处理过滤数据
function processFilterData(data, proc){
  if(!data){
    return data;
  }

  if(!proc){
    return data;
  }

  if(proc === "keep"){
    return data;
  }

  if(typeof proc === "function"){
    return proc(data);
  }

  return data;
}


