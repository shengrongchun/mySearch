import Vue from 'vue'
import { addUserListener, addGroupsListener, addSingleGroupListener, removeSingleGroupListener } from '@/socket'
import ws from '@/socket/events'

//actions
export default {
    loginSuccess({ state, commit }, data) {//登录成功后初始化好友列表
        return ws.loginSuccess(data).then(result => {
            //获取好友列表
            ws.getFriends(state.user._id).then(result => {
                commit('setFriendsList', result)
            })
            ws.getGroups(state.user._id).then(result => {
                commit('setGroupsList', result)
                //初始化群组监听器
                addGroupsListener(result, state, commit)
            })
            // 初始化用户监听器
            addUserListener(data, state, commit)
        }, (result) => {
            commit('loginError', result)
        })
    },
    searchUsers({ state, commit }, keyword) {//搜索需要加入的好友
        return ws.searchUsers({
            keyword,
            from: state.user._id
        }).then(result => {
            for(let i in result) {//filter
                if(JSON.stringify(state.friendsList).indexOf(JSON.stringify(result[i])) > -1) {
                    result[i].have = true
                }
            }
            commit('setSearchResult', result)
        })
    },
    searchGroup({ state, commit }, keyword) {//搜索需要加入的群组
        return ws.searchGroups({
            keyword,
            from: state.user._id
        }).then(result => {
            for(let i in result) {//filter
                if(JSON.stringify(state.groupsList).indexOf(JSON.stringify(result[i]._id)) > -1) {
                    result[i].have = true
                }
            }
            commit('setSearchGroupsResult', result)
        })
    },
    addFriend({ state, commit }, friend) {//加好友
        return ws.addFriend({
            from: {_id:state.user._id, name: state.user.name, avatar: state.user.avatar},
            friendId: friend._id
        }).then((result) => {
            commit('pushFriendsList', friend)
            friend.type = 'resolve'
            commit('addFriendOk', friend)
        },(error) => {
            friend.type = 'reject'
            commit('addFriendOk', friend)
        })
    },
    addFriendOk({ state, commit }, data) {//
        commit('delNoticeListItem',data.data)
        return ws.addFriendOk({_id:state.user._id, ok: data.mask}).then((result) => {
           commit('pushFriendsList', data.data)
        },(error) => {
            console.log(error)
        })
    },
    changeCurrentOne({ commit }, item) {//改变当前点击页面
        commit('changeCurrentOne', item)
    },
    pushMsg({ state, commit }, content) {//发送信息
        let params = {
            from: state.user,
            content: content
        }
        //
        if (state.currentOne.owner) {
            params.groupId = state.currentOne._id
        } else {
            params.friendId = state.currentOne._id
        }
        //
        commit('pushMsg', {
            name: state.user.name,
            avatar: state.user.avatar,
            _id: state.user._id,
            msgId: state.currentOne._id,
            content: content
        })
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
    deleteGroup({ commit, state }, group) {//退出群组
        return ws.deleteGroup({fromId:state.user._id, groupId:group._id}).then((result) => {
           state.currentOne = null
           commit('deleteGroupsList', {name: group.name, _id: group._id})
           removeSingleGroupListener(group._id)
        },(error) => {
            alert(error)
        })
    },
    createGroup({ commit, state }, data) {//创建群组
        return ws.createGroup({
            from: state.user._id,
            data: { name: data.name, avatar: data.avatar }
        }).then((item) => {//把新创建的群组放入列表中
            commit('pushGroupsList', {name: data.name, avatar: item.avatar, _id: item.groupId, owner: state.user._id})
        },(error) => {
            alert(error)
        })
    },
    addGroup({ commit, state }, group) {//加入群组
        addSingleGroupListener(group._id, state)
        return ws.addGroup({
            from: state.user._id,
            groupId: group._id
        }).then(() => {
            commit('pushGroupsList', {name: group.name, avatar: group.avatar, _id: group._id, owner: group.owner})
        })
    },
    updateUser({ commit, state }, data) {//更新user
        let params = {
            from: state.user._id,
            data
        }
        return new Promise((res, rej)=> {
            ws.updateUser(params).then(result => {
                commit('setUser', {_id: state.user._id,name: data.name, avatar: data.avatar})
                res(result)
            },(error)=> {
                rej(error)
            })
        })
    },


}