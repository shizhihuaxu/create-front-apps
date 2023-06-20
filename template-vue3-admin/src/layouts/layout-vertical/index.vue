<!-- 纵向布局 -->
<template>
    <el-container class='layout'>
        <el-aside>
            <div
                class='menu-wrap'
                :style="{ width: isCollapse ? '64px' : '208px' }">
                <div class='logo'>
                    <img
                        src='@/assets/logo.svg'
                        alt='logo' />
                    <span v-show='!isCollapse'>{{ APP_TITLE }}</span>
                </div>
                <el-scrollbar>
                    <el-menu
                        :default-active='activeMenu'
                        :router='false'
                        :collapse='isCollapse'
                        :collapse-transition='false'
                        :unique-opened='true'
                        background-color='#001529'
                        text-color='rgba(255, 255, 255, 0.6)'
                        active-text-color='#ffffff'>
                        <sub-menu :menuList='menuList' />
                    </el-menu>
                </el-scrollbar>
            </div>
        </el-aside>
        <el-container>
            <el-header>
                <toolbar-left>
                    <collapse-icon  />
                    <breadcrumb v-if='!route.meta?.isBreadcrumbHide' />
                </toolbar-left>
                <toolbar-right>
                    <avatar />
                </toolbar-right>
            </el-header>
            <main-content />
        </el-container>
    </el-container>
</template>

<script setup lang='ts'>
import { useGlobalStore } from '@/stores'
import { useUserStore } from '@/stores/modules/user'
import { APP_TITLE } from '@/config'
import CollapseIcon from '@/layouts/components/collapse-icon.vue'
import Breadcrumb from '@/layouts/components/breadcrumb.vue'
import Avatar from '@/layouts/components/avatar.vue'
import ToolbarLeft from '@/layouts/components/toolbar-left.vue'
import ToolbarRight from '@/layouts/components/toolbar-right.vue'
import SubMenu from '@/layouts/components/sub-menu.vue'
import MainContent from '@/layouts/components/main-content.vue'

const route = useRoute()
const userStore = useUserStore()
const globalStore = useGlobalStore()
const activeMenu = computed(() => {
    return route.meta?.activeMenu as (string | undefined) || route.path
})
const menuList = computed(() => userStore.visibleMenuList)
const isCollapse = computed(() => globalStore.isCollapse)
</script>

<style scoped lang='scss'>
@import './index.scss';
</style>
