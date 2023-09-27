import type { Dayjs } from 'dayjs'
import queryString from 'query-string'
import { convertEmptyField, IConvertEmptyConfig } from '@/utils/common'

// 列表接口响应数据
interface ReponseData {
    data: any[]
    total?: number
    current?: number
    [key: string]: any
}

// 列表请求参数
type RequestParams =
    | {
        size?: number
        page?: number
        [key: string]: any
    }
    | undefined

// 列表默认数据
interface IState  {
    loading: boolean,
    tableList: any[],
    queryParams: {
        filter?: string
        start_time?: Dayjs
        end_time?: Dayjs
        sort?: string
        [key: string]: any
    }
}

// 列表排序值
enum SortOrderEnum {
    ASC = 'ascending',
    DESC = 'descending',
}

// 列表操作
export const useTableList = <T extends ReponseData>(
    getData: (params?: RequestParams) => Promise<T>, // axios 请求方法
    options?: {
        rowKey?: string // 列表多选获取唯一表示字段名
        needRouteParams?: boolean // 是否需要将查询参数携带进路由
        pagination?: boolean
        requestImmediate?: boolean // 默认true，是否在 mounted 时立即获取数据，在dialog/drawer的 list有时需要在显示后才获取查询参数才能数据
        columns?: Table.ColumnProps[] | Ref<Table.ColumnProps[]>
        defaultQueryParams?: RequestParams
        convertEmptyOptions?: IConvertEmptyConfig
        onLoad?: (ReponseData: any) => void
        onRequestError?: (e: Error) => void
    },
) => {
    // table 元素
    const tableRef = ref(null)
    // 动态列
    const dynamicColumns = ref<Table.ColumnProps[]>([])

    // 列表默认数据
    const state = reactive<IState>({
        loading: false,
        tableList: [],
        queryParams: {
            ...options?.defaultQueryParams,
        },
    })

    // 将查询参数更新到 url
    const router = useRouter()
    const route = useRoute()
    const updateRouteQuery = async () => {
        const path = route.path
        const query = queryString.stringify(state.queryParams, {
            skipNull: true, // 忽略key的值为 null、undefined的处理
            arrayFormat: 'bracket', // 将数组查询参数处理为 arr[]=1&arr[]=2的形式
        })
        // NOTE 保留数组参数形式, query: {} 方式会将数组参数处理为 arr=1&arr=1的形式，单个数组解析时会被解析为字符串
        const failure = await router.replace(`${path}?${query}`)

        const msg = failure ? '导航失败' : '导航成功'
        return msg
    }

    // 多选
    const selection = reactive<{
        hasSelected: boolean // 是否选择内容
        selectedKeys: Key[] // 选择的列表项 key
        selectedLen: number // 选择了多少项，主要是为了兼容跨页全选，设置为全部数量
    }>({
        hasSelected: false,
        selectedKeys: [],
        selectedLen: 0,
    })

    // 选择事件
    const onSelectionChange = (rowArr: Key[]) => {
        const rowKey =  options?.rowKey || 'id'

        Object.assign(selection, {
            hasSelected: rowArr.length !== 0,
            selectedKeys: rowArr.map(item => item[rowKey]),
            selectedLen: rowArr.length,
        })
    }


    // 列表排序
    const onSort = ({ prop, order }) => {
        let sort = ''

        if (prop && order) {
            sort = order === SortOrderEnum.ASC ? prop : `-${prop}`
        }

        Object.assign(state.queryParams, { sort: sort || undefined })

        onSearch()
    }

    // 排序状态还原至列表, 在页面刷新后还原状态
    const defaultSort = ref<{
        prop: string
        order: SortOrderEnum
    }>()

    const setDefaultSort = () => {
        const symbol = '-' // 降序符号
        const { sort } = state.queryParams

        if (sort) {
            const dir = sort.slice(0, 1)
            const prop = sort.replace(symbol, '')

            defaultSort.value =  {
                prop,
                order: dir === symbol ? SortOrderEnum.DESC : SortOrderEnum.ASC,
            }
        } else {
            defaultSort.value = undefined
        }
    }

    // 列表分页数据
    const pagination = reactive<Table.PaginationProps>({
        current: 1,
        pageSize: 20,
        pageSizes: [ 20, 50, 100, 200 ],
        total: 0,
        handleCurrentChange: (page: number) => {
            pagination.current = page

            Object.assign(state.queryParams, { page })

            if (options?.needRouteParams !== false) {
                // 不管成功或失败都刷新一次
                updateRouteQuery().finally(() => {
                    fetchList(false) // 不清除选中项状态
                })
            } else {
                fetchList(false) // 不清除选中项状态
            }
        },
        handleSizeChange: (pageSize: number) => {
            pagination.pageSize = pageSize

            Object.assign(state.queryParams, { size: pageSize })
            onSearch()
        },
    })

    const fetchList = async (isClearSelectedRows = true) => {
        state.loading = true
        state.tableList = []
        pagination.total = 0

        try {
            const params: RequestParams = state.queryParams
            const res = await getData(params)
            const { data, current, total } = res

            // 重置选中项，tableEl 为 table-list 组件中暴露出来的 ref
            if (isClearSelectedRows) {
                tableRef.value?.tableEl?.clearSelection()
            }

            state.loading = false
            state.tableList = convertEmptyField(data, options?.convertEmptyOptions)
            pagination.current = current as number
            pagination.total = total as number

            // 请求数据成功后执行回调函数
            if (options?.onLoad) {
                options.onLoad(res)
            }
        } catch (e: any) {
            state.loading = false
            // 如果没有传递这个方法的话，需要把错误抛出去，以免吞掉错误
            if (options?.onRequestError !== undefined) {
                options.onRequestError(e)
            } else {
                // throw new Error(e)
            }
        }
    }

    // 留在当前页刷新
    const onReload = () => {
        fetchList()
    }

    // 搜索，回到第一页
    const onSearch = (params: Partial<RequestParams> = {}) => {
        pagination.current = 1
        Object.assign(state.queryParams, params, { page: 1 })

        if (options?.needRouteParams !== false) {
            updateRouteQuery().finally(() => {
                fetchList()
            })
        } else {
            fetchList()
        }
    }

    // 在此生命周期时执行，避免在此之前执行修改数据初值
    onMounted(() => {
        // 便于 query 中的参数覆盖默认参数
        if (options?.needRouteParams !== false) {
            const {
                page, size, ...params
            } = queryString.parse(location.search, {
                parseNumbers: true, // 解析数字类型的值
                parseBooleans: true, // 解析布尔类型的值
                arrayFormat: 'bracket', // 解析arr[]=1&arr[]=2形式的数组
            })

            page ? pagination.current = Number(page) : ''
            size ? pagination.pageSize = Number(size) : ''

            Object.assign(state.queryParams, params)
        }

        if (!options?.pagination !== false) {
            Object.assign(state.queryParams, {
                page: pagination.current,
                size: pagination.pageSize,
            })
        }

        setDefaultSort()

        if(options?.requestImmediate !== false) {
            fetchList()
        }
    })

    return {
        tableRef,
        dynamicColumns,
        state,
        selection,
        pagination,
        defaultSort,
        onSelectionChange,
        onSort,
        onReload,
        onSearch,
    }
}
