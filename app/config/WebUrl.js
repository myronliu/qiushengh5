
module.exports={

//     server {
//         listen  80;
//         server_name  example1.com www. example1.com;
//         access_log  /www/access_ example1.log  main;
//         location / {
//             root   /www/example1.com;
//             index  index.php index.html index.htm;
//         }
//         error_page   500 502 503 504  /50x.html;
//         location = /50x.html {
//             root   /usr/share/nginx/html;
//         }
//        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
//         location ~ .php$ {
//             fastcgi_pass   127.0.0.1:9000;
//             fastcgi_index  index.php;
//             fastcgi_param  SCRIPT_FILENAME  /www/example1.com/$fastcgi_script_name;
//             include        fastcgi_params;
//         }
//         location ~ /.ht {
//             deny  all;
//         }
// }

// server {
//         listen  80;
//         server_name  example2.com www. example2.com;
//         access_log  /www/access_ example1.log  main;
//         location / {
//             root   /www/example2.com;
//             index  index.php index.html index.htm;
//         }
//         error_page   500 502 503 504  /50x.html;
//         location = /50x.html {
//             root   /usr/share/nginx/html;
//         }
//        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
//         location ~ .php$ {
//             fastcgi_pass   127.0.0.1:9000;
//             fastcgi_index  index.php;
//             fastcgi_param  SCRIPT_FILENAME  /www/example2.com/$fastcgi_script_name;
//             include        fastcgi_params;
//         }
//         location ~ /.ht {
//             deny  all;
//         }
// }

    index:'/',
    /**
     *  腾讯应用宝下载
     */
    QQDownload:'http://a.app.qq.com/o/simple.jsp?pkgname=com.haier.hairy',
    /**
     *  下载页地址
     */
    download:'http://a.app.qq.com/o/simple.jsp?pkgname=com.haier.hairy',
    /**
     *  天天聚转入
     */
    TTJRollIn:'/user/TTjRollIn',
    /**
     *  收银台
     */
    kjtPay:function(token,voucherNo,price,successurl,processurl,failurl){
        return global.carshierAddress+'/v2/pay?token='+token+'&voucher='+voucherNo+'&price='+price+'&successurl='+successurl+'&processurl='+processurl+'&failurl='+failurl
    },
    /**
     *  支付成功页
     */
    paySuccess:function(title,message){
        return '/helper/Success?title='+title+'&message='+message
    },
    /**
     *  支付成功页
     */
    itemdetail:function(hotBidId){
        return '/financing/itemdetail/'+hotBidId+'?source=H5'
    },
    /***
     * 用户协议       用户协议：user  转账到银行卡协议：trans  快捷通服务协议：kjt 海融易平台服务协议：hry 快捷支付服务协议： kjzf
     * @param termtype
     * @returns {string}
     */
    terms:function(termtype){
        return '/help/terms/'+termtype+'?source=H5';


    }
}
