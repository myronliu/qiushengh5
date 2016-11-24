var gulp = require('gulp');
var express = require('express');
var router = express.Router();
var ApiAction = require('../actions/apiaction')
var DataInfoController = require('../controllers/datainfo');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var util = require('util');

var qiniu = require("qiniu");

// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = '1GTAXy6r37inDiXU6qzCJRuJtGvY4JAQ1ldV4aJp';
qiniu.conf.SECRET_KEY = 'vNLIlAwARLTzzp9iBe80q67M6xKuDts4sZXI99mH';

//要上传的空间
var bucket = 'qiusheng';

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        fs.unlink(localFile);
        
        console.log(ret.hash, ret.key, ret.persistentId);
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
}

function handleApiWithFile(req, res, config){
  // var reqq = multipart(req);
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, 'tmp');   //文件保存的临时目录为当前项目下的tmp文件夹
  form.maxFieldsSize = 10 * 1024 * 1024;  //用户头像大小限制为最大10M
  form.keepExtensions = true;        //使用文件的原扩展名
  form.parse(req, function (err, fields, file) {
      var filePath = '';
      var filesPath = [];
      //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
      if(file.tmpFile){
          filePath = file.tmpFile.path;
      } else {
          for(var key in file){
              if( file[key].path && filePath==='' ){
                  console.log(key)
                  console.log(file[key].path)
                  filesPath.push(file[key].path);
              }
          }
      }
      if(filePath){
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        //判断文件类型是否允许上传
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
            var err = new Error('此文件类型不允许上传');
            res.json({code:-1, message:'此文件类型不允许上传'});
        } else {
            //以当前时间戳对上传文件进行重命名
            var fileName = new Date().getTime()+ '/'  + fields.username + fileExt;

            //生成上传 Token
            var token = uptoken(bucket, fileName);

            //调用uploadFile上传
            uploadFile(token, fileName, filePath);
            fields[fields.paramUrl] = 'http://ogk4g82l7.bkt.clouddn.com/' + fileName;
            fs.unlink(filePath);
            ApiAction.post(req.url,fields,function(data){
              res.json(data);
              // res.json({status: 0, body:{success: true, msg:''}})
            }, config)
        }
      }else{
        for(var key in file){
          var filePath = file[key].path;
          var fileExt = filePath.substring(filePath.lastIndexOf('.'));
          //判断文件类型是否允许上传
          if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
              var err = new Error('此文件类型不允许上传');
              res.json({code:-1, message:'此文件类型不允许上传'});
          } else {
              //以当前时间戳对上传文件进行重命名
              var fileName = new Date().getTime()+ '/'  + fields.username + '/' + key + fileExt;

              //生成上传 Token
              var token = uptoken(bucket, fileName);

              //调用uploadFile上传
              uploadFile(token, fileName, filePath);
              fields[key] = 'http://ogk4g82l7.bkt.clouddn.com/' + fileName;
              console.log('http://ogk4g82l7.bkt.clouddn.com/' + fileName)
          }
        }

        ApiAction.post(req.url,fields,function(data){
          res.json(data);
        }, config)
      }
  });
}

function handleApiWithFile_aaaa(req, res, config){
  // var reqq = multipart(req);
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, 'tmp');   //文件保存的临时目录为当前项目下的tmp文件夹
  form.maxFieldsSize = 10 * 1024 * 1024;  //用户头像大小限制为最大10M
  form.keepExtensions = true;        //使用文件的原扩展名
  form.parse(req, function (err, fields, file) {
      var filePath = '';
      //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
      if(file.tmpFile){
          filePath = file.tmpFile.path;
      } else {
          for(var key in file){
              if( file[key].path && filePath==='' ){
                  filePath = file[key].path;
                  break;
              }
          }
      }
      var fileExt = filePath.substring(filePath.lastIndexOf('.'));
      //判断文件类型是否允许上传
      if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
          var err = new Error('此文件类型不允许上传');
          res.json({code:-1, message:'此文件类型不允许上传'});
      } else {
          //以当前时间戳对上传文件进行重命名
          var fileName = new Date().getTime()+ '/'  + fields.username + fileExt;

          //生成上传 Token
          var token = uptoken(bucket, fileName);

          //调用uploadFile上传
          uploadFile(token, fileName, filePath);
          fields[fields.paramUrl] = 'http://ogk4g82l7.bkt.clouddn.com/' + fileName;
          fs.unlink(filePath);
          ApiAction.post(req.url,fields,function(data){
            res.json(data);
            // res.json({status: 0, body:{success: true, msg:''}})
          }, config)
      }
  });
}

//构造上传函数
function uploadFileWithCb(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        console.log("success upload");
      if(!err) {
        // 上传成功， 处理返回值
        fs.unlink(localFile);
        
        // cb(true, '', res, localFile, url)
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
        // cb(false, err.toString(), res, filePath, url)
      }
  });
}

function handleApiWithOneFile(req, res){
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, 'tmp');   //文件保存的临时目录为当前项目下的tmp文件夹
  form.maxFieldsSize = 10 * 1024 * 1024;  //用户头像大小限制为最大10M
  form.keepExtensions = true;        //使用文件的原扩展名
  form.parse(req, function (err, fields, file) {
      var filePath = '';
      //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
      for(var key in file){
          if( file[key].path && filePath==='' ){
              filePath = file[key].path;
              break;
          }
      }
      var fileExt = filePath.substring(filePath.lastIndexOf('.'));
      //判断文件类型是否允许上传
      if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
          var err = new Error('此文件类型不允许上传');
          res.json({code:-1, message:'此文件类型不允许上传'});
      } else {
          //以当前时间戳对上传文件进行重命名
          var fileName = new Date().getTime()+ '/'  + fields.username + fileExt;

          //生成上传 Token
          var token = uptoken(bucket, fileName);

          //调用uploadFile上传
          uploadFile(token, fileName, filePath, res);
          
          var url = 'http://ogk4g82l7.bkt.clouddn.com/' + key;
          res.json({status: 0, body:{success: true, msg:'上传成功', qiniuUrl: url}})
      }
  });
}

router.post('/uploadOnePic', function(req,res){
  handleApiWithOneFile(req, res);
});


router.post('*',function(req,res){
    handleApiWithFile(req, res, global.qsH5Config);
})
module.exports = router;
