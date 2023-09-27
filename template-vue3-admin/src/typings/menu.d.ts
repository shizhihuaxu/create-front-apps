declare namespace Menu {
    interface MenuOptions {
        path: string
        name: string
        component?: string | (() => Promise<unknown>)
        redirect?: string
        meta: MetaProps
        children?: MenuOptions[]
    }
    interface MetaProps {
        title: string // 菜单标题
        permission?: string // 权限标识
        icon?: string // 菜单图标
        iconSymbol?: string // iconfont 图标
        activeMenu?: string // 当次路由为详情页时，需要激活显示的左侧菜单项 path
        isLink?: string // 是否为外部链接，有链接时填链接地址，无链接时传空字符串
        isHide?: boolean // 是否隐藏在左侧菜单中
        isFull?: boolean // 是否全屏
        isInLayout?: boolean // 是否需要直接生成在 layout 下, 否则嵌套在父级路由页面里显示，默认 false
        isBreadcrumbHide?: boolean // 是否显示面包屑导航，默认 false
    }
}

