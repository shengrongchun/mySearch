<template>
    <div id="shLogin">
        <div v-if="user.name">
            <el-badge :value="countNum" :max="99" class="item">
                <i class="el-icon-message"></i>
            </el-badge>
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item>我的博客</el-dropdown-item>
                    <el-dropdown-item>我的动态</el-dropdown-item>
                    <el-dropdown-item command="exit" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="user" v-else>
            <el-button type="text" @click="login('login')">登录</el-button>
            <el-button type="text" @click="login('sign')">注册</el-button>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
    name: 'shLogin',
    data() {
        return {
        }
    },
    computed: {
        ...mapState(['user', 'countNum'])
    },
    methods: {
        ...mapMutations(['setDialog']),
        ...mapActions(['logout']),
        handleCommand(command) {
            if(command == 'exit') {
                this.logout()
            }
        },
        login(type) {
            this.setDialog({
                type: type,
                centerDialogVisible: true
            })
            //this.$emit('clear')
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
    }
</style>
