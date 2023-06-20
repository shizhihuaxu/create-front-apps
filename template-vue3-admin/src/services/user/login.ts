import request from '@/services'

const API = {
    login: '/login',
}

export interface ILoginParams {
    username: string
    password: string
}

export interface ILoginRes {
    token: string
}

export const login = (params: ILoginParams) => {
    return request.post<ILoginRes>(API.login, params)
}
