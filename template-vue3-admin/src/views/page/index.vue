<template>
    <div class='page'>
        <div class='page-card'>
            <table-toolbar
                mode='simple'
                v-model:query='state.queryParams.query'
                @search='onSearch()'>
                <template #right>
                    <el-button
                        type='primary'
                        @click='handleOpsRow(OpsRowEnum.ADD)'>
                        <el-icon class='el-icon--left'><plus /></el-icon>
                        添加项
                    </el-button>
                </template>
            </table-toolbar>
            <table-list
                ref='tableRef'
                :columns='tableColumns'
                :table-data='state.tableList'
                :pagination='pagination'
                :loading='state.loading'
                :default-sort='defaultSort'
                @sort-change='onSort'>
                <template #admins='{ row }'>
                    <span>
                        {{ row.admins.length
                            ? row.admins.map(item=> item.name).join('，')
                            :  EMPTY_STR
                        }}
                    </span>
                </template>
                <template #operation='{ row }'>
                    <template>
                        <el-divider direction='vertical' />
                        <el-button
                            type='primary'
                            link
                            @click='handleOpsRow(OpsRowEnum.UPDATE,row)'>
                            编辑
                        </el-button>
                        <el-divider direction='vertical' />
                        <el-button
                            type='primary'
                            link
                            @click='handleDelete(OpsNumEnum.SINGLE, row)'>
                            删除
                        </el-button>
                    </template>
                </template>
            </table-list>
        </div>
        <!-- 添加、编辑 -->
        <row-form
            v-model:visible='opsRow.visible'
            :id='opsRow.id'
            :type='opsRow.type'
            @ok='onReload()' />
    </div>
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus'
import { OpsNumEnum, EMPTY_STR } from '@/constants'
import { useTableList } from '@/hooks/useTableList'
import { useTableAction, useActionQuery } from '@/hooks/useTableAction'
import { getPageList, removePage } from '@/services/page'
import RowForm from './components/row-form.vue'

// 列表项
const tableColumns = [
    { prop: 'name', label: '名称' },
    { prop: 'updated_at', label: '更新时间', sortable: true },
    { prop: 'operation', label: '操作', fixed: 'right', width: 220 },
]

const {
    tableRef,
    state,
    pagination,
    defaultSort,
    onSort,
    onReload,
    onSearch,
} = useTableList(getPageList, {
    columns: tableColumns,
    defaultQueryParams: {
        query: '',
    },
})

// 添加、编辑
const {
    OpsRowEnum,
    opsRow,
    handleOpsRow,
} = useTableAction()

// 删除
const handleDeleteConfirm = (_type: OpsNumEnum, item?: any) => {
    const { id } = item
    removePage(id).then(() => {
        ElMessage.success('操作成功')
        onReload()
    })
}

const { handleQuery: handleDelete } = useActionQuery(handleDeleteConfirm)
</script>
