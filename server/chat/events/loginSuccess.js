
module.exports = (allSocketList, socket) => (data) => {//
    allSocketList[data._id] = socket
    socket.emit('loginSuccess', '登录成功了')
}