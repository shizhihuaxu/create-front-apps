<template>
    <el-table
        ref='tableElRef'
        :data='tableData'
        :row-key='rowKey'
        v-loading='loading'
        v-bind='$attrs'>
        <template
            v-for='item in tableColumns'
            :key='item'>
            <!-- selection || index -->
            <el-table-column
                v-if="item.type == 'selection' || item.type == 'index'"
                :width="item.type == 'selection' ? 42 : 'auto'"
                v-bind='item'
                :align="item.align ?? 'center'"
                :reserve-selection="item.type == 'selection'">
            </el-table-column>
            <!-- expand 支持 tsx 语法 && 作用域插槽 (tsx > slot) -->
            <el-table-column
                v-if="item.type == 'expand'"
                v-bind='item'
                :align="item.align ?? 'center'"
                v-slot='scope'>
                <component
                    v-if='item.render'
                    :is='item.render'
                    :row='scope.row'>
                </component>
                <slot
                    v-else
                    :name='item.type'
                    :row='scope.row'>
                </slot>
            </el-table-column>
            <!-- other 循环递归 -->
            <table-column
                v-if='!item.type && item.prop && item.isShow'
                :column='item'>
                <template
                    v-for='slot in Object.keys($slots)'
                    #[slot]='scope'>
                    <slot
                        :name='slot'
                        :row='scope.row'></slot>
                </template>
            </table-column>
        </template>
    </el-table>
    <!-- NOTE 使用 v-if 判断，使 total 更新后刷新组件，解决换页后自动回到第一页的问题  -->
    <div class='table-pagination'>
        <el-pagination
            v-if='pagination.total !== 0'
            :current-page='pagination.current'
            :page-size='pagination.pageSize'
            :total='pagination.total'
            :page-sizes='pagination.pageSizes'
            :background='true'
            layout='total, sizes, prev, pager, next, jumper'
            @size-change='pagination.handleSizeChange'
            @current-change='pagination.handleCurrentChange'></el-pagination>
    </div>
</template>

<script lang='ts'>
export default {
    inheritAttrs: false,
}
</script>

<script setup lang='ts'>
import TableColumn from './components/table-column.vue'

interface IProps {
    columns: Table.ColumnProps[]
    tableData: any[]
    pagination?: Table.PaginationProps | undefined
    rowKey?: string
    loading?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
    rowKey: 'pk',
    loading: false,
})

// 暴露组件引用
const tableElRef = ref()
defineExpose({
    tableEl: tableElRef,
})

// 动态列
const { columns } = toRefs(props)
const tableColumns = computed<Table.ColumnProps[]>(() => {
    columns.value.forEach(col => {
        col.isShow = col.isShow ?? true
    })

    return columns.value
})
</script>

<style scoped lang='scss'>
.table-pagination {
    display: flex;
    justify-content: flex-end;
    height: 32px;
    margin-top: 16px;
}
</style>
