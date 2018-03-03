<template>
    <div id="shLogin">
        <div v-if="user.name">
            <el-badge :value="num" :max="99" class="item">
                <i @click="showChat" class="el-icon-message"></i>
            </el-badge>
            <img :src="user.avatar" width="30" style="verticalAlign: middle;borderRadius:3px;">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="edit">修改信息</el-dropdown-item>
                    <el-dropdown-item command="del">注销</el-dropdown-item>
                    <el-dropdown-item command="exit" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="user" v-else>
            <el-button type="text" @click="login('login')">登录</el-button>
            <el-button type="text" @click="login('sign')">注册</el-button>
        </div>
        <div id="weChat" :class="{open: isOpen}">
            <span @click="showChat" class="close">&times;</span>
           <we-chat></we-chat> 
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import weChat from '../chat/weChat'
export default {
    name: 'shLogin',
    data() {
        return {
        }
    },
    components: {
        weChat
    },
    computed: {
        ...mapState(['user', 'noticeList', 'isOpen']),
        ...mapGetters(['msgListNum']),
        num() {
            return this.noticeList.length + this.msgListNum
        }
    },
    methods: {
        ...mapMutations(['setLoginDialog', 'setOpen']),
        ...mapActions(['delMyself']),
        handleCommand(command) {
            if(command == 'exit') {
                window.location.reload()
            } else if(command == 'edit') {
                this.login('edit')
            } else if(command == 'del') {
                this.$confirm('此操作将会注销用户，确定注销吗？')
                    .then(() => {
                        this.delMyself()
                    }).catch(() => {})
            }
        },
        showChat() {
            this.setOpen(!this.isOpen)
        },
        login(type) {
            this.setLoginDialog({
                type: type,
                centerDialogVisible: true
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    #shLogin {
        margin-right: 15px;
        float: right;
        
        .el-dropdown-link {
            cursor: pointer;
        }

        .user .el-button {
            color: #333;
        }

        .item {
            line-height: 25px;
            margin-right: 20px;
            font-size: 23px;
            cursor: pointer;
        }

        #weChat {
            width: 600px;
            height: 550px;
            position: fixed;
            top: 56px;
            right: -600px;
            transition: right 0.5s;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
            &.open {
                right: 10px;
            }

            .close {
                position: absolute;
                right: 5px;
                top: 5px;
                z-index: 1;
                line-height: 1;
                font-size: 20px;
                cursor: pointer;
            }
        }
    }
</style>
