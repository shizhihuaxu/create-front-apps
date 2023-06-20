import { RouteRecordRaw } from 'vue-router'
import { LOGIN_URL, HOME_URL } from '@/config'

export const staticRouters: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'layout',
        redirect: HOME_URL,
        component: () => import('@/layouts/index.vue'),
        children: [],
    },
    {
        path: LOGIN_URL,
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/no-auth',
        component: () => import('@/views/exception/403.vue'),
    },
    // 解决路由刷新报错问题，注意这里不要写 name 否则路由会全部跳到404页面
    {
        path: '/:pathMatch(.*)',
        component: () => import('@/views/exception/404.vue'),
    },
]

// 可由后端生成的路由
export const routes: Menu.MenuOptions[] = [
    {
        path: '/home',
        name: 'home',
        component: '/page/index',
        meta: {
            icon: 'HomeFilled',
            title: '首页',
            isLink: '',
            isHide: false,
            isFull: false,
        },
    },
    {
        path: '/test1',
        name: 'test1',
        redirect: '/test1/index', // 重定向到子项 path
        meta: {
            icon: 'HomeFilled',
            title: 'Histogram',
            isLink: '',
            isHide: false,
            isFull: false,
        },
        children: [
            {
                path: '/test1/index',
                name: 'test1-index',
                component: '/test/test1/index', // src/views/...
                meta: {
                    icon: 'HomeFilled',
                    title: '测试页面-1',
                    isLink: '',
                    isHide: false,
                    isFull: false,
                },
                children: [
                    {
                        path: '/test1/index/detail',
                        name: 'test1-index-detail',
                        component: '/test/test1/detail', // src/views/...
                        meta: {
                            icon: 'HomeFilled',
                            title: '测试页面-1-详情',
                            activeMenu: '/test1/index',
                            isLink: '',
                            isHide: true,
                            isFull: false,
                            isInLayout: false,
                        },
                    },
                ],
            },
        ],
    },
    {
        path: '/test2/link',
        name: 'test2-link',
        component: null,
        meta: {
            icon: 'Menu',
            title: '掘金主页',
            isLink: 'https://juejin.cn/user/3263814531551816/posts',
            isHide: false,
            isFull: false,
        },
    },
]

