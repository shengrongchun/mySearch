const User = require("../../model").User
const Group = require("../../model").Group

module.exports = ( allSocketList, socket ) => ({ groupId }) => {

    if (!groupId) {
        socket.emit('getGroupMember', { status: 400, msg: 'groupId缺失' })
        return
    }

    Group
        .findById(groupId)
        .select('member')
        .exec()
        .then(doc => {
            if (!doc) return []
            return User
                .find({ _id: { $in: doc.member } })
                .select('_id name avatar')
                .exec()
        })
        .then(data => {
            socket.emit('getGroupMember', data)
        })
}