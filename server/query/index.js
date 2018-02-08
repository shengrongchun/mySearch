//var url = require('url');
//var fs = require('fs');
var https = require('https');
var http = require('http');
var baiduDomain = require('./baiduDomain');

var getHttp = http;
var key = '';
var type = 'baidu';
var biyinType = 'in';
var returnKey = '';
var reg = '';
var link = false;
var Css = {
    baidu: '<style>.bodyQuery #head,#s_tab,#content_right,.search_tool,.head_nums_cont_outer.OP_LOG {display:none;}.bodyQuery #container {margin-left:-121px}</style>',
    biyin: '<style>.bodyQuery #b_header,#b_context,#b_content #b_context,#b_content .tipContainer,.tipBottomAnswer {display: none} .bodyQuery #b_content {padding:0;margin-left:-20px;margin-top:15px;}</style>',
    sogou: '<style>#sogou_wrap_id .header {display:none} #sogou_wrap_id #wrapper,#sogou_wrap_id .hintBox,#sogou_wrap_id #hint_container,#sogou_wrap_id  #pagebar_container{padding:0;padding-top:5px}</style>'
}
var options = {
    hostname: 'www.baidu.com', 
    port: 80, 
    path: '', 
    method: 'GET',
    headers: {
        'Accept':'*/*',
        'Connection':'keep-alive',
        'Host':'www.baidu.com',
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36',
    } 
}; 
//
var setOptions = function() {
    getHttp = https;
    options.port = 443;
    if(type == 'baidu') {
        getHttp = http;
        options.port = 80;
        options.hostname = options.headers.Host = 'www.baidu.com';
        options.path = link?key:'/s?wd='+key;
        //
        reg = '\wd=.*?\&';
        returnKey = link?( key.match(reg)[0].replace('wd=','').replace('&','') ):key;
    }else if(type == 'biyin') {
        options.hostname = options.headers.Host = 'cn.bing.com';
        options.path = link?key:( biyinType=='out'?('/search?q='+key+'&ensearch=1'):('/search?q='+key) );
        //
        reg = '\q=.*?\&';
        returnKey = link?( key.match(reg)[0].replace('q=','').replace('&','') ):key;
    }else if(type == 'sogou') {
        options.hostname = options.headers.Host = 'www.sogou.com';
        options.path = link?( key.replace('/','/web') ):('/web?query='+key);
        //
        reg = '\query=.*?\&';
        returnKey = link?( key.match(reg)[0].replace('query=','').replace('&','') ):key;
    }
    
}
//
var httpQuery = function(response) {
    //
    var data = '';
    var req = getHttp.request(options, function (res) { 
        //console.log(options)
        console.log('STATUS: ' + res.statusCode); 
        res.setEncoding('utf8'); 
        res.on('data', function (chunk) { 
            data += chunk.replace('name="referrer"','');
        });
        res.on('end', function() {
            if(type == 'baidu') {
                data = baiduDomain(data)
            }
            //
            response.send( {returnKey:returnKey,type:type,data:Css[type]+'<meta name="referrer" content="never">'+data} );
        }); 
    }); 
    //
    req.on('error', function (e) { 
        console.log('problem with request: ' + e.message);
        response.status(500).send( {type:type} ); 
    }); 
    req.end();
}
//
var query = function(app) {
    app.use('/query', function(req, res) {
        //
        key = req.body.key?req.body.key:key;
        type = req.body.type?req.body.type:type;
        link = req.body.link;
        biyinType = req.body.biyinType?req.body.biyinType:biyinType;
        //
        setOptions();
        //
        httpQuery(res);
    });
    //


}
//
module.exports = query;