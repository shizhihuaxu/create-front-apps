import router from '@/routers/index'
import { ElNotification } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { LOGIN_URL } from '@/config'
import { useUserStore } from '@/stores/modules/user'
import { getType } from '@/utils/common'

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob('@/views/**/*.vue')

// 生成动态路由
export const genDynamicRouter = async () => {
    const userStore = useUserStore()

    try {
        // 获取菜单列表
        await userStore.getAuthMenuList()

        // 判断当前用户有没有菜单权限
        if (!userStore.authMenuList.length) {
            ElNotification({
                title: '无权限访问',
                message: '当前账号无任何菜单权限，请联系系统管理员！',
                type: 'warning',
                duration: 3000,
            })

            userStore.token = ''
            router.replace(LOGIN_URL)
            return Promise.reject('No permission')
        }

        // 添加动态路由
        const generator = (menuList) => {
            const newMenuList = cloneDeep(menuList)
            return newMenuList.filter(item => {
                if (item.component && getType(item.component) === 'string') {
                    item.component = modules[`/src/views${  item.component  }.vue`]
                }

                // 明确需要放置在 layout 中的路由，否则嵌套结构的路由均需要在父页面显示
                if (item.meta?.isInLayout) {
                    router.addRoute('layout', item)
                }
                // 后放置的会覆盖先放置的，当 isInLayout=true 和 isFull=true 冲突时，优先 isFull
                if (item.meta?.isFull) {
                    router.addRoute(item)
                }

                item.children?.length && (item.children = generator(item.children))
                return !item.meta?.isFull && !item.meta?.isInLayout
            })
        }
        const filterRoutes = generator(userStore.authMenuList)
        // 将过滤的树结构的菜单数据直接放入 layout 子项中, addRoute只支持添加单个路由，所以需要遍历
        filterRoutes.forEach(item => router.addRoute('layout', item))
    } catch (error) {
        userStore.token = ''
        router.replace(LOGIN_URL)
        return Promise.reject(error)
    }
}

// 重置路由
export const resetRouter = () => {
    const userStore = useUserStore()

    userStore.flatMenuList.forEach(route => {
        const { name } = route
        if (name && router.hasRoute(name)) router.removeRoute(name)
    })
}
