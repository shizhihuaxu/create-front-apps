/**
 * @description 扁平化数组对象(主要用来处理路由菜单)
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getFlatMenuList (menuList: Menu.MenuOptions[]) {
    const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
    return newMenuList.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
        let flatArr = [ ...pre, current ]
        if (current.children) flatArr = [ ...flatArr, ...getFlatMenuList(current.children) ]
        return flatArr
    }, [])
}

/**
 * @description 使用递归，过滤出需要渲染在左侧菜单的列表（剔除 isHide == true 的菜单）
 * @param {Array} menuList 所有菜单列表
 * @return array
 * */
export function getShowMenuList (menuList: Menu.MenuOptions[]) {
    const newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
    return newMenuList.filter(item => {
        item.children?.length && (item.children = getShowMenuList(item.children))
        return !item.meta?.isHide
    })
}

/**
 * @description 递归找出所有面包屑存
 * @param {Array} menuList 所有菜单列表
 * @param {Object} result 输出的结果
 * @param {Array} parent 父级菜单
 * @returns object
 */
export const getAllBreadcrumbList = (
    menuList: Menu.MenuOptions[],
    result: { [key: string]: any } = {},
    parent = [],
) => {
    for (const item of menuList) {
        result[item.path] = [ ...parent, item ]
        if (item.children) getAllBreadcrumbList(item.children, result, result[item.path])
    }
    return result
}
