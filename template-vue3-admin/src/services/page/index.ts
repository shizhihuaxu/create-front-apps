import request from '@/services'

const API = {
    LIST: '/list',
}

// 获取列表
export async function getPageList (params?: Record<string, any>): Promise<any> {
    return request.get(API.LIST, params)
}

// 获取单个详情
export async function getPageDetail (id: Key): Promise<any> {
    return request.get(`${API.LIST}/${id}`)
}

// 创建
export async function addPage (params: Record<string, any>) {
    return request.post(API.LIST, params)
}

// 更新单个
export async function updatePage (id: Key, params: Record<string, any>) {
    const api = `${API.LIST}/${id}`

    return request.patch(api, params)
}

// 删除单个
export async function removePage (id: Key) {
    const api = `${API.LIST}/${id}`

    return request.delete(api)
}
