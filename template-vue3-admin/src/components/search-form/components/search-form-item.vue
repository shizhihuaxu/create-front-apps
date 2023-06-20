<!-- eslint-disable vue/no-mutating-props -->
<template>
    <component
        :is='formComponents[formItem.el]'
        v-model='defaultValue[formItem.key]'
        :placeholder='formItem.el === SearchElEnum.input ? "请输入" : "请选择"'
        clearable
        filterable
        range-separator='至'
        start-placeholder='开始时间'
        end-placeholder='结束时间'
        v-bind='$attrs'>
        <!-- select 组件下拉选择 -->
        <template v-if='formItem.el === SearchElEnum.select'>
            <component
                :is='formComponents.option'
                v-for='item in formItem.options'
                :key='item'
                :label='item.label'
                :value='item.value' />
        </template>
        <!-- cascader 设置选项 label -->
        <template
            v-if='formItem.el === SearchElEnum.cascader'
            #default='{ data }'>
            <span>{{ data.label }}</span>
        </template>
    </component>
</template>

<script setup lang='ts'>
import type { ISearchItem } from '../typing'
import { SearchElEnum } from '../typing'
import {
    ElInput, ElSwitch, ElSelect, ElOption, ElSelectV2,
    ElTreeSelect, ElCascader, ElDatePicker, ElTimePicker,
} from 'element-plus'

interface IProps {
    formItem: ISearchItem
    defaultValue: Record<string, any>
}

defineProps<IProps>()

const formComponents: Record<string, Component> = {
    input: ElInput,
    switch: ElSwitch,
    select: ElSelect,
    cascader: ElCascader,
    option: ElOption,
    'select-v2': ElSelectV2,
    'tree-select':ElTreeSelect,
    'date-picker': ElDatePicker,
    'time-picker': ElTimePicker,
}
</script>
