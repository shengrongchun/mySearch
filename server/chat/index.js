var fs = require('fs')
var path = require('path')
var dir = './chat/events'
//
let map = {}
let eventNames = fs.readdirSync(dir).map(item => item.replace(/\.js$/, ''))
eventNames.forEach(event => {
    let filePath = path.resolve(dir, event)
    let fn = require(filePath)
    if (typeof fn !== 'function') fn = () => () =>{}
    map[event] = fn
})
//
let allSocketList = []
let allSocketMsgList = []
var chat = function(server) {
    var io = require('socket.io')(server)
    //监听所有连接
    io.on('connection', function(socket) {
        //socket客户端socket 
        for(let eventName in map) {
            socket.on( eventName, map[eventName](allSocketList, socket, allSocketMsgList) )
        }
    })
}
//
module.exports = chat