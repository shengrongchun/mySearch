import { socket } from './index'

export default {
    loginSuccess(data) {//
        return new Promise((res, rej) => {
            socket.emit('loginSuccess', data)
            socket.once('loginSuccess', data => {
                if (data.type === 'error') return rej(data)
                return res(data)
            })
        })
    },
    getFriends(from) {//
        return new Promise((res, rej) => {
            socket.emit('getFriends', { from })
            socket.once('getFriends', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    searchUsers({ keyword, from }) {//
        return new Promise((res, rej) => {
            socket.emit('searchUsers', { keyword, from })
            socket.once('searchUsers', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    addFriend(params) {//
        return new Promise((res, rej) => {
            socket.emit('addFriend', params)
            socket.once('addFriend', data => {
                if (data.error) return rej(data.error)
                return res(data.ok)
            })
        })
    },
    addFriendOk(params) {//
        return new Promise((res, rej) => {
            socket.emit('addFriendOk', params)
            socket.once('okAddFriend', data => {
                if (data.error) return rej(data.error)
                return res(data.ok)
            })
        })
    },
    pushMsg(params) {//发送信息
        return new Promise((res, rej) => {
            socket.emit('pushMsg', params)
            socket.once('pushMsg', data => {
                if (data.error) return rej(data.error)
                return res(data.ok)
            })
        })
    },
    logout(params) {//
        return new Promise((res, rej) => {
            socket.emit('logout', params)
            socket.once('logout', data => {
                if (data.error) return rej(data.error)
                return res(data.ok)
            })
        })
    },
    deleteUser(params) {//
        return new Promise((res, rej) => {
            socket.emit('removeFriend', params)
            socket.once('removeFriend', data => {
                if (data.error) return rej(data.error)
                return res(data.ok)
            })
        })
    },
    createGroup(params) {//
        return new Promise((res, rej) => {
            socket.emit('createGroup', params)
            socket.once('createGroup', data => {
                if (data.error) return rej(data.error)
                return res(data)
            })
        })
    },
    getGroups(from) {//
        return new Promise((res, rej) => {
            socket.emit('getGroups', { from })
            socket.once('getGroups', data => {
                if (data.error) return rej(data.error)
                return res(data)
            })
        })
    },
    deleteGroup(params) {//
        return new Promise((res, rej) => {
            socket.emit('removeGroup', params)
            socket.once('removeGroup', data => {
                if (data.error) return rej(data.error)
                return res(data)
            })
        })
    },
    searchGroups({keyword, from}) {//
        return new Promise((res, rej) => {
            socket.emit('searchGroups', { keyword, from })
            socket.once('searchGroups', data => {
                if (data.error) return rej(data.error)
                return res(data)
            })
        })
    },
    addGroup(params) {//
        return new Promise((res, rej) => {
            socket.emit('addGroup', params)
            socket.once('addGroup', data => {
                if (data.error) return rej(data.error)
                return res(data)
            })
        })
    },
    updateUser(params) {//
        return new Promise((res, rej) => {
            socket.emit('updateUser', params)
            socket.once('updateUser', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },





    pullMsg(params) {
        return new Promise((res, rej) => {
            socket.emit('pullMsg', params)
            socket.once('pullMsg', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },
    getGroupMember(params) {
        return new Promise((res, rej) => {
            socket.emit('getGroupMember', params)
            socket.once('getGroupMember', data => {
                if (data.msg || data.message) return rej(data)
                return res(data)
            })
        })
    },

}