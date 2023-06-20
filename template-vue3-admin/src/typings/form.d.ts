import type { FormInstance as FormInstanceEle, FormItemRule } from 'element-plus'

declare namespace Form {
    // 下拉选择
    interface SelectOption  {
        label: string
        value: string | number | boolean | object
        disabled?: boolean
    }

    type FormInstance = FormInstanceEle
    // 表单规则
    type FormRuleItem = FormItemRule & { label?: string, reg?: RegExp }
    type FormRules = Record<string, FormRuleItem[]>
}

export = Form
export as namespace Form

