var cookieParser = require('cookie-parser')
// 引用express-session模块
var session = require('express-session')

//注册
var sign = require('./sign')
//登录
var login = require('./login')

const fs = require('fs')
const path = require('path')
const express = require('express')

var Login = function (app) {
    //实例化cookie
    app.use(cookieParser())
    //实例化session
    app.use(session({
        name: 'cookieName',
        secret: 'cookieSignName',
        cookie: {'maxAge':30*1000},//多长时间过期
        resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true
        saveUninitialized: false //
    }))
    //将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了
    app.use('/static',express.static(path.resolve(__dirname, '../dist/static')))
    //
    app.use(function(req, res, next) {
        // body...
        if (req.url == '/login') {
            var promise = new Promise((reslove, reject)=> {
                login(reslove, reject, req.body)
            })
            promise.then((data)=> {//成功
                //req.session.name = req.body.email+req.body.password
                res.send(data)
            },(msg)=> {//失败
                res.status(401).send(msg)
            })
        
        } else if(req.url == '/sign'){//注册
            //
            var promise = new Promise((reslove, reject)=> {
                sign(reslove, reject, req.body)
            })
            promise.then((data)=> {//成功
                res.send(data)
            },(msg)=> {//失败
                res.status(401).send(msg)
            })
        } else if(req.url == '/') {
            html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
            res.send(html)
        } else {
            //
            next() 
        }
        
    })

}
//
module.exports = Login