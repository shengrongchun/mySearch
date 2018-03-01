<template>
    <div>
        <!--添加好友or群组-->
        <el-dialog size="tiny" :visible.sync="addFriOrGroDialog.show" @close="init">
            <el-tabs class="dialog" v-model="addFriOrGroDialog.type">
                <el-tab-pane label="添加好友" name="friends">
                    <el-input class="addInput" @change="searchFirends" placeholder="请输入好友名称 Enter搜索" v-model="addFriendsKey">
                        <i @click="searchFirends" slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <div class="searchList">
                        <el-checkbox-group v-model="checkedList">
                            <el-checkbox :disabled="item.have" class="addCheck" v-for="(item,key) in searchResultList" :label="item" :key="key">
                                <img class="addImg" :src="item.avatar"/>
                                <h4 class="addName">{{item.name}}</h4>
                                <span v-if="item.have">已添加</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="addBtn">
                        <el-button :disabled="!checkedList.length>0" type="success" @click="addFriends">加入{{checkedList.length>0?checkedList.length:null}}</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="添加群组" name="groups">
                    <el-input class="addInput" @change="searchGroups" placeholder="请输入群组名称 Enter搜索" v-model="addGroupsKey">
                        <i @click="searchGroups" slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <div class="searchList">
                        <el-checkbox-group v-model="checkedGroupsList">
                            <el-checkbox :disabled="item.have" class="addCheck" v-for="(item,key) in searchResultGroupsList" :label="item" :key="key">
                                <img class="addImg" :src="item.avatar"/>
                                <h4 class="addName">{{item.name}}</h4>
                                <span v-if="item.have">已添加</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <div class="addBtn">
                        <el-button :disabled="!checkedGroupsList.length>0" type="success" @click="addGroups">加入{{checkedGroupsList.length>0?checkedGroupsList.length:null}}</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="创建群组" name="createGroups">
                    <el-form :model="groupsForm" :rules="rules" ref="groupsForm" label-width="100px" class="demo-groupsForm" status-icon>
                        <el-form-item label="群组名称" prop="name">
                            <el-input v-model="groupsForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="头像" prop="avatar">
                            <div v-if="avatarSrc" class="avatar-image">
                               <img :src="avatarSrc"> 
                            </div>
                            <el-button id="pick-groups-avatar" size="small">选择头像</el-button>
                            <avatar-cropper
                              trigger="#pick-groups-avatar"
                              :upload-handler="updateUserAvatar"></avatar-cropper>
                        </el-form-item>
                        <el-form-item>
                        <el-button style="{float: right}" type="primary" @click="submitForm('groupsForm')">创建</el-button>
                        <el-button @click="resetForm('groupsForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
            
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapActions, mapMutations } from 'vuex'
    import AvatarCropper from '../avatar'
    export default {
        name: 'shChatDialog',
        components: { AvatarCropper },
        data() {
            return {
                addFriendsKey: null,
                addGroupsKey: null,
                checkedList: [],
                checkedGroupsList: [],
                avatarSrc: null,
                groupsForm: {
                    name: null,
                    avatar: null
                },
                rules: {
                    name: [
                        { required: true, message: '请输入群组名称', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ]
                },
            }
        },
        computed: {
            ...mapState(['searchResultList', 'searchResultGroupsList', 'addFriOrGroDialog'])
        },
        methods: {
            ...mapActions(['searchUsers', 'searchGroup', 'addFriend', 'addGroup', 'createGroup' ]),
            ...mapMutations(['setAddFriOrGroDialog']),
            init() {
                this.addFriendsKey = null
                this.addGroupsKey = null
                this.checkedList = []
                this.checkedGroupsList = []
                this.avatarSrc = null
                this.groupsForm = {
                    name: null,
                    avatar: null
                }
            },
            searchFirends() {
                if(!this.addFriendsKey) {return}
                this.searchUsers(this.addFriendsKey)
            },
            searchGroups() {
                if(!this.addGroupsKey) {return}
                this.searchGroup(this.addGroupsKey)
            },
            addFriends() {
                for(let i in this.checkedList) {
                    this.addFriend(this.checkedList[i])
                }
                this.init()
                this.setAddFriOrGroDialog({
                    type: null,
                    show: false
                })
            },
            addGroups() {
                for(let i in this.checkedGroupsList) {
                    this.addGroup(this.checkedGroupsList[i])
                }
                this.init()
                this.setAddFriOrGroDialog({
                    type: null,
                    show: false
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.createGroup(this.groupsForm)
                        this.setAddFriOrGroDialog({
                            type: null,
                            show: false
                        })
                        this.init()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            updateUserAvatar(cropper) {
                let result = cropper.getCroppedCanvas({
                    width: 100,
                    height: 80
                })
                let fileImg = result.toDataURL('image/jpg')
                this.avatarSrc = fileImg
                if(fileImg) {
                    this.groupsForm.avatar = fileImg
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .dialog {
        .addInput {
            .el-icon-search {
                cursor: pointer;
            }

            /deep/ .el-input__inner {
                border: 0;
            }
        }
        
        .addBtn {
            margin-top: 10px;
            text-align: right;
        }
        .searchList {

            .addCheck {
                display: block;
                margin: 0;
                padding: 7px 20px;
                border-bottom: 1px solid #f2f2f2;

                .addImg {
                    width: 40px;
                    height: 40px;
                    vertical-align: middle;
                    border-radius: 2px;
                    margin-right: 10px;
                }

                .addName {
                    display: inline-block;
                    vertical-align: top;
                    font-weight: 400;
                    font-size: 13px;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                }
            }
            
        }

        //创建群组
        .demo-groupsForm {
            .avatar-image {
                display: inline-block;
            }
            #pick-groups-avatar {
                vertical-align: text-bottom;
            }
        }
    }
    
</style>