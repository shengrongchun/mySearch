const User = require('../../model').User

module.exports = (allSocketList, socket) => ({ fromId, friendId }) => {//
	Promise.all([
		User.update({_id: fromId}, {$pull: {friends: friendId}}),
		User.update({_id: friendId}, {$pull: {friends: fromId}})
	])
	.then(() => {
		socket.emit('removeFriend', { ok: '删除成功' })
	})
	.catch(err => {
	    socket.emit('removeFriend', { error: '删除失败' })
	})
        
}