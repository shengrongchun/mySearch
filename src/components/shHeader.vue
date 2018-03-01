<template>
    <div>
        <div id="header" :class="{'down': scrollTop!==0}">
            <div class="shHeader">
                <a class="shImg">
                    <!-- <img src="../assets/logo.png" alt="到百度首页" title="到百度首页">
                     -->
                </a>
                <div class="shSearch">
                    <el-autocomplete  suffix-icon="el-icon-search" class="inline-block" placeholder="请输入搜索内容" v-model="searchModel" size="medium" :trigger-on-focus="false"
                    @keyup.enter.native="search" :fetch-suggestions="querySearch"
                    >
                        <el-button slot="append" @click="search">搜索一下</el-button>
                    </el-autocomplete>
                </div>
                <sh-login></sh-login>
            </div>
        </div>
        <sh-login-dialog></sh-login-dialog>
        <sh-chat-dialog></sh-chat-dialog>
    </div>
</template>

<script>
import shLogin from './login'
import shLoginDialog from './login/dialog'
import shChatDialog from './chat/dialog'

export default {
    name: 'shHeader',
    data() {
        return {
            scrollTop: 0
        }
    },
    props: {
        value: [String]
    },
    computed: {
        searchModel: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit('input', value)
            }
        }
    },
    methods: {
        search() {
            if(!this.value) {return}
            this.$emit('click')
        },
        querySearch(queryString, cb) {
            cb([])
        },
        handleScroll() {
            this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        },
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll)
    },
    components: {
        shLogin,
        shLoginDialog,
        shChatDialog
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    #header {
        z-index: 99;
        height: 55px;
        width: 100%;
        position: fixed;
        background: #fff;
        top: 0;
        left: 0;
        border-bottom: 1px solid #ebebeb;
        &.down {
            box-shadow: 0 0 5px #888;
        }

        .shHeader {
            zoom: 1;
            padding: 0 0 0 10px;
            line-height: 55px;
            background: #fff;
            
            .shImg {
                float: left;
                margin: 7px 0 0;
                img {
                    width: 101px;
                    height: 50px;
                }
            }

            .shSearch {
                margin-left: 150px; 
                display: inline-block;
                .el-autocomplete {
                    width: 600px;
                }
            }

        }
    }
</style>
