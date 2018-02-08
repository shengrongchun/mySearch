<template>
    <div class="weChat">
        <el-row>
            <el-col :span="8">
                <sider-left></sider-left>
            </el-col>
            <el-col :span="16">
                <sider-right></sider-right>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import siderLeft from './sider-left'
    import siderRight from './sider-right'

    export default {
        name: 'weChat',
        components: { siderLeft, siderRight }
    }
</script>

<style lang="scss" scoped>
    .weChat {
        width: 100%;
        height: 100%;
        .el-row,.el-col {
            height: 100%;
        }
    }
</style>