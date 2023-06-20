<template>
    <component :is='renderColumn(column)'></component>
</template>

<script setup lang='tsx'>
import RelativeTime from '@/components/relative-time/index.vue'
import BaseCopy from '@/components/base-copy/index.vue'

defineProps<{ column:  Table.ColumnProps }>()

const slots = useSlots()

const renderColumn = (item:  Table.ColumnProps) => {
    return (
        <>
            {item.isShow && (
                <el-table-column
                    {...item}
                    width={ item.normalTime ? 116 : item?.width }
                    align={ item.align ?? 'left' }>
                    {{
                        default: (scope) => {
                            if (item.render) return item.render(scope)
                            if (slots[item.prop]) return slots[item.prop](scope)
                            if (item.relativeTime) return <RelativeTime time={ scope.row[item.prop] } />
                            {/* 换成两行显示 */}
                            if (item.normalTime) {
                                const timeArr = scope.row[item.prop]?.split(' ')

                                return timeArr.map(str => <div>{ str }</div>)
                            }
                            if (item.copiable) {
                                return (
                                    <BaseCopy
                                        ellipsis={ false }
                                        content={ scope.row[item.prop] }>
                                        { scope.row[item.prop] }
                                    </BaseCopy>
                                )
                            }
                            return scope.row[item.prop]
                        },
                        header: () => {
                            if (item.headerRender) return item.headerRender(item)
                            if (slots[`${item.prop}Header`]) return slots[`${item.prop}Header`]({ row: item })
                            return item.label
                        },
                    }}
                </el-table-column>
            )}
        </>
    )
}
</script>
