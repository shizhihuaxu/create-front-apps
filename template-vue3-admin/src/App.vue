<template>
    <el-config-provider :locale='zhCn'>
        <router-view></router-view>
    </el-config-provider>
</template>

<script setup lang='ts'>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
</script>


<style lang='scss'>
html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

#app {
    height: 100%;
    font-size: var(--el-font-size-base);
}

a {
    color: var(--el-color-primary);
    text-decoration: none;
    cursor: pointer;
}
</style>
