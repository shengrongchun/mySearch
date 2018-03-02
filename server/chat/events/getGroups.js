const User = require("../../model").User
const Group = require("../../model").Group

let sendMsg = function(allSocketList, socket, allSocketMsgList, data) {
    allSocketList[data._id] = socket
    socket.tempId = data._id
    //判断是否有信息
    if(allSocketMsgList[data._id] && allSocketMsgList[data._id].length>0) {
        for(let i=0;i<allSocketMsgList[data._id].length;i++) {
            //
            if(allSocketMsgList[data._id][i].type == 'addFriendOk') {
                let from = allSocketMsgList[data._id][i].from
                let friendId = data._id
                allSocketList[data._id].emit('addFriendOk', {from})
                allSocketList[data._id].once('addFriendOk', data => {
                    if(data.ok) {//同意添加
                        Promise.all([
                            User.update({_id: from._id}, {$addToSet: {friends: friendId}}),
                            User.update({_id: friendId}, {$addToSet: {friends: from._id}})
                        ])
                        .then(() => {
                            if(allSocketList[from._id]) {
                                allSocketList[from._id].emit('addFriend', {ok:'添加成功'})
                            }else {
                                if(allSocketMsgList[ from._id ]) {
                                    allSocketMsgList[ from._id ].push({
                                        from: {ok:'添加成功'},
                                        type: 'addFriend'
                                    })
                                } else {
                                    allSocketMsgList[ from._id ] = [{
                                        from: {ok:'添加成功'},
                                        type: 'addFriend'
                                    }]
                                }
                            }
                            allSocketList[friendId].emit('okAddFriend', {ok:'添加成功'})
                        })
                        .catch(err => {
                            if(allSocketList[from._id]) {
                                allSocketList[from._id].emit('addFriend', {error:'数据库操作失败'})
                            } else {
                                if(allSocketMsgList[ from._id ]) {
                                    allSocketMsgList[ from._id ].push({
                                        from: {error:'数据库操作失败'},
                                        type: 'addFriend'
                                    })
                                } else {
                                    allSocketMsgList[ from._id ] = [{
                                        from: {error:'数据库操作失败'},
                                        type: 'addFriend'
                                    }]
                                }
                            }
                            allSocketList[friendId].emit('okAddFriend', {error:'数据库操作失败'})
                        })
                    } else{
                        if(allSocketList[from._id]) {
                            allSocketList[from._id].emit('addFriend', {error:'对方拒绝了你的添加请求'})
                        } else {
                            if(allSocketMsgList[ from._id ]) {
                                allSocketMsgList[ from._id ].push({
                                    from: {error:'对方拒绝了你的添加请求'},
                                    type: 'addFriend'
                                })
                            } else {
                                allSocketMsgList[ from._id ] = [{
                                    from: {error:'对方拒绝了你的添加请求'},
                                    type: 'addFriend'
                                }]
                            }
                        }
                        allSocketList[friendId].emit('okAddFriend', {error:'添加失败'})
                    }
                })
            } else if(allSocketMsgList[data._id][i].type == 'addFriend') {
                allSocketList[data._id].emit('addFriend', allSocketMsgList[data._id][i].from)
            }else {
                allSocketList[data._id].emit('message', allSocketMsgList[data._id][i])
            } 
        }
        //
        allSocketMsgList[data._id] = []
    }
}
module.exports = (allSocketList, socket, allSocketMsgList) => ({ from }) => {//
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
            //是否有未发送的信息
            sendMsg(allSocketList, socket, allSocketMsgList, {_id:from})
        })
}