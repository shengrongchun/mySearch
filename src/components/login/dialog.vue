<template>
    <div>
        <!--登录弹框-->
        <el-dialog v-loading="loading" :title="dialog.type == 'login'?'登录':'注册'" :visible.sync="dialog.centerDialogVisible" width="35%" center @close="dialog.centerDialogVisible = false">
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm" status-icon>
                <el-form-item v-if="dialog.type == 'sign'" label="用户名称" prop="name">
                    <el-input v-model="loginForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="loginForm.email" type="email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="dialog.type == 'sign'" label="确认密码" prop="pwdAgain">
                    <el-input v-model="loginForm.pwdAgain" type="password" auto-complete="off"></el-input>
                </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('loginForm')">{{dialog.type == 'login'?'登录':'注册'}}</el-button>
                <el-button @click="resetForm('loginForm')">重置</el-button>
              </el-form-item>
            </el-form>
            <span v-if="showTips">
                <el-alert v-if="tips.type == 'ok'" :title="tips.msg" type="success" center show-icon></el-alert>
                <el-alert v-else :title="tips.msg" type="error" center show-icon :closable="false"></el-alert>
            </span>
        </el-dialog>
        <!--登录弹框-->
        <el-dialog title="加好友" :visible.sync="noticeAddFriend.confirmAddFriend" width="30%">
            <span>{{noticeAddFriend.name}} 请求添加好友</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFriendOk(false)">不同意</el-button>
                <el-button @click="addFriendOk(true)"type="primary">同 意</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapActions, mapMutations } from 'vuex'
    export default {
        name: 'shDialog',
        data() {
            var validatePass = (rule, value, callback) => {
                if (this.dialog.type == 'login' || !this.loginForm.pwdAgain) {
                    return callback()
                }
                if (value !== this.loginForm.pwdAgain) {
                    this.$refs.loginForm.validateField('pwdAgain')
                } 
                callback()
            }
            var validatePass2 = (rule, value, callback) => {
                if (!this.loginForm.password) {
                    return callback()
                }
                if (value !== this.loginForm.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                loading: false,
                showTips: false,
                tips: {
                    type: null,
                    msg: null
                },
                loginForm: {
                    name: null,
                    email: '1010449768@qq.com',
                    password: 'sheng123',
                    pwdAgain: null
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' },
                        { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                    ],
                    pwdAgain: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { validator: validatePass2, trigger: 'blur' },
                        { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        computed: {
            ...mapState(['dialog', 'noticeAddFriend']),
        },
        methods: {
            ...mapMutations([
                'setUser'
            ]),
            ...mapActions([
                'loginSuccess',
                'addFriendOk'
            ]),
            clearData() {//暂时没用着
                this.showTips = false
                this.loginForm.name = null
                this.loginForm.password = null
                this.loginForm.pwdAgain = null
                this.loginForm.email = null
            },
            submitForm(formName) {
                this.showTips = false
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dialog.type == 'login') {
                            this.loading = true
                            this.$http.post('/login', {email: this.loginForm.email,
                                password: this.loginForm.password}).then((res)=> {
                                this.setUser(res.data)
                                this.tips = {type: 'ok', msg: res.data.msg}
                                this.dialog.centerDialogVisible = false
                                //socket链接
                                this.loginSuccess(res.data)
                            },(res)=> {
                                this.tips = {type: 'error', msg: res.data}
                            }).finally(() => {
                                this.loading = false
                                this.showTips = true
                            })
                        } else {
                            this.loading = true
                            this.$http.post('/sign', this.loginForm).then((res)=> {
                                this.setUser(res.data)
                                this.tips = {type: 'ok', msg: res.data.msg}
                                this.dialog.centerDialogVisible = false
                                //socket链接
                                this.loginSuccess(res.data)
                            },(res)=> {
                                this.tips = {type: 'error', msg: res.data}
                            }).finally(() => {
                                this.loading = false
                                this.showTips = true
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>

<style lang="scss" scoped>
    
</style>