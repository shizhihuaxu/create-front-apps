// 搜索组件类型
export enum SearchElEnum {
    input = 'input',
    switch = 'switch',
    select = 'select',
    selectV2 = 'select-v2',
    cascader = 'cascader',
    treeSelect = 'tree-select',
    datePicker = 'date-picker',
    timePicker = 'time-picker',
}

// 搜索项
export interface ISearchItem {
    el: SearchElEnum // 搜索元素的类型，输入框下拉选择等
    key: string // 字段名
    label?: string // 表单项 label
    rules?: Form.FormRuleItem[] // 表单项校验规则
    cols?: number // 设置占几列
    [key: string]: any
}
