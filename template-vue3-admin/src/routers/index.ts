import {
    createRouter,
    createWebHistory,
} from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { APP_TITLE, LOGIN_URL, ROUTER_WHITE_LIST } from '@/config'
import { staticRouters } from './static-router'
import { genDynamicRouter, resetRouter } from './gen-routers'


const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
    routes: [ ...staticRouters ],
    scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 路由守卫 - beforeEach
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    // 动态设置标题
    const title = APP_TITLE
    document.title = to.meta.title ? `${to.meta.title} - ${title}` : title

    // 跳转到登陆页时重置路由
    if (to.path === LOGIN_URL) {
        resetRouter()
        return next()
    }

    // 判断访问页面是否在路由白名单地址中，如果存在直接放行
    if (ROUTER_WHITE_LIST.includes(to.path)) return next()

    // 判断是否有 Token，没有重定向到 login
    if (!userStore.token) return next({ path: LOGIN_URL, replace: true })

    // 如果没有菜单列表，就重新请求菜单列表并添加动态路由
    userStore.routeName = to.name as string
    if (!userStore.authMenuList.length) {
        await genDynamicRouter()
        return next({ ...to, replace: true })
    }

    // 正常访问页面
    next()
})


export default router
