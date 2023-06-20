<template>
    <div class='table-search-card'>
        <el-form
            ref='formRef'
            :model='formState'
            :label-width='labelWidth'
            @submit.prevent>
            <el-row :gutter='16'>
                <template
                    v-for='(item, index) in formItems'
                    :key='item.key'>
                    <el-col
                        v-show='index <= 1 || (!collapsed && index > 1)'
                        :span='item?.cols || 8'>
                        <el-form-item
                            :label='`${item.label} :`'
                            :rules='item?.rules'>
                            <search-form-item
                                v-bind='item'
                                :formItem='item'
                                :default-value='defaultValue'
                                @keyup.enter='onSearch()'  />
                        </el-form-item>
                    </el-col>
                </template>
                <!-- 按钮操作 -->
                <el-col
                    :span='collapsed ? 8 : 24'
                    :class='{ "txt-align-r": !collapsed, "mb-16px": true }'>
                    <el-button
                        type='primary'
                        @click='onSearch()'>
                        搜索
                    </el-button>
                    <el-button
                        class='ml-8px'
                        @click='onReset()'>
                        重置
                    </el-button>
                    <el-button
                        link
                        type='primary'
                        v-if='formItems.length > 2'
                        @click='collapsed = !collapsed'>
                        <el-icon class='el-icon--left'>
                            <component :is='collapsed ? "ArrowDown" : "ArrowUp"'></component>
                        </el-icon>
                        {{ collapsed ? '展开' : '收起' }}
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script setup lang='ts'>
import type { ISearchItem } from './typing'
import { cloneDeep } from 'lodash-es'
import SearchFormItem from './components/search-form-item.vue'

interface IProps {
    formItems: ISearchItem[]
    defaultValue: Record<string, any>
    labelWidth?: string | number
}
const props = defineProps<IProps>()
const emit = defineEmits([ 'search' ])

const collapsed = ref<boolean>(true) // 默认折叠搜索项
const formState = reactive({})

props.formItems.forEach((item) => {
    const { key } = item
    formState[key] = props.defaultValue?.[key]
})

const initialFormState = cloneDeep(formState) // 初始状态
const firstShowKeys = Object.keys(formState).slice(0, 2) // 默认展示前两个

// 判断搜索的内容是否为空
const hasQueryVal = (val: any) => {
    if (val && val !== 0 && String(val).trim() !== '') {
        return true
    }

    return false
}

watch(
    () => props.defaultValue,
    () => {
        props.formItems.forEach((item) => {
            const { key } = item
            formState[key] = props.defaultValue?.[key]
        })

        // 当传入的值为表单搜索内容；并且不为搜索项前两项；并且存在搜索内容时，展开
        Object.keys(props.defaultValue).forEach(key => {
            if (
                key in formState
                && firstShowKeys.indexOf(key) === -1
                && hasQueryVal(props.defaultValue[key])
            ) {
                collapsed.value = false
            }
        })
    },
    { deep: true },
)

// 搜索
const onSearch = () => {
    emit('search', formState)
}
// 重置
const onReset = () => {
    emit('search', initialFormState)
}
</script>

<style scoped lang='scss'>
// 筛选组件背景
.table-search-card {
    margin-bottom: 10px;
    padding: 18px 16px 0;
    background-color: var(--el-bg-color-overlay);
    border-radius: 4px;
}
</style>
