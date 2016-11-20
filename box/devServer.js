var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config.dev');
var proxy = require('http-proxy-middleware');
var express = require('express');
var app = new (express)();

var port = 12400;

var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    stats: {
        colors: true
    },
    //显示细节
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.use(express.static('./src/'));

app.use(express.static('.'));


app.get("/getTestData",function (req, res) {
    if (req.query && req.query.viewName) {
        res.send(JSON.stringify({
            "result": {
                success: true,
                errorCode: null ,
                errorMsg: null
            },
            "data": {
                "model": {
                    viewName: req.query.viewName
                }
            },
            "extra": null
        }));
    } else {
        res.send(JSON.stringify({
            "result": {
                success: false,
                errorCode: 110,
                errorMsg: 'hehe'
            },
            "data": {
                "model": {
                    viewName: req.query.viewName
                }
            },
            "extra": null
        }));
    }
});

app.get("*", function (req, res) {
    res.sendFile(__dirname + '/src/index.html')
});

app.listen(port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
});
