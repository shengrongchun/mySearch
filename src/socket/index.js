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
    socket.on('message', ({ from, content }) => {
        if (!state.currentOne || from._id !== state.currentOne._id) {//非active的页面发来了消息
            //增加from的消息数目
            commit('addCount', from) 
        }
        commit('pushMsg', {name:from.name,msgId:from._id,content:content})
        //收到信息应答
        socket.emit('message',{ok:'信息成功送达'})
    })
    socket.on('addFriendOk', ({ from }) => {//对方请求添加你为好友
        state.noticeAddFriend.confirmAddFriend = true
        state.noticeAddFriend.name = from.name
        state.noticeAddFriend._id = from._id
    })
}


export {
    socket,
    addUserListener
}