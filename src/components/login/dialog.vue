<template>
    <div>
        <!--登录弹框-->
        <el-dialog v-if="loginDialog.type !='edit'" v-loading="loading" :title="loginDialog.type == 'login'?'登录':'注册'" :visible.sync="loginDialog.centerDialogVisible" width="35%" center @close="clearData">
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm" status-icon>
                <el-form-item v-if="loginDialog.type == 'sign'" label="用户名称" prop="name">
                    <el-input v-model="loginForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="loginForm.email" type="email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar" v-if="loginDialog.type == 'sign'">
                    <div v-if="avatarSrc" class="avatar-image">
                       <img :src="avatarSrc"> 
                    </div>
                    <el-button id="pick-avatar" size="small">选择头像</el-button>
                    <avatar-cropper
                      trigger="#pick-avatar"
                      :upload-handler="updateUserAvatar"></avatar-cropper>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="loginDialog.type == 'sign'" label="确认密码" prop="pwdAgain">
                    <el-input v-model="loginForm.pwdAgain" type="password" auto-complete="off"></el-input>
                </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('loginForm')">{{loginDialog.type == 'login'?'登录':'注册'}}</el-button>
                <el-button @click="resetForm('loginForm')">重置</el-button>
              </el-form-item>
            </el-form>
            <span v-if="showTips">
                <!-- <el-alert v-if="tips.type == 'ok'" :title="tips.msg" type="success" center show-icon></el-alert> -->
                <el-alert v-if="tips.type == 'error'" :title="tips.msg" type="error" center show-icon :closable="false"></el-alert>
            </span>
        </el-dialog>

        <el-dialog v-if="loginDialog.type =='edit'" v-loading="loading" title="修改信息" :visible.sync="loginDialog.centerDialogVisible" width="35%" center @close="clearData">
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm" status-icon>
                <el-form-item label="用户名称" prop="name">
                    <el-input v-model="loginForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <div v-if="avatarSrc" class="avatar-image">
                       <img :src="avatarSrc"> 
                    </div>
                    <el-button id="pick-avatar" size="small">选择头像</el-button>
                    <avatar-cropper
                      trigger="#pick-avatar"
                      :upload-handler="updateUserAvatar"></avatar-cropper>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="pwdAgain">
                    <el-input v-model="loginForm.pwdAgain" type="password" auto-complete="off"></el-input>
                </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="editForm('loginForm')">修改</el-button>
                <el-button @click="resetForm('loginForm')">重置</el-button>
              </el-form-item>
            </el-form>
            <span v-if="showTips">
                <!-- <el-alert v-if="tips.type == 'ok'" :title="tips.msg" type="success" center show-icon></el-alert> -->
                <el-alert v-if="tips.type == 'error'" :title="tips.msg" type="error" center show-icon :closable="false"></el-alert>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapActions, mapMutations } from 'vuex'
    import AvatarCropper from '../avatar'
    export default {
        name: 'shDialog',
        components: { AvatarCropper },
        watch: {
            loginDialog(newV, oldV) {
                if(newV.type == 'edit') {
                    this.loginForm.name = this.user.name
                    this.loginForm.avatar = this.user.avatar
                    this.avatarSrc = this.user.avatar
                }
            }
        },
        data() {
            var validatePass = (rule, value, callback) => {
                if (this.loginDialog.type == 'login' || !this.loginForm.pwdAgain) {
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
                avatarSrc: undefined,
                tips: {
                    type: null,
                    msg: null
                },
                loginForm: {
                    name: null,
                    avatar: null,
                    email: null,
                    password: null,
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
            ...mapState(['loginDialog', 'user']),
        },
        methods: {
            ...mapMutations([
                'setUser'
            ]),
            ...mapActions([
                'loginSuccess',
                'updateUser'
            ]),
            clearData() {//暂时没用着
                this.showTips = false
                this.loginForm.name = null
                this.loginForm.password = null
                this.loginForm.pwdAgain = null
                this.loginForm.email = null
                this.loginForm.avatar = null
                this.loginDialog.centerDialogVisible = false
            },
            submitForm(formName) {
                this.showTips = false
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.loginDialog.type == 'login') {
                            this.loading = true
                            this.$http.post('/login', {email: this.loginForm.email,
                                password: this.loginForm.password}).then((res)=> {
                                this.setUser(res.data)
                                this.tips = {type: 'ok', msg: res.data.msg}
                                this.loginDialog.centerDialogVisible = false
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
                                this.loginDialog.centerDialogVisible = false
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
            editForm(formName) {
                this.showTips = false
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.updateUser(this.loginForm)
                        .then((result)=> {
                            this.tips = {type: 'ok', msg: result.ok}
                            this.showTips = true
                            this.loading = false
                            this.loginDialog.centerDialogVisible = false
                        }, (error) => {
                            this.tips = {type: 'error', msg: error}
                            this.showTips = true
                            this.loading = false
                        })
                    } else {
                        console.log('error edit!!');
                        return false;
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            updateUserAvatar(cropper) {
                let result = cropper.getCroppedCanvas({
                    width: 100,
                    height: 80
                })
                let fileImg = result.toDataURL('image/jpg')
                this.avatarSrc = fileImg
                if(fileImg) {
                    this.loginForm.avatar = fileImg
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .demo-loginForm {
        .avatar-image {
            vertical-align: bottom;
            display: inline-block;
        }
    }
</style>