const db = require("../../model")
const Group = require("../../model").Group
let item = null

module.exports = (allSocketList, socket, allSocketMsgList) => ({ from, friendId, groupId, groupName, content }) => {//
    if (!content || !from) {
        socket.emit('pushMsg', {error: '消息字段不全' })
        return
    }

    if (groupId) {
        createMsg({
            toGroup: groupId,
            from: from._id,
            content: content
        }).then(message => {
            //获取member数量
            Group.find({_id: {$in: groupId}}).select('member').exec()
            .then(list => {
                item = list[0].member
                for(let i=0;i<item.length;i++) {
                    if(item[i] != from._id) {//除自己之外
                        if(allSocketList[ item[i] ]) {//在线
                            allSocketList[ item[i] ].emit('message', {
                                from,
                                groupId: message.toGroup,
                                groupName: groupName,
                                content: message.content
                            })
                        } else {//不在线，把信息保存
                            if(allSocketMsgList[ item[i] ]) {
                                allSocketMsgList[ item[i] ].push({
                                    from,
                                    groupId: message.toGroup,
                                    groupName: groupName,
                                    content: message.content
                                })
                            } else {
                                allSocketMsgList[ item[i] ] = [{
                                    from,
                                    groupId: message.toGroup,
                                    groupName: groupName,
                                    content: message.content
                                }]
                            }
                        }
                    }
                }
            })
        })
    } else if (friendId) {
        createMsg({
            toUser: friendId,
            from: from._id,
            content: content
        }).then(message => {
            //发给对方
            if(allSocketList[friendId]) {
                allSocketList[friendId].emit('message', {
                    from,
                    content: message.content
                })
                //
                allSocketList[friendId].once('message', (data) => {
                    socket.emit('pushMsg', data)
                })
            } else {//不在线
               if(allSocketMsgList[ friendId ]) {
                    allSocketMsgList[ friendId ].push({
                        from,
                        content: message.content
                    })
                } else {
                    allSocketMsgList[ friendId ] = [{
                        from,
                        content: message.content
                    }]
                }
            }
        })
    } else {
        socket.emit('pushMsg', {error: '消息字段不全' })
    }
}


function createMsg(data) {
    return db.Message
        .create(data)
        .then(msg => {
            msg = msg.toObject();
            return db.User
                .findById(msg.from)
                .select('_id name')
                .exec()
                .then(user => {
                    msg.from = user
                    return msg
                })
        })
}