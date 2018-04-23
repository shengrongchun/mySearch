<template>
    <div>
        <sh-header v-model="searchValue" @click="queryClick"></sh-header>
        <div id="body" class="clearfix">
            <div class="gap"></div>
            <div class="bodyQuery"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255, 0.6)">
                <el-tabs v-model="type" @tab-click="tabsClick">
                    <el-tab-pane name="baidu">
                        <span slot="label">百度</span>
                        <div v-html="baidu"></div>
                    </el-tab-pane>
                    <el-tab-pane name="biyin">
                        <span slot="label">必应</span>
                        <el-radio-group v-model="biyinType" size="small" @change="biyinClick">
                            <el-radio-button label="in">国内版</el-radio-button>
                            <el-radio-button label="out">国际版</el-radio-button>
                        </el-radio-group>
                        <div v-html="biyin"></div>
                    </el-tab-pane>
                    <el-tab-pane name="sogou">
                        <span slot="label">搜狗</span>
                        <div v-html="sogou"></div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="bodynews">
                <el-carousel :interval="5000">
                    <el-carousel-item v-for="(item,key) in 11" :key="key">
                        <img :src="require('@/assets/img/'+item+'.jpg')"/>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
    </div>
</template>

<script>
    import shHeader from './shHeader'
    import { mapActions } from 'vuex'
    export default {
        name: 'shBody',
        data() {
            return {
                baidu: null,
                biyin: null,
                sogou: null,

                type: 'baidu',
                searchValue: null,
                loading: false,
                biyinType: 'in',
                hostname: window.location.host,
            }
        },
        methods: {
            ...mapActions(['logout']),
            tabsClick(data) {
                if(this.loading||this[data.name]||!this.searchValue) {return}
                this.queryClick()   
            },
            biyinClick() {
                if(!this.searchValue) {return}
                this.queryClick()
            },
            queryClick(searchValue) {
                this.loading = true
                this.$http.post('/query',{
                    key: searchValue?searchValue:encodeURI(this.searchValue),
                    type: this.type,
                    link: searchValue?true:false,//是否为页面链接
                    biyinType: this.biyinType
                }).then((res)=> {
                    this[res.data.type] = res.data.data
                    this.searchValue = decodeURI(res.data.returnKey)
                    if(window.pageYOffset) {window.pageYOffset = 0}
                    document.documentElement.scrollTop = 0
                    document.body.scrollTop = 0
                    this.loading = false
                    

                },(res)=> {
                    this[res.data.type] = '<div style="text-align:center;">请求出错啦</div>'
                    this.loading = false
                })
                //
            }
        },
        mounted() {
            let that = this
            document.onclick = function(e) {
                let node = e.target
                while(node.tagName&&node.tagName !== 'A' && node) {
                    node = node.parentNode?node.parentNode:null
                }
                //
                if(node&&node.href) {//有链接才会判断
                    //
                    if(node.host == that.hostname) {//本主机请求
                        that.queryClick(node.pathname+node.search)
                        
                    }else {
                        window.open(node.href)
                    }
                    //原有的链接不跳转
                    return false
                }
                // console.log(node.host)console.log(node.href)console.log(node.search)console.log(node.pathname)   
            }
            //
            window.onbeforeunload = function() {
                return '加载'
            }
        },
        components: {
            shHeader
        }

    }
</script>

<style lang="scss" scoped>
    #body {
        margin-top: 56px;
        height: 100%;
        width: 100%;
        
        .gap {
            height: 45px;
            background: #f8f8f8;
        }

        .bodyQuery {
            box-sizing: border-box;  
            -moz-box-sizing: border-box; /* Firefox */  
            -webkit-box-sizing: border-box; /* Safari */ 
            background: #fff;
            padding: 0 10px 0 150px;
            float: left;
            width: 60%;
            min-height: 300px;
            height: 100%;
            .el-tabs.el-tabs--top {
                margin-top: -40px;
            }
            .el-tab-pane {
                min-height: 200px;
            }
        }

        .bodynews {
            box-sizing: border-box;  
            -moz-box-sizing: border-box; /* Firefox */  
            -webkit-box-sizing: border-box; /* Safari */ 
            float: left;
            width: 40%;
            background: #fff;
            border-left: 1px solid #e1e1e1;
            //padding: 0 10px;
            margin-top: 40px;
            /deep/ .el-carousel__container {
                height: 480px;
            }
            .el-carousel__item {
                img {
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }
</style>