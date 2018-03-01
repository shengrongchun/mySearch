// 连接webSocket
import io from 'socket.io-client'

const socket = io.connect("/")

//删除之前socket的所有监听
function removeAllSocketListener() {
    for(var listener in socket.$events){
        if(listener != undefined){
            socket.removeAllListeners(listener)
        }
    }
}
// 登陆后移除前一个用户的消息监听器,并为新用户添加消息监听器
function addUserListener(user, state, commit) {
    removeAllSocketListener()//删除之前所有监听
    socket.on('message', ({ from, content, groupId }) => {
        if(groupId) {//群信息
            commit('pushMsg', {groupId:groupId,name:from.name,avatar:from.avatar,msgId:groupId,content:content})
            if(state.currentOne && state.currentOne._id == groupId && state.isOpen) {
            } else {
                commit('addCount', groupId)
            }
        } else {
            commit('pushMsg', {name:from.name,avatar:from.avatar,msgId:from._id,content:content})
            if(state.currentOne && state.currentOne._id == from._id && state.isOpen) {
            } else {
                commit('addCount', from._id)
            }
        }
        //
        if(!state.isOpen) {
            window.vue.$notify({
                title: from.name,
                dangerouslyUseHTMLString: true,
                position: 'bottom-right',
                message: content.indexOf('<img')>-1 ? '[图片]' : content
            })
        }
        //收到信息应答
        socket.emit('message', {ok:'信息成功送达'})
    })
    socket.on('addFriendOk', ({ from }) => {//对方请求添加你为好友
        from.type = 'add'
        commit('addFriendOk', from)
    })
}
// 登陆后为所有群组添加监听器
function addGroupsListener(group, state, commit) {
    for(let i in group) {
        socket.on(group[i]._id, ({ from, data }) => {
            window.vue.$notify({
                title: data.name,
                dangerouslyUseHTMLString: true,
                position: 'bottom-right',
                message: data.content
            })
        })
    }
}
// 为单个群组添加监听
function addSingleGroupListener(groupId, state) {
    socket.on(groupId, ({ from, data }) => {
        window.vue.$notify({
            title: data.name,
            dangerouslyUseHTMLString: true,
            position: 'bottom-right',
            message: data.content
        })
    })
}
// 删除单个群组的监听
function removeSingleGroupListener(groupId) {
    socket.removeAllListeners(groupId)
}

export {
    socket,
    addUserListener,
    addGroupsListener,
    addSingleGroupListener,
    removeSingleGroupListener
}