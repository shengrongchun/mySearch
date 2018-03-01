const express = require('express')
const app = express()
var server = require('http').Server(app);
const bodyParser = require('body-parser')
//连接数据库，创建表
require('./model')
//post body体解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//登录
var login = require('./login')
login(app)
//query查询
var query = require('./query')
query(app)
//chat聊天
var chat = require('./chat')
chat(server)

//
server.listen(9000)
console.log('server starting 9000')