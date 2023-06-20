import { createPinia, defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const useGlobalStore = defineStore('global', {
    persist: {
        paths: [
            'isCollapse',
        ],
    },
    state: () => ({
        isCollapse: false as boolean, // 菜单折叠状态
    }),
})


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
