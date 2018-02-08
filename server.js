const fs = require('fs');
const path = require('path');
const express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 引用express-session模块
var session = require('express-session');
const app = express();
var http = require('http');
var cheerio = require('cheerio');//解析html

//post body体解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//实例化cookie
app.use(cookieParser());

//实例化session
app.use(session({
    name: 'cookieName',
    secret: 'cookieSignName',
    cookie: {'maxAge':30*1000},//多长时间过期
    resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true
    saveUninitialized: false, //
}));

//将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了
app.use('/static',express.static(path.resolve(__dirname, './dist/static')));
//query
app.use('/query', function(req, res) {
    // console.log(req.body)
    // content = req.body.key;
    queryPage(res);
});
//
app.use(function(req, res) {
    var index = '';
    index = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8');
    res.send(index);
});


//
var content = 'nodejs';
var html = '';
var req = null;
var options = { //https://www.baidu.com/s?wd=nodejs
    hostname: 'www.baidu.com', 
    port: 80, 
    path: '/s?wd=' + content, 
    method: 'GET' 
}; 
//
function filterSlideList(html) {
    if(html) {
        // 沿用JQuery风格，定义$
        var $ = cheerio.load(html, {
            xml: {
                normalizeWhitespace: true,
            }
        });
        fs.writeFile(__dirname + '/baidu.js', html, {flag: 'a'}, function (err) {
                if(err) {
                    console.error(err);
                } else {
                   //console.log('写入成功');
                }
            });
        //$('#s_tab').attr('style','{display:none;}');
        return $.html();
        
    } else {
        console.log('无数据传入！');
        return null;
    }
}
//
function queryPage(response) {
    var data = '';
    req = http.request(options, function (res) { 
        console.log('STATUS: ' + res.statusCode); 
        res.setEncoding('utf8'); 
        res.on('data', function (chunk) { 
            data += chunk;
        });
        res.on('end', function() {
            // 通过过滤页面信息获取实际需求的轮播图信息
            html = filterSlideList(data);
            
            //html = data;
            response.send( html );
        }); 
    }); 
    //
    req.on('error', function (e) { 
        console.log('problem with request: ' + e.message); 
    }); 
    req.end();
}
// 

        




//
app.listen(8000);
console.log('server starting 8000');
