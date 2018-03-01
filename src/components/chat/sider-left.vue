<template>
    <div class="sider-left">
        <header class="left-header">
            <div class="avatar">
                <img :src="user.avatar"/>
            </div>
            <div class="info">
                <span class="display-name">{{user.name}}</span>
                <div class="add">
                    <el-dropdown class="dropdown" trigger="click" @command="showDialog">
                        <span class="el-dropdown-link">
                            <i class="icon iconfont icon-other"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="friends">加好友</el-dropdown-item>
                            <el-dropdown-item command="groups">加群组</el-dropdown-item>
                            <el-dropdown-item command="createGroups">创建群组</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </header>
        <div class="left-search">
            <el-autocomplete prefix-icon="el-icon-search" class="input inline-block" placeholder="搜索"
            v-model="searchValue" size="small" :trigger-on-focus="false"
            popper-class="search-chat-item"
            :fetch-suggestions="search"
            @select="handleSelect"
            >
                <template slot-scope="props">
                    <img width="30" class="avatar" :src="props.item.avatar"/>
                    <span class="name">{{ props.item.name }}</span>
                </template>
            </el-autocomplete>
        </div>
        <div class="left-body">
            <div class="tabs">
                <ul>
                    <li @click="type='info'">
                        <el-badge :value="msgListNum" :max="99" class="item">
                            <i v-if="type == 'info'" class="icon iconfont icon-interactive_fill active"></i>
                            <i v-else class="icon iconfont icon-interactive"></i>
                        </el-badge>
                    </li>
                    <li @click="type='friends'">
                        <el-badge :value="0" :max="99" class="item">
                            <i v-if="type=='friends'" class="icon iconfont icon-addressbook_fill active"></i>
                            <i v-else class="icon iconfont icon-addressbook"></i>
                        </el-badge>
                    </li>
                    <li @click="type='notice'">
                        <el-badge :value="noticeList.length" :max="99" class="item">
                            <i v-if="type == 'notice'" class="icon iconfont icon-remind_fill active"></i>
                            <i v-else class="icon iconfont icon-remind"></i>
                        </el-badge>
                    </li>
                </ul>
            </div>
            <div class="tabs-panel">
                <div v-if="type=='info'">
                    <el-menu class="left-menu"
                            background-color="#2e3238"
                            text-color="#fff"
                            active-text-color="#ffd04b">
                        <el-menu-item @click="changeActiveOne(item)" :key="key" :index="key+''" v-for="(item,key) in activeMsgList">
                            <div @contextmenu="showMenu($event, key, contextMenuInfoData)">
                                <img :src="item.avatar"/>
                                <el-badge :value="counts[item._id]" :max="99" class="badge">
                                    <span>{{item.name}}</span>
                                </el-badge>
                            </div>
                            <vue-context-menu :contextMenuData="contextMenuInfoData"
                                :transferIndex="transferIndex"
                                @delInfo="delInfo(item)"
                                class="customMenu"
                            ></vue-context-menu>
                        </el-menu-item>
                    </el-menu>
                </div>
                <div v-if="type=='friends'">
                    <el-menu class="left-menu"
                        background-color="#2e3238"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                        <el-menu-item-group title="群组" v-if="groupsList.length>0">
                            <el-menu-item @click="changeActiveOne(group)" v-for="(group, key) in groupsList" :key="key" :index="key+''"
                                >
                                <div @contextmenu="showMenu($event, key, contextMenuGroData)">
                                    <img :src="group.avatar"/>
                                    <span>{{group.name}}</span>
                                </div>

                                <vue-context-menu :contextMenuData="contextMenuGroData"
                                        :transferIndex="transferIndex"
                                        @removeGroup="removeGroup(group)"
                                        class="customMenu"
                                ></vue-context-menu>
                            </el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="好友">
                            <el-menu-item @click="changeActiveOne(friend)" v-for="(friend, key) in friendsList" :key="key" :index="key+''"
                                >
                                <div @contextmenu="showMenu($event, key, contextMenuFriData)">
                                    <img :src="friend.avatar"/>
                                    <span>{{friend.name}}</span>
                                </div>

                                <vue-context-menu :contextMenuData="contextMenuFriData"
                                        :transferIndex="transferIndex"
                                        @delFriend="delFriend(friend)"
                                        class="customMenu"
                                ></vue-context-menu>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-menu>
                </div>
                <div v-if="type=='notice'">
                    <el-menu class="left-menu"
                            background-color="#2e3238"
                            text-color="#fff"
                            active-text-color="#ffd04b">
                        <el-menu-item v-for="(item,key) in noticeList" :index="key+''" :key="key" class="noticeAddfri">
                            <div @contextmenu="showMenu($event, key, contextMenuNoticeData)">
                                <el-badge :value="1" :max="99" class="badge">
                                    <img :src="item.avatar"/>
                                    <span>{{item.name}}</span>
                                </el-badge>
                                <p v-if="item.type == 'resolve'">同意添加好友</p>
                                <p v-if="item.type == 'reject'">拒绝添加好友</p>
                                <p v-if="item.type == 'add'">请求添加好友</p>
                                <div v-if="item.type == 'add'">
                                    <el-button size="mini" @click="addError(item)">不同意</el-button>
                                    <el-button type="success" size="mini" @click="addOk(item)">同意</el-button>
                                </div>
                            </div>
                            <vue-context-menu :contextMenuData="contextMenuNoticeData"
                                :transferIndex="transferIndex"
                                @delNotice="delNotice(item)"
                                class="customMenu"
                            ></vue-context-menu>
                        </el-menu-item>
                    </el-menu>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
    export default {
        name: 'siderLeft',
        data() {
            return {
                searchValue: null,
                type: 'friends',
                transferIndex: null, // Show the menu that was clicked
                contextMenuFriData: {
                    menuName: 'friends',
                    axios: {
                        x: null,
                        y: null
                    },
                    menulists: [
                        {
                            fnHandler: 'delFriend',
                            btnName: '删除好友'
                        }                  
                    ]
                },
                contextMenuGroData: {
                    menuName: 'groups',
                    axios: {
                        x: null,
                        y: null
                    },
                    menulists: [
                        {
                            fnHandler: 'removeGroup',
                            btnName: '退出群组'
                        }                 
                    ]
                },
                contextMenuNoticeData: {
                    menuName: 'notice',
                    axios: {
                        x: null,
                        y: null
                    },
                    menulists: [
                        {
                            fnHandler: 'delNotice',
                            btnName: '删除消息'
                        }                  
                    ]
                },
                contextMenuInfoData: {
                    menuName: 'info',
                    axios: {
                        x: null,
                        y: null
                    },
                    menulists: [
                        {
                            fnHandler: 'delInfo',
                            btnName: '删除会话'
                        }                  
                    ]
                },
            }
        },
        computed: {
            ...mapState(['user', 'friendsList', 'groupsList', 'currentOne', 'activeMsgList', 'counts', 'noticeList']),
            ...mapGetters(['msgListNum']),
            chatSearchList() {
                return this.friendsList.concat(this.groupsList)
            }
        },
        methods: {
            ...mapActions(['changeCurrentOne', 'addFriendOk', 'deleteUser', 'deleteGroup']),
            ...mapMutations(['setAddFriOrGroDialog', 'delNoticeListItem', 'delActiveMsgListItem', 'clearCurrentone']),
            showMenu(event, index, contextMenuData) {
                this.transferIndex = index // tranfer index to child component
                event.preventDefault()
                var x = event.clientX
                var y = event.clientY
                contextMenuData.axios = {
                  x, y
                }
            },
            delFriend(data) {
                this.$confirm('确定删除好友吗？')
                    .then(() => {
                        this.deleteUser(data)
                        this.delActiveMsgListItem(data)//如果有会话也一起删除
                    }).catch(() => {})
            },
            removeGroup(data) {
                // if(data.owner == this.user._id) {
                //     alert('你是群主，你不能退出群组')
                //     return
                // }
                this.$confirm('确定退出群组吗？')
                    .then(() => {
                        this.deleteGroup(data)
                        this.delActiveMsgListItem(data)//如果有会话也一起删除
                    }).catch(() => {})
            },
            delNotice(data) {
                this.$confirm('确定删除消息吗？')
                    .then(() => {
                        this.delNoticeListItem(data)
                        if(data.type == 'add') {//说明删除的是添加消息，默认就是拒绝
                            this.addError(data)
                        }
                    }).catch(() => {})
            },
            delInfo(data) {
                this.$confirm('确定删除会话吗？')
                    .then(() => {
                        this.delActiveMsgListItem(data)
                        if(this.currentOne._id == data._id) {
                            this.clearCurrentone()
                        }
                    }).catch(() => {})
            },
            search(queryString, cb) {
                let results = queryString ? this.chatSearchList.filter(this.createFilter(queryString)) : this.chatSearchList
                // 调用 callback 返回建议列表的数据
                cb(results)
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                }
            },
            handleSelect(item) {
                this.changeCurrentOne(item)
            },
            showDialog(type) {
                this.setAddFriOrGroDialog({
                    type: type,
                    show: true
                })
            },
            changeActiveOne(item) {
                let cur = this.currentOne
                if (cur && cur._id === item._id) return
                this.changeCurrentOne(item)
            },
            addOk(item) {
                this.addFriendOk({
                    mask: true,
                    data: item
                })
            },
            addError(item) {
                this.addFriendOk({
                    mask: false,
                    data: item
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sider-left {
        width: 100%;
        height: 100%;
        background: #2e3238;
        line-height: 1;
        
        .left-header {
            padding: 15px;
            position: relative;
            
            .avatar {
                display: table-cell;
                vertical-align: middle;
                word-wrap: break-word;
                word-break: break-all;
                white-space: nowrap;
                padding-right: 10px;
                
                img {
                    width: 40px;
                    height: 40px;
                    display: block;
                    border-radius: 2px;
                    -moz-border-radius: 2px;
                    -webkit-border-radius: 2px;
                }
            }

            .info {
                display: table-cell;
                vertical-align: middle;
                word-wrap: break-word;
                word-break: break-all;
                
                .display-name {
                    display: inline-block;
                    font-weight: 400;
                    width: 84px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                    color: #fff;
                    font-size: 18px;
                }

                .add {
                    display: inline-block;
                    vertical-align: top;
                    .dropdown {
                        .icon-other {
                            font-size: 30px;
                        }
                        cursor: pointer;
                    }
                }
            }
        }

        .left-search {
            padding: 10px 15px;
            & .input {
                /deep/ .el-input__inner {
                    border: none;
                    border-radius: 0;
                    background: #26292e;
                } 
            }
        }

        .left-body {
            .tabs {
                margin-top: 5px;
                ul {
                    list-style: none;
                    margin: 0 10px;
                    li {
                        cursor: pointer;
                        display: inline-block;
                        color: #909399;
                        i {font-size: 30px;}
                        &:not(:last-child) {
                            margin-right: calc(50% - 50px);
                        }

                        .item {
                            line-height: 0.7;
                        }
                        .active {
                            color: #3CAF36;
                        }
                    }
                }
            }

            .tabs-panel {
                margin: 8px 0 0 0;
                padding: 0;
                .left-menu {
                    border: none;
                    
                    .el-menu-item-group__title {
                        background: #26292e;
                    }

                    .el-menu-item {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        border-bottom: 1px solid #26292e;
                        img {
                            width: 30px;
                            height: 30px;
                            margin-right: 10px;
                            border-radius: 2px;
                        }

                        .badge {
                            line-height: 1;
                            span {
                                margin-right: 5px;
                            }
                        }

                        &.noticeAddfri {
                            height: auto;
                        }

                        /deep/ .customMenu {
                            box-shadow: rgba(0,0,0,.1) 2px 3px 10px;
                            border-radius: 4px;
                            border: 1px solid #eee;
                            min-width: 125px;
                            .context-menu-list {
                               width: auto;
                               height: auto;
                               border-bottom: 1px solid #f1f1f1; 
                               border-radius: none;
                            }

                            .context-menu-list button {
                                background: #fff;
                                padding: 8px;
                                font-size: 14px;
                                &:hover {
                                    background: #f0f0f0;
                                    color: #000;
                                    border-radius: 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>