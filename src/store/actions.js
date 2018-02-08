import Vue from 'vue'
import { addUserListener } from '@/socket'
import ws from '@/socket/events'

//actions
export default {
    loginSuccess({ state, commit }, data) {//登录成功后初始化好友列表
        return ws.loginSuccess(data).then(result => {
            //获取好友列表
            ws.getFriends(state.user._id).then(result => {
                commit('setFriendsList', result)
            })
            // 初始化用户监听器
            addUserListener(data, state, commit)
        })
    },
    searchUsers({ state, commit }, keyword) {//搜索需要加入的好友
        return ws.searchUsers({
            keyword,
            from: state.user._id
        }).then(result => {
            commit('setSearchResult', result)
        })
    },
    addFriend({ state, commit }, friend) {//加好友
        return ws.addFriend({
            from: {_id:state.user._id, name: state.user.name},
            friendId: friend._id
        }).then((result) => {
            commit('pushFriendsList', {name: friend.name, _id: friend._id})
        },(error) => {
            alert(error)
        })
    },
    addFriendOk({ state, commit }, mask) {//
        state.noticeAddFriend.confirmAddFriend = false
        return ws.addFriendOk({_id:state.user._id, ok: mask}).then((result) => {
           commit('pushFriendsList', {name: state.noticeAddFriend.name, _id: state.noticeAddFriend._id})
        },(error) => {
            alert(error)
        })
    },
    changeCurrentOne({ commit }, item) {//改变当前点击页面
        commit('changeCurrentOne', item)
    },
    pushMsg({ commit, state }, content) {//发送信息
        let params = {
            from: state.user,
            content: content
        }
        //
        if (state.activeList === 'friends') {
            params.friendId = state.currentOne._id
        } else {
            params.groupId = state.currentOne._id
        }
        //
        if (state.activeList === 'friends') {
            commit('pushMsg', {
                name: state.user.name,
                _id: state.user._id,
                msgId: state.currentOne._id,
                content: content
            })
        }
        return ws.pushMsg(params).then((result) => {//把信息发送给对方
            console.log(result)
        },(error) => {
            alert(error)
        })
    },
    logout({ commit, state }, data) {//退出
        return ws.logout(state.user).then((result) => {
           commit('resetState')
        },(error) => {
            alert(error)
        })
    },
    deleteUser({ commit, state }, user) {//删除好友
        return ws.deleteUser({fromId:state.user._id, friendId:user._id}).then((result) => {
           state.currentOne = null
           commit('deleteFriendsList', {name: user.name, _id: user._id})
        },(error) => {
            alert(error)
        })
    },
}