const User = require('../../model').User

module.exports = (allSocketList, socket, io) => ({ from, keyword }) => {
    User
        .find({
            name: {$regex: new RegExp(keyword)}
        })
        .limit(5)
        .select('_id name')
        .exec()
        .then(users => {
            if (!users) return []
            return users.filter(item => item._id.toString() !== from)
        })
        .then(list => {
            socket.emit('searchUsers', list)
        })
        .catch(err => {
            socket.emit('searchUsers', err)
        })
}