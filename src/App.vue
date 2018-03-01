<template>
    <div id="app">
        <sh-body></sh-body>
    </div>
</template>

<script>
import shBody from './components/shBody'
export default {
    name: 'App',
    components: {
        shBody: shBody
    }
}
</script>

<style lang="scss">
    * {
        margin: 0;
        padding: 0;
    }
    body,html {
        background: #fff;
        color: #333;
        min-width: 900px;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: " ";
    }
    .clearfix:after {
        clear: both;
    }
    .clearfix{
        *zoom: 1;
    }
    .search-chat-item {//chat搜索下拉
        .el-scrollbar {
            overflow: inherit;
            .el-autocomplete-suggestion__wrap.el-scrollbar__wrap {
                margin-right: 0 !important;
            }
            .avatar {
                vertical-align: middle;
                border-radius: 2px;
            }
            .name {
                margin-left: 5px;
            }
        }
    }
</style>
