import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import router from '@/routers'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { trimParams } from '@/utils/common'
import { LOGIN_URL } from '@/config'
import ErrorMsg from './error-msg'

const REQUEST_TOKEN_KEY = 'Authorization'

const config = {
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    timeout: 60000,
    withCredentials: true,
}

// 用于显示请求错误提示信息的方法，同页面多个请求错误只提示一次
const handleErrorMsgOnce = (msg) => {
    const userStore = useUserStore()

    if (userStore.hasMsg) return

    userStore.hasMsg = true

    ElMessage.error({
        message: msg,
        onClose: () => {
            userStore.hasMsg = false
        },
    })
}

class RequestHttp {
    service: AxiosInstance
    public constructor (config: AxiosRequestConfig) {
        // 创建实例
        this.service = axios.create(config)

        // 请求拦截器
        this.service.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                const userStore = useUserStore()
                const token: string = userStore.token

                // 请求参数 trim，post,patch,put,delete
                if (config.data) {
                    config.data = trimParams(config.data)
                }
                // 请求参数 trim，get
                if (config.params) {
                    config.params = trimParams(config.params)
                }

                // 携带 token，workspace 信息
                return {
                    ...config,
                    headers: {
                        ...config.headers,
                        [REQUEST_TOKEN_KEY]: `Bearer ${token}`,
                    },
                }
            },
            (error: AxiosError) => {
                return Promise.reject(error)
            },
        )

        // 响应拦截器
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                // 处理二进制数据时返回所有响应信息
                if (response.config?.responseType === 'blob') return response

                // 否则仅返回数据部分
                return response.data
            },
            (error: AxiosError) => {
                const { status, data, config } = error.response
                const requestHeaders = config?.headers

                // 请求头携带 Handle-Error-In-Page 字段为 true，表示页面自处理错误，不再统一提示
                if (error.response && !requestHeaders?.['Handle-Error-In-Page']) {
                    const data = error.response.data as any
                    let msg = ErrorMsg[status]

                    if (status === 401) {
                        router.push(LOGIN_URL)
                    }

                    if (status === 403) {
                        router.push('/no-auth')
                    }

                    if (status === 509 || status === 512) {
                        msg = data?.msg
                    }

                    msg && handleErrorMsgOnce(msg)
                }

                return Promise.reject({ status, data })
            },
        )
    }

    // 常用请求方法
    get<T> (url: string, params?: object, config: AxiosRequestConfig = {}): Promise<T> {
        return this.service.get(url, { params, ...config })
    }
    post<T> (url: string, params?: object, config: AxiosRequestConfig = {}): Promise<T> {
        return this.service.post(url, params, config)
    }
    put<T> (url: string, params?: object, config: AxiosRequestConfig = {}): Promise<T> {
        return this.service.put(url, params, config)
    }
    patch<T> (url: string, params?: object, config: AxiosRequestConfig = {}): Promise<T> {
        return this.service.patch(url, params, config)
    }
    delete<T> (url: string, params?: object, config: AxiosRequestConfig = {}): Promise<T> {
        return this.service.delete(url, { data: { ... params }, ...config })
    }
}

export default new RequestHttp(config)
