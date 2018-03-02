const User = require('../../model').User

module.exports = (allSocketList, socket, allSocketMsgList) => (data) => {//
    
    if(allSocketList[data._id]) {//已经在线
        //allSocketList[data._id] = socket
        socket.emit('loginSuccess', {
            type: 'error',//最终要改成error
            msg: '重复登录'
        })
    } else {
        socket.emit('loginSuccess', {
            type: 'ok',
            msg: '登录成功'
        })
    }
}