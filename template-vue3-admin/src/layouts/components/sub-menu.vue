<template>
    <template
        v-for='subItem in menuList'
        :key='subItem.path'>
        <el-sub-menu
            v-if='subItem.children && subItem.children.length > 0'
            :index='subItem.path'>
            <template #title>
                <el-icon>
                    <component
                        v-if='subItem.meta?.icon'
                        :is='subItem.meta.icon' />
                    <icon-symbol
                        v-if='subItem.meta?.iconSymbol'
                        :icon='subItem.meta.iconSymbol' />
                </el-icon>
                <span>{{ subItem.meta.title }}</span>
            </template>
            <SubMenu :menuList='subItem.children' />
        </el-sub-menu>
        <el-menu-item
            v-else
            :index='subItem.path'
            @click='handleClickMenu(subItem)'>
            <el-icon>
                <component
                    v-if='subItem.meta?.icon'
                    :is='subItem.meta.icon' />
                <icon-symbol
                    v-if='subItem.meta?.iconSymbol'
                    :icon='subItem.meta.iconSymbol' />
            </el-icon>
            <template #title>
                <span>{{ subItem.meta.title }}</span>
            </template>
        </el-menu-item>
    </template>
</template>

<script setup lang='ts'>
defineProps<{ menuList: Menu.MenuOptions[] }>()

const router = useRouter()
const handleClickMenu = (subItem: Menu.MenuOptions) => {
    if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank')
    router.push(subItem.path)
}
</script>
