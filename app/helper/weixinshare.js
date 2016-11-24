var request = require('request');
var sign=require('../helper/sign');//微信提供的签名方法
var WeiXinData={
    appid:'wx2d22b4133f04d06e',//正式
    secret:'0209044ac26f4ba5f625890d8bcdcfdb',//正式
    access_token:'',
    ticket:'',
    access_tokenDate:0,
    ticketDate:0
}
var successFunction=function (sign,appid,timestamp,noncestr,url,ticket,cb){
    if(cb){
        cb(sign,appid,timestamp,noncestr,url,ticket);
    }
}
var WeiXinShare=function(req,res,cb){
    var url="";
    if( req.query.from=="undefined" ||  req.query.from==""  ||req.query.from==null )  {
        url=req.protocol + 's://' + req.hostname+ req.path;
    }
    else {
        url=req.protocol + 's://' + req.hostname+ req.path+"?from="+req.query.from+"&isappinstalled="+req.query.isappinstalled;
    }

    var appid=WeiXinData.appid;
    var secret=WeiXinData.secret;
    var  _sign='';
    var _timestamp='';
    var _noncestr='';


    var now=new Date().getTime()/1000;
    if(now<WeiXinData.ticketDate-1200&&WeiXinData.ticket.length>0){//有票据并且在期限前20分钟
        var singdata=sign(WeiXinData.ticket,url).split(',');
            _sign=singdata[0];
            _timestamp=singdata[2];
            _noncestr=singdata[1];

        successFunction(_sign,appid,_timestamp,_noncestr,url,WeiXinData.ticket,cb);
    }else{
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret, function (error, response, body) {

            var access_token=null;
            if(body){
                access_token=JSON.parse(body).access_token;
            }
            if(access_token){
                request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi', function (error, response, body) {

                    var ticket=null;
                    var date=0;
                    if(body){
                        ticket=JSON.parse(body).ticket;
                        date=JSON.parse(body).expires_in;
                    }
                    if(ticket){
                        WeiXinData.ticket=ticket;
                        WeiXinData.ticketDate=date+(new Date().getTime()/1000);
                        var singdata=sign(WeiXinData.ticket,url).split(',');
                          _sign=singdata[0];
                         _timestamp=singdata[2];
                         _noncestr=singdata[1];
                        successFunction(_sign,appid,_timestamp,_noncestr,url,WeiXinData.ticket,cb);
                    }else{
                        successFunction(_sign,appid,_timestamp,_noncestr,url,WeiXinData.ticket,cb);
                    }

                })
            }else{
                successFunction(_sign,appid,_timestamp,_noncestr,url,WeiXinData.ticket,cb);
            }
        })
    }
}
module.exports = WeiXinShare;