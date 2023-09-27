import { useUserStore } from '@/stores/modules/user'
import type { Directive, DirectiveBinding } from 'vue'

// v-auth指令：判断是否有权限，无权限移除元素
const auth: Directive = {
    mounted (el: HTMLElement, binding: DirectiveBinding) {
        const { value } = binding
        const useStore = useUserStore()
        // 含有其中一个权限即可展示该菜单或按钮
        const hasPermission = value.some((item) => useStore.authList.includes(item))
        if (!hasPermission) return el.remove()
    },
}

export default auth
