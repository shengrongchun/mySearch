import Vue from 'vue'

var stateData = {
    noticeAddFriend: {
        confirmAddFriend: false,
        name: null,
        _id: null
    },
    dialog: {//打开登录弹出框
        type: 'login',
        centerDialogVisible: false
    },
    //
    user: {
        _id: null,
        name: null
    },
    activeList: 'friends',  // 当前聊天菜单类型
    searchResultList: [], //搜索结果
    friendsList: [], //好友列表
    currentOne: null,     // 当前聊天对象
    messages: {},    // 消息记录
    activeMsgList: [], //当前回话列表
    counts: {},  // 消息对象
    countNum: 0, //消息总数
   
}
//state
export const state = stateData
//getters 计算属性
export const getters = {
}

//mutations
export const mutations = {
    resetState: (state) => {//清空state
        state.user = { _id: null,name: null}
        state.activeList = 'friends'
        state.counts = {}
        state.searchResultList = []
        state.friendsList = []
        state.currentOne = null
        state.messages = {}
        state.activeMsgList = []
        state.countNum = 0
    },
    setDialog: (state, dialog) => {//设置dialog
        state.dialog = dialog
    },
    setUser: (state, value) => {//设置searchKey的值
        state.user = value
    },
    setSearchResult:(state, resultList) => {//设置搜索好友结果
        state.searchResultList = resultList
    },
    setFriendsList:(state, list) => {//设置好友列表
        state.friendsList = list
    },
    pushFriendsList:(state, item) => {//push好友列表
        state.friendsList.push(item)
    },
    deleteFriendsList:(state, item) => {//删除好友列表
        for(let i in state.friendsList) {
            if(state.friendsList[i]._id === item._id) {
                state.friendsList.splice(i,1)
                return
            }
        } 
    },
    changeCurrentOne:(state, currentOne) => {//改变当前选中页
        state.currentOne = currentOne
        state.counts[currentOne._id] = null//消除点击的消息数目
        state.countNum = state.countNum-parseInt(state.counts[currentOne._id])
    },
    pushMsg: (state, msg) => {//本地push信息
        if(state.messages[msg.msgId]) {
            state.messages[msg.msgId].push(msg)
        } else {
            Vue.set(state.messages, msg.msgId, [msg])
            state.activeMsgList.push({
                name: msg._id ? state.currentOne.name : msg.name,
                _id: msg.msgId
            })//增加会话
        }
    },
    addCount: (state, from) => {//增加count数目
        if(state.counts[from._id]) {
            state.counts[from._id] = parseInt(state.counts[from._id])+1
        } else {//新建
            Vue.set(state.counts, from._id, 1)
        }
        //
        state.countNum = state.countNum+1
    }
}