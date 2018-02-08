const User = require('../../model').User

module.exports = (allSocketList, socket, io) => ({ from, data }) => {
    if (!from) {
        socket.emit('updateUser', { status: 400, msg: '参数from缺失' })
    }

    User
        .findByIdAndUpdate(from, _.pick(data, ['name', 'password']))
        .exec()
        .then(user => {
            let body = _.assign(user.toObject(), _.pick(data, ['name', 'password']))

            socket.emit('updateUser', body)
        })
        .catch(err => {
            socket.emit('updateUser', err)
        })
}