const User = require("../../model").User
const Group = require("../../model").Group

module.exports = ( allSocketList, socket ) => (_id) => {//

    if (!_id) {
        socket.emit('delMyself', { status: 400, msg: '_id缺失' })
        return
    }
    //
    Promise.all([
        User.findById(_id).select('groups').exec()
        .then(doc => {
            if(doc) {
                Group.update({ _id: { $in: doc.groups }}, {$pull: {member: _id}})
            }
        }),
        //其他用户是他朋友也删除
        User.update({},{$pull: {friends: _id}}),
        //删除用户
        User.findOneAndRemove({_id: _id}).exec()
    ])
    .then((data)=> {
        socket.emit('delMyself', {ok:'注销成功'})
    })
    .catch(err => {
        socket.emit('delMyself', err)
    })
}