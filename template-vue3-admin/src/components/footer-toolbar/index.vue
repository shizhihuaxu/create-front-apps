<template>
    <div
        class='footer-toolbar'
        :style='{ width }'>
        <div class='footer-toolbar-left'>
            <slot name='extra' />
        </div>
        <div class='footer-toolbar-right'>
            <slot />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
const width = computed(() => {
    // NOTE 左侧需要展示菜单的布局，需要除去左侧菜单的宽度，这里多加了 2px 为了防止覆盖在菜单上
    return `calc(100% - ${globalStore.isCollapse ? 66 : 210 }px)`
})
</script>

<style scoped lang='scss'>
.footer-toolbar {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 44px;
    padding: 0 16px;
    background-color: var(--el-bg-color-overlay);
    border-top: 1px solid var(--el-border-color-lighter);
    box-shadow: var(--el-box-shadow-lighter);

    &-left {
        flex: 1;
        margin-right: 16px;
    }
}
</style>
