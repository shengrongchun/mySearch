const User = require('../../model').User

module.exports = (allSocketList, socket) => ({ from, data }) => {//
    if (!from) {
        socket.emit('updateUser', { status: 400, msg: '参数from缺失' })
    }

    User
        .findByIdAndUpdate(from, {name: data.name, avatar: data.avatar, password: data.password})
        .exec()
        .then(user => {
            socket.emit('updateUser', {ok: '修改成功'})
        })
        .catch(err => {
            socket.emit('updateUser', err)
        })
}