<template>
    <div class='breadcrumb-container'>
        <el-breadcrumb>
            <transition-group
                name='breadcrumb'
                mode='out-in'>
                <el-breadcrumb-item
                    v-for='(item) in breadcrumbList'
                    :key='item.path'
                    :to='item.path'>
                    {{ item.meta.title }}
                </el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/stores/modules/user'
import { HOME_URL } from '@/config'

interface IBreadcrumb {
    path: string
    meta: {
        title: string
    }
}

const route = useRoute()
const userStore = useUserStore()

const breadcrumbList = computed<IBreadcrumb[]>(() => {
    let breadcrumbs = userStore.breadcrumbList[route.matched[route.matched.length - 1].path] ?? []

    // 追加一个首页的导航
    if (breadcrumbs[0].path !== HOME_URL) {
        breadcrumbs = [
            { path: HOME_URL, meta: { title: '首页' } },
            ...breadcrumbs,
        ]
    }
    return breadcrumbs
})
</script>
