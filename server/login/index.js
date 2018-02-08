var cookieParser = require('cookie-parser')
// 引用express-session模块
var session = require('express-session')

//注册
var sign = require('./sign')
//登录
var login = require('./login')

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

    //
    app.use(function(req, res, next) {
        // body...
        if (req.url == '/login') {
            var promise = new Promise((reslove, reject)=> {
                login(reslove, reject, req.body)
            })
            promise.then((data)=> {//成功
                req.session.name = req.body.email+req.body.password
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
            console.log('hello world')
            if (req.session.name) {
                //
                res.send('ok')
            } else {
                res.send(null)
            }
        } else {
            //
            next() 
        }
        
    })

}
//
module.exports = Login