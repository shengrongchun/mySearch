const User = require("../../model").User
const Group = require("../../model").Group

module.exports = (allSocketList, socket) => ({ fromId, groupId }) => {//
    Promise.all([
        User.findByIdAndUpdate(fromId, {$pull: {groups: groupId}}).exec(),
        Group.update({_id: groupId}, {$pull: {member: fromId}})
    ])
    .then((cols) => {
        socket.broadcast.emit(groupId, {
            groupId,
            data: {
                type: 'system',
                name: '系统消息',
                content: `${cols[0].name} 已经退出聊天群组了`
            }
        })
        socket.emit('removeGroup', {ok: '退出成功'})
        //如果member为0,删除这个群组
        Group.find({_id: groupId})
        .limit(1)
        .select('member')
        .exec()
        .then(item => {
            if(item[0].member.length == 0) {
                Group.findOneAndRemove({_id: groupId}).exec()
                .then(() => {
                    //console.log('删除成功')
                })
            }
        })
    })
    .catch(err => {
        socket.emit('removeGroup', {error: '退出失败'})
    })
        
}