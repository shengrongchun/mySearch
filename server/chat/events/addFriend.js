const User = require('../../model').User

module.exports = (allSocketList, socket, allSocketMsgList) => ({ from, friendId }) => {//

	//询问用户是否同意加好友
	if( allSocketList[friendId] ) {//对方在线
		allSocketList[friendId].emit('addFriendOk', {from})
		allSocketList[friendId].once('addFriendOk', data => {
			if(data.ok) {//同意添加
				Promise.all([
					User.update({_id: from._id}, {$addToSet: {friends: friendId}}),
					User.update({_id: friendId}, {$addToSet: {friends: from._id}})
				])
				.then(() => {
					socket.emit('addFriend', {ok:'添加成功'})
					allSocketList[friendId].emit('okAddFriend', {ok:'添加成功'})
				})
				.catch(err => {
					socket.emit('addFriend', {error:'数据库操作失败'})
				   	allSocketList[friendId].emit('okAddFriend', {error:'数据库操作失败'})
				})
			} else{
				socket.emit('addFriend', {error:'对方拒绝了你的添加请求'})
				allSocketList[friendId].emit('okAddFriend', {error:'添加失败'})
			}
		})
	}else {//对方不在线
		if(allSocketMsgList[ friendId ]) {
            allSocketMsgList[ friendId ].push({
                from,
                type: 'addFriendOk'
            })
        } else {
            allSocketMsgList[ friendId ] = [{
                from,
                type: 'addFriendOk'
            }]
        }
	}
        
}