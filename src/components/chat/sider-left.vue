<template>
    <div class="sider-left">
        <header class="left-header">
            <div class="avatar">
                <img :src="require('@/assets/img/tou.jpg')"/>
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
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </header>
        <div class="left-search">
            <el-autocomplete prefix-icon="el-icon-search" class="input inline-block" placeholder="搜索" v-model="searchValue" size="small" :trigger-on-focus="false"
                    @keyup.enter.native="search" :fetch-suggestions="search"
                    >
            </el-autocomplete>
        </div>
        <div class="left-body">
            <div class="tabs">
                <ul>
                    <li @click="type='info'">
                        <el-badge :value="countNum" :max="99" class="item">
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
                        <el-badge :value="0" :max="99" class="item">
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
                            <img :src="require('@/assets/img/tou.jpg')"/>
                            <el-badge :value="counts[item._id]" :max="99" class="badge">
                                <span>{{item.name}}</span>
                            </el-badge>
                        </el-menu-item>
                    </el-menu>
                </div>
                <div v-if="type=='friends'">
                    <el-menu class="left-menu"
                        background-color="#2e3238"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                        <el-menu-item-group>
                            <template slot="title">群组</template>
                            <el-menu-item index="1-1">
                                <img :src="require('@/assets/img/tou.jpg')"/>
                                <span>选项1</span>
                            </el-menu-item>
                            <el-menu-item index="1-2">
                                <!-- <img :src="require('@/assets/img/tou.jpg')"/> -->
                                <img :src="require('@/assets/img/temp.png')"/>
                                <span>选项2</span>
                            </el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="好友">
                            <el-menu-item @click="changeActiveOne(friend)" v-for="(friend, key) in friendsList" :key="key" :index="key+''">
                                <img :src="require('@/assets/img/tou.jpg')"/>
                                <span>{{friend.name}}</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-menu>
                </div>
                <div v-if="type=='notice'">
                    <el-menu class="left-menu"
                            background-color="#2e3238"
                            text-color="#fff"
                            active-text-color="#ffd04b">
                        <el-menu-item @click="changeActiveOne(item)" :key="key" :index="key+''" v-for="(item,key) in activeMsgList">
                            <el-badge :value="counts[item._id]" :max="99" class="badge">
                                <img :src="require('@/assets/img/tou.jpg')"/>
                                <span>{{item.name}}</span>
                            </el-badge>
                        </el-menu-item>
                    </el-menu>
                </div>
            </div>
        </div>







        <!--添加好友-->
        <el-dialog size="tiny" class="text-center" :visible.sync="dialog.friends" title="添加好友" >
            <el-input placeholder="请输入好友名称" v-model="addFriendsKey">
            </el-input><el-button v-if="addFriendsKey" @click="searchFirends">搜索</el-button>

            <ul class="search-result" v-if="searchResultList.length > 0">
                <li v-for="item in searchResultList">
                    <span>{{item.name}}</span>
                    <el-button @click="addFriends(item)">加入</el-button>
                </li>
            </ul>
            <p v-else>未搜索到结果</p>
        </el-dialog>
        <!--添加群组-->
        <el-dialog size="tiny" class="text-center" :visible.sync="dialog.groups" title="添加群组" >
            
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    export default {
        name: 'siderLeft',
        data() {
            return {
                searchValue: null,
                type: 'friends',
                dialog: {
                    friends: false,
                    groups: false
                },
                addFriendsKey: null
            }
        },
        computed: {
            ...mapState(['user', 'searchResultList', 'friendsList', 'currentOne', 'activeMsgList', 'counts', 'countNum']),
        },
        methods: {
            ...mapActions(['searchUsers', 'addFriend', 'changeCurrentOne']),
            search() {

            },
            tabsClick() {

            },
            showDialog(type) {
                this.dialog[type] = true
            },
            searchFirends() {
                this.searchUsers(this.addFriendsKey)
            },
            addFriends(item) {
                this.addFriend(item)
                this.dialog.friends = false
            },
            changeActiveOne(item) {
                let cur = this.currentOne
                if (cur && cur._id === item._id) return
                this.changeCurrentOne(item)
            }

        }
    }
</script>

<style lang="scss" scoped>
    .sider-left {
        width: 100%;
        height: 100%;
        background: #2e3238;
        
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
                    }
                }
            }
        }
    }
</style>