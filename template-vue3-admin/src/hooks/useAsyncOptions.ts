import request from '@/services'

interface IRes {
    id: Key
    name: string
}

// 获取下拉选项接口
export enum OptionsUrlEnum {
    CLUSTERS = '/attrs/clusters',
}

// 从远程获取筛选的下拉列表
export const useAsyncOptions = (url: string) => {
    const loading = ref<boolean>(false)
    const options = ref<Form.SelectOption[]>([])
    const req: Promise<IRes[]> = request.get(url)

    // 请求数据
    const getOptions = async () => {
        loading.value = true

        return new Promise((resolve, reject) => {
            req
                .then((res) => {
                    const data = res.map(item => {
                        return {
                            label: item.name,
                            value: item.id,
                        }
                    })

                    options.value = data
                    resolve(data)
                })
                .catch(() => {
                    options.value = []
                    reject([])
                })
                .finally(() => {
                    loading.value = false
                })
        })
    }

    return {
        loading,
        options,
        getOptions,
    }
}
