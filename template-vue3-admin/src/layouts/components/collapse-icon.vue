<template>
    <el-icon
        class='collapse-icon'
        @click='collapse'>
        <component :is="globalStore.isCollapse ? 'expand' : 'fold'"></component>
    </el-icon>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
const collapse = () => {
    globalStore.isCollapse = !globalStore.isCollapse
}
</script>

<style scoped lang='scss'>
.collapse-icon {
    margin-right: 20px;
    font-size: 22px;
    cursor: pointer;
}
</style>

