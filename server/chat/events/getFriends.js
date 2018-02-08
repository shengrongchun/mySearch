const User = require('../../model').User

module.exports = (allSocketList, socket) => ({ from }) => {//
    User
        .findOne({_id: from})
        .select('friends')
        .exec()
        .then(doc => {
            if (doc.friends.length < 1) return []
            return User.find({_id: {$in: doc.friends}}).select('_id name').exec()
        })
        .then(list => {
            socket.emit('getFriends', list)
        })
}