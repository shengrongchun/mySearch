<template>
    <div class="sider-right">
        <div v-if="currentOne">
            <div class="right-header">
                <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    {{currentOne.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>查看用户</el-dropdown-item>
                    <el-dropdown-item command="delete">删除用户</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            </div>
            <div class="right-body" id="right-body">
                <div v-if="messageList&&messageList.length > 0">
                    <div class="message" :class="{'me': user._id === msg._id}" v-for="(msg, key) in messageList" 
                        :key="key">
                        <img :title="msg.name" class="avatar" :src="require('@/assets/img/tou.jpg')"/>
                        <div class="content">
                            <h4 v-if="user._id !== msg._id" class="nickname">{{msg.name}}</h4>
                            <div class="bubble" :class="{'right': user._id === msg._id,'left':user._id !== msg._id}">
                                <div class="bubble_cont">
                                    <pre v-html="msg.content"></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p v-else class="noMsg">暂时没有新消息</p>
            </div>
            <div class="right-footer">
                <div class="bar">
                    <div class="face" v-if="faceShow" v-clickoutside="hideFace">
                        <div class="faceImg">
                            <a @click="insertPic(item)" :title="item.title" :class="'qq '+item.class" v-for="(item,key) in faceList"
                                :style="{backgroundPositionX:item.x,backgroundPositionY:item.y}"
                            >{{item.title}}</a>
                        </div>
                    </div>
                    <span @click.stop="faceShow = true">
                        <i class="icon iconfont icon-emoji"></i>
                    </span>
                </div>
                <div class="submit">
                    <pre id="editArea" contenteditable="true" 
                    @keydown.enter.stop.prevent.exact="submitMsg"
                    @keydown.ctrl.enter.stop.exact="breakLine($event)"
                    ></pre>
                </div>
                <div class="action">
                    <span>按下Ctrl+Enter换行</span>
                    <el-button size="mini" @click.stop.prevent="submitMsg">发送</el-button>
                </div>
            </div> 
        </div>
        <div v-else></div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import clickoutside from '@/directive/outsideClick'
    export default {
        name: 'siderRight',
        data() {
            return {
                img: null,
                faceShow: false,
                faceList: [],
                faceTitleList: []
            }
        },
        computed: {
            ...mapState(['currentOne', 'messages', 'user']),
            messageList() {
                this.scrollTop()
                return this.messages[this.currentOne._id]
            },
            editDom() {
                return document.getElementById('editArea')
            }
        },
        methods: {
            ...mapActions(['pushMsg', 'deleteUser']),
            submitMsg() {
                let ctt = this.editDom.innerHTML
                if (!ctt || ctt.match(/^\s*$/)) return
                this.pushMsg(ctt)
                this.editDom.innerHTML = null
            },
            handleCommand(type) {
                if(type === 'delete') {//删除用户
                    this.deleteUser(this.currentOne)
                }
            },
            breakLine($e) {
                this.editDom.innerHTML = this.editDom.innerHTML + '<br></br>'
                this.placeCaretAtEnd(this.editDom)
                this.$nextTick(() => {
                    let txt = $e.target
                    txt.scrollTop = txt.scrollHeight
                })  
            },
            placeCaretAtEnd(el) {//换行，光标移动到左后
                el.focus()
                if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                    var range = document.createRange()
                    range.selectNodeContents(el)
                    range.collapse(false)
                    var sel = window.getSelection()
                    sel.removeAllRanges()
                    sel.addRange(range)
                }
                else if (typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange()
                    textRange.moveToElementText(el)
                    textRange.collapse(false)
                    textRange.select()
                }
            },
            insertPic(item) {
                this.img.style.backgroundPositionX = item.x
                this.img.style.backgroundPositionY = item.y
                this.editDom.appendChild(this.img.cloneNode(true))
            },
            scrollTop() {
                this.$nextTick(() => {//dom更新后
                    document.getElementById('right-body').scrollTop = document.getElementById('right-body').scrollHeight
                })
            },
            hideFace() {
                this.faceShow = false
            }
        },
        directives: {
            clickoutside
        },
        mounted() {
            this.img = document.createElement("img")
            this.img.width = 20
            this.img.height = 20
            this.img.src = require('@/assets/img/spacer.gif')
            this.img.setAttribute("class", "buImg")
            //
            this.faceTitleList = ['微笑','撇嘴','色','发呆','得意','流泪','害羞','闭嘴','睡','大哭','尴尬','发怒','调皮','呲牙','惊讶','难过','酷','冷汗','抓狂','吐','偷笑','愉快','白眼','傲慢','饥饿','困','惊恐','流汗','憨笑','悠闲','奋斗','咒骂','疑问','嘘','晕','疯了','衰','骷髅','敲打','再见','擦汗','抠鼻','鼓掌','糗大了','坏笑','左哼哼','右哼哼'
                ,'哈欠','鄙视','委屈','快哭了','阴险','亲亲','吓','可怜','菜刀','西瓜','啤酒','篮球','乒乓','咖啡','饭','猪头','玫瑰','凋谢','嘴唇','爱心','心碎','蛋糕','闪电','炸弹','刀','足球','瓢虫','便便','月亮','太阳','礼物','拥抱','强','弱','握手','胜利','抱拳','勾引','拳头','差劲','爱你','NO','OK','爱情','飞吻','跳跳','发抖','怄火','转圈','磕头','回头','跳绳','投降','激动','乱舞','献吻','左太极','右太极','嘿哈','捂脸','奸笑','机智','皱眉','耶','鸡','红包']
            for(let i =0;i<113;i++) {
                this.faceList.push({
                    title: this.faceTitleList[i],
                    class: 'face'+i,
                    x: -parseInt(i%15)*24+'px',
                    y: -parseInt(i/15)*24+'px'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sider-right {
        width: 100%;
        height: 100%;
        background: #eee;
        
        .right-header {
            text-align: center;
            position: relative;
            padding: 10px 0;
            margin: 0 19px;
            border-bottom: 1px solid #d6d6d6;
        }

        .right-body {
            position: relative;
            padding: 0 19px;
            height: 350px;
            margin-top: 10px;
            overflow-y: auto;
            
            .noMsg {
                text-align: center;
                color: #ccc;
                font-size: 14px;
                margin-top: 170px;
            }

            .message {
                margin-bottom: 15px;
                width: 100%;
                float: left;
                
                &.me {
                    float: right;
                    text-align: right;
                    clear: right;
                    .avatar {
                        float: right;
                    }
                }

                .avatar {
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    border-radius: 2px;
                    float: left;
                }

                .content {
                    overflow: hidden;
                    
                    .nickname {
                        font-weight: 400;
                        padding-left: 10px;
                        font-size: 12px;
                        height: 22px;
                        line-height: 24px;
                        color: #4f4f4f;
                        width: 350px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        word-wrap: normal;   
                    }

                    .bubble {
                        max-width: 350px;
                        min-height: 1em;
                        display: inline-block;
                        vertical-align: top;
                        position: relative;
                        text-align: left;
                        font-size: 14px;
                        border-radius: 3px;
                        margin: 0 10px;
                        
                        &.left {
                            background: #fff;
                        }

                        &.right {
                            background: #b2e281;
                        }

                        .bubble_cont {
                            padding: 8px 10px;
                            pre {
                                word-wrap: break-word;
                                white-space: pre-wrap; /*css-3*/ 
                                white-space: -moz-pre-wrap; /*Mozilla,since1999*/ 
                                white-space: -pre-wrap; /*Opera4-6*/ 
                                white-space: -o-pre-wrap; /*Opera7*/ 
                                word-wrap: break-word; /*InternetExplorer5.5+*/
                                font-family: "Microsoft YaHei";
                                
                                /deep/ .buImg {
                                    vertical-align: middle;
                                    background: url(../../assets/img/bubble.png) no-repeat;
                                }
                            }
                        }

                        &:before,&:after {
                            position: absolute;
                            top: 10px;
                            border: 6px solid transparent;
                            content: " ";
                        }

                        &.left:before,&.left:after {
                            right: 100%;
                            border-right-color: #fff;
                            border-right-width: 4px;
                        }

                        &.right:before,&.right:after {
                            left: 100%;
                            border-left-color: #b2e281;
                            border-left-width: 4px;
                        }
                    }
                    
                }
            }
        }

        .right-footer {
            margin: 0 19px;
            border-top: 1px solid #d6d6d6;
            
            .bar {
                height: 30px;
                position: relative;
                
                .icon {
                    font-size: 30px;
                    color: #bbb;
                    cursor: pointer;
                }

                .face {
                    width: 370px;
                    height: 210px;
                    background: #fff;
                    position: absolute;
                    left: 0;
                    top: -215px;
                    border-radius: 4px;
                    padding: 12px;
                    box-sizing: border-box;
                    
                    &:after {
                        position: absolute;
                        top: 100%;
                        left: 5px;
                        border: 6px solid transparent;
                        content: " ";
                        border-top-color: #fff;
                    }

                    .faceImg {
                        width: 100%;
                        height: 100%;
                        
                        .qq {
                            float: left;
                            text-indent: -999em;
                            width: 22px;
                            height: 22px;
                            cursor: pointer;
                            border-bottom: 1px solid #f0f0f0;
                            border-right: 1px solid #f0f0f0;
                            background: url(../../assets/img/bubble.png) no-repeat;
                        }
                    }
                }
            }

            .submit  {
                #editArea {
                    outline: none;
                    height: 80px;
                    width: 100%;
                    word-wrap: break-word;
                    white-space: pre-wrap; /*css-3*/ 
                    white-space: -moz-pre-wrap; /*Mozilla,since1999*/ 
                    white-space: -pre-wrap; /*Opera4-6*/ 
                    white-space: -o-pre-wrap; /*Opera7*/ 
                    word-wrap: break-word; /*InternetExplorer5.5+*/
                    font-family: "Microsoft YaHei";
                    overflow: auto;
                    // /deep/是>>>的别名。让sass预编译可以识别,>>>可以让scoped作用于子组件
                    
                    /deep/ .buImg {
                        vertical-align: middle;
                        background: url(../../assets/img/bubble.png) no-repeat;
                    }
                }
            }

            .action {
                text-align: right;
                
                span {
                    color: #888;
                    font-size: 12px;
                }
            }
        }
    }
</style>