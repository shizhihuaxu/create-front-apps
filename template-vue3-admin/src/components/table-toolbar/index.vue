<template>
    <div class='table-toolbar'>
        <div class='table-toolbar-left'>
            <el-space>
                <slot name='left' />
                <span v-if='selectLen !== 0'>已选 {{ selectLen }} 项</span>
            </el-space>
        </div>
        <div class='table-toolbar-right'>
            <!-- 右侧自定义内容区 -->
            <template v-if='$slots.right'>
                <slot name='right' />
                <el-divider
                    v-if='mode !== "layout"'
                    direction='vertical'
                    class='mx-12px' />
            </template>
            <!-- 标准版 -->
            <template v-if='mode === "normal"'>
                <el-space>
                    <!-- 刷新 -->
                    <el-button
                        circle
                        @click='onRefresh'>
                        <el-icon><refresh /></el-icon>
                    </el-button>
                    <!-- 下载 -->
                    <el-button
                        v-if='hasDownload'
                        circle
                        @click='onDownload'>
                        <el-icon><download /></el-icon>
                    </el-button>
                    <!-- 列设置 -->
                    <el-popover
                        placement='bottom'
                        trigger='click'>
                        <template #reference>
                            <el-button circle >
                                <el-icon><operation/></el-icon>
                            </el-button>
                        </template>
                        <el-scrollbar max-height='300px'>
                            <template
                                v-for='column in tableColumns'
                                :key='column.key'>
                                <div
                                    v-if='
                                        column.type !== "selection"
                                            && column.type !== "index"
                                            && column.type !== "expand"
                                            && column.prop !== "operation"'>
                                    <el-checkbox
                                        :checked='column.isShow'
                                        :label='column.label'
                                        @change='onColumnchange(column, $event as boolean)' />
                                </div>
                            </template>
                        </el-scrollbar>
                    </el-popover>
                </el-space>
            </template>
            <!-- 简易版 -->
            <el-space v-if='mode === "simple"'>
                <el-button @click='onSearch'>
                    <el-icon><refresh /></el-icon>
                </el-button>
                <el-input
                    style='width: 250px;'
                    :model-value='query'
                    :placeholder='placeholder'
                    clearable
                    @input='onChange'
                    @clear='onClear'
                    @keyup.enter='onSearch'>
                    <template #append>
                        <el-button @click='onSearch'>
                            <el-icon><search /></el-icon>
                        </el-button>
                    </template>
                </el-input>
            </el-space>
        </div>
    </div>
</template>

<script setup lang='ts'>
interface IProps {
    columns?: Table.ColumnProps[]
    // 简易版为右侧带搜索框的，标准版为带刷新、下载、列设置图标的，layout 版为仅使用布局，不提供其他操作
    mode?: 'normal' | 'simple' | 'layout'
    selectLen?: number // 多选长度
    // 标准版
    hasDownload?: boolean // 是否有下载图标
    // 简易版
    query?: string | number
    placeholder?: string
}

const props = withDefaults(defineProps<IProps>(), {
    columns: () => [],
    mode: 'normal',
    selectLen: 0,
    hasDownload: false,
    placeholder: '请输入关键字搜索',
})

const emits = defineEmits([ 'refresh', 'download', 'update:query', 'search', 'update-column' ])

// 刷新
const onRefresh = () => {
    emits('refresh')
}

// 下载
const onDownload = () => {
    emits('download')
}

// 搜索框内容变化
const onChange = (input: string | number) => {
    emits('update:query', input)
}

// 搜索框搜索
const onSearch = () => {
    emits('search')
}

// NOTE  清空，保证事件执行顺序，只使用 onSearch 接受 search 事件先于 change 事件发生
const onClear = () => {
    onChange('')
    onSearch()
}

// 动态列
const { columns } = toRefs(props)
const tableColumns = computed<Table.ColumnProps[]>(() => {
    columns.value.forEach(col => {
        col.isShow = col.isShow ?? true
    })

    return columns.value
})

const updateColumns = () => {
    const columns = tableColumns.value.filter(item => item.isShow)

    emits('update-column', columns)
}

const onColumnchange = (column: Table.ColumnProps, value: boolean) => {
    column.isShow = value
    updateColumns()
}

updateColumns()
</script>

<style scoped lang='scss'>
.table-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.table-toolbar-right {
    display: flex;
    align-items: center;
}
</style>
