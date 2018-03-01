import Vue from 'vue'

var stateData = {
    loginDialog: {//打开登录弹出框
        type: 'login',
        centerDialogVisible: false
    },
    addFriOrGroDialog: {
        type: null,
        show: false
    },//打开加入(好友、群组)类型
    //
    user: {
        _id: null,
        name: null,
        avatar: null
    },
    searchResultList: [], //搜索结果
    searchResultGroupsList: [], //搜索结果
    friendsList: [], //好友列表
    groupsList: [], //群组列表
    currentOne: null,     // 当前聊天对象
    messages: {},    // 消息记录
    activeMsgList: [], //当前回话列表
    counts: {},  // 消息对象
    noticeList: [], //notice列表
    isOpen: false,//weChat界面是否打开了
   
}
//state
export const state = stateData
//getters 计算属性
export const getters = {//getters方法有效的前提条件是必须在state中定义才行，如果用vue.set定义的，在改变的时候也需要用vue.set
    msgListNum: (state) => {
        let countsNum = 0
        for(let i in state.counts) {
            countsNum += state.counts[i]
        }
        return countsNum
    }
}

//mutations
export const mutations = {
    resetState: (state) => {//清空state
        state.user = { _id: null,name: null,avatar: null}
        state.counts = {}
        state.searchResultList = []
        state.searchResultGroupsList = []
        state.friendsList = []
        state.groupsList = []
        state.currentOne = null
        state.messages = {}
        state.activeMsgList = []
        state.noticeList = []
        state.isOpen = false
    },
    loginError: (state, data) => {
        state.user = {
            _id: null,
            name: null,
            avatar: null
        }
        alert(data.msg)
    },
    setOpen: (state, mask) => {//设置isOpen
        state.isOpen = mask
    },
    setLoginDialog: (state, dialog) => {//设置dialog
        state.loginDialog = dialog
    },
    setAddFriOrGroDialog: (state, dialog) => {//设置dialog
        state.searchResultList = []
        state.searchResultGroupsList = []
        state.addFriOrGroDialog = dialog
    },
    setUser: (state, value) => {//设置searchKey的值
        state.user = value
    },
    setSearchResult:(state, resultList) => {//设置搜索好友结果
        state.searchResultList = resultList
    },
    setSearchGroupsResult:(state, resultList) => {//设置搜索群组结果
        state.searchResultGroupsList = resultList
    },
    setFriendsList:(state, list) => {//设置好友列表
        state.friendsList = list
    },
    setGroupsList:(state, list) => {//设置群组列表
        state.groupsList = list
    },
    pushGroupsList:(state, item) => {//push群组列表
        state.groupsList.push(item)
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
    deleteGroupsList:(state, item) => {//删除好友列表
        for(let i in state.groupsList) {
            if(state.groupsList[i]._id === item._id) {
                state.groupsList.splice(i,1)
                return
            }
        } 
    },
    changeCurrentOne:(state, currentOne) => {//改变当前选中页
        state.currentOne = currentOne
        //state.counts[currentOne._id] = 0
        Vue.set(state.counts, currentOne._id, 0)//消除点击的消息数目
    },
    clearCurrentone: (state) => {
        //state.counts[state.currentOne._id] = 0
        Vue.set(state.counts, currentOne._id, 0)//消除点击的消息数目
        state.currentOne = null
    },
    pushMsg: (state, msg) => {//本地push信息
        if(state.messages[msg.msgId]) {
            state.messages[msg.msgId].push(msg)
        } else {
            Vue.set(state.messages, msg.msgId, [msg])
            if(msg.groupId) {//群组增加会话
                for(let i=0;i<state.groupsList.length;i++) {
                    if(state.groupsList[i]._id == msg.groupId) {
                        state.activeMsgList.push({
                            name: state.groupsList[i].name,
                            owner: state.groupsList[i].owner,
                            avatar: state.groupsList[i].avatar,
                            _id: msg.groupId
                        })//增加会话
                        return
                    }
                }
            }else {
               state.activeMsgList.push({
                    name: msg._id ? state.currentOne.name : msg.name,
                    avatar: msg.avatar,
                    _id: msg.msgId
                })//增加会话 
            }
            
        }
    },
    addCount: (state, _id) => {//增加count数目
        if(state.counts[_id]) {
            state.counts[_id] = parseInt(state.counts[_id])+1
            Vue.set(state.counts, _id, state.counts[_id])
        } else {//新建
            Vue.set(state.counts, _id, 1)
        }
    },
    addFriendOk: (state, from) => {//应答别人的添加好友请求
        state.noticeList.push(from)
    },
    delNoticeListItem: (state, item) => {//删除传来的消息
        for(let i in state.noticeList) {
            if(state.noticeList[i]._id === item._id) {
                state.noticeList.splice(i,1)
                return
            }
        }
    },
    delActiveMsgListItem: (state, item) => {//删除传来的消息
        state.messages[item._id] = null
        for(let i in state.activeMsgList) {
            if(state.activeMsgList[i]._id === item._id) {
                state.activeMsgList.splice(i,1)
                return
            }
        }
    }
}