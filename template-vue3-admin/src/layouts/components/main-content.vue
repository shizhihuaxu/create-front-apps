<template>
    <el-main>
        <router-view v-slot='{ Component, route }'>
            <transition
                appear
                name='fade-transform'
                mode='out-in'>
                <component
                    :is='Component'
                    :key='route.path'
                    v-if='isRouterShow' />
            </transition>
        </router-view>
    </el-main>
</template>

<script setup lang='ts'>
import { useDebounceFn } from '@vueuse/core'
import { useGlobalStore } from '@/stores'

const globalStore = useGlobalStore()
const isCollapse = computed(() => globalStore.isCollapse)

// 刷新当前页面
const isRouterShow = ref(true)
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val)
provide('refresh', refreshCurrentPage)

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0)
const listeningWindow = useDebounceFn(() => {
    screenWidth.value = document.body.clientWidth
    if (!isCollapse.value && screenWidth.value < 1200) globalStore.isCollapse = true
    if (isCollapse.value && screenWidth.value > 1200) globalStore.isCollapse = false
}, 100)

window.addEventListener('resize', listeningWindow, false)
onBeforeUnmount(() => {
    window.removeEventListener('resize', listeningWindow)
})
</script>

<style scoped lang='scss'>
.el-main {
    box-sizing: border-box;
    padding: 0;
    overflow: hidden;
    background-color: var(--el-bg-color-page);
}
</style>
