import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

declare namespace Table {
    // 列信息
    interface ColumnProps<T = any> extends Partial<Omit<TableColumnCtx<T>, 'children' | 'renderHeader' | 'renderCell'>> {
        isShow?: boolean // 是否显示在表格当中
        tag?: boolean // 是否是标签展示
        normalTime?: boolean // 是否基础时间
        relativeTime?: boolean // 是否显示为相对时间
        copiable?: boolean // 是否可复制
        headerRender?: (row: ColumnProps) => any // 自定义表头内容渲染（tsx语法）
        render?: (scope: { row: T }) => any // 自定义单元格内容渲染（tsx语法）
        _children?: ColumnProps<T>[] // 多级表头
    }

    // 分页组件
    interface PaginationProps {
        current: number
        pageSize: number
        pageSizes: number[]
        total: number
        handleSizeChange: (size: number) => void
        handleCurrentChange: (currentPage: number) => void
    }
}

export = Table
export as namespace Table
