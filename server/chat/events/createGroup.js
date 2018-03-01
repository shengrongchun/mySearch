const User = require("../../model").User
const Group = require("../../model").Group
const fs = require('fs')
const mineType = require('mime-types')

module.exports = (allSocketList, socket) => ({ from, data }) => {//
    if(!data.avatar) {
        data.avatar = fs.readFileSync('./login/img/temp.jpg')  
        data.avatar = new Buffer(data.avatar).toString('base64')
        data.avatar = 'data:'+ mineType.lookup('./login/img/temp.jpg') +';base64,'+data.avatar
    }
    Group
        .create({
            name: data.name,
            avatar: data.avatar,
            owner: from,
            member: [from]
        })
        .then(group => {
            return User
                    .update({ _id: from }, { $addToSet: { groups: group._id } })
                    .then(() => group._id)
        })
        .then(groupId => {
            socket.emit('createGroup', { groupId:groupId, avatar: data.avatar })
        })
        .catch(err => {
            socket.emit('createGroup', {error: '群组创建失败'})
        })
}