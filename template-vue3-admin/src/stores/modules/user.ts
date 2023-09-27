import { defineStore } from 'pinia'
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from '@/utils/menu'
import { routes } from '@/routers/static-router'

export const useUserStore = defineStore('user', {
    persist: {
        paths: [
            'token',
            'username',
        ],
    },
    state: () => ({
        hasMsg: false as boolean,
        token: '111' as string,
        username: '用户名' as string, // 用户名
        // 当前页面的 router name，用来做按钮权限筛选
        routeName: '' as string,
        // 菜单权限列表
        authMenuList: [] as Menu.MenuOptions[],
        authList: [] as string[],
    }),
    getters: {
        // 左侧菜单栏渲染，需要去除 isHide == true
        visibleMenuList: state => getShowMenuList(state.authMenuList),
        // 扁平化之后的一维数组路由，主要用来移除动态路由
        flatMenuList: state => getFlatMenuList(state.authMenuList),
        // 所有面包屑导航列表
        breadcrumbList: state => getAllBreadcrumbList(state.authMenuList),
    },
    actions: {
        // 接口请求菜单列表
        async getAuthMenuList () {
            // const { data } = await getAuthMenuListApi()
            this.authMenuList = routes
        },
    },
})
