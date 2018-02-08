const User = require('../../model').User

module.exports = (allSocketList, socket) => ({ from }) => {
    User
        .findById(from)
        .exec()
        .then(user => {
            if(!user) {
                return Promise.reject({status: 404, msg: '该用户不存在'})
            } else {
	            socket.emit('getUser', user.toObject())
            }
        })
        .catch(err => {
            socket.emit('getUser', err)
        })
}