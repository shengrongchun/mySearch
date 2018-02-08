const db = require("../../model")

module.exports = (allSocketList, socket, io) => ({ from, friendId, groupId, content }) => {//
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
            io.sockets.emit(groupId, {
                from,
                content: message
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
            } else {
                socket.emit('pushMsg', {error: '对方不在线' })
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