const User = require('../../model').User

module.exports = (allSocketList, socket, io) => (params) => {//
    if( allSocketList[params._id] ) {//自己在线
        allSocketList[params._id] = null//下线
    }
    socket.emit('logout', {ok:'下线'})     
}