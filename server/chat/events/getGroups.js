const User = require("../../model").User
const Group = require("../../model").Group

module.exports = (allSocketList, socket) => ({ from }) => {//
    User
        .findOne({_id: from})
        .select('groups')
        .exec()
        .then(doc => {
            if (doc.groups.length < 1) return []
            return Group.find({_id: {$in: doc.groups}}).select('_id owner name avatar').exec()
        })
        .then(list => {
            socket.emit('getGroups', list)
        })
}