const User = require("../../model").User
const Group = require("../../model").Group

module.exports = (allSocketList, socket) => ({ from, groupId }) => {//

    Promise.all([
        User.findByIdAndUpdate(from, {$addToSet: {groups: groupId}}),
        Group.update({_id: groupId}, {$addToSet: {member: from}})
    ])
    .then((cols) => {
        socket.broadcast.emit(groupId, {
            groupId,
            data: {
                type: 'system',
                name: '系统消息',
                content: `${cols[0].name} 加入了聊天群组`
            }
        })
        socket.emit('addGroup', {})
    })
    .catch(err => {
        socket.emit('addGroup', {error: '加入群组失败'})
    })
        
}