import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { cloneDeep } from 'lodash-es'
import { EMPTY_STR } from '@/constants'

dayjs.extend(relativeTime)

// 获取变量数据类型
export const getType = (val: unknown): string => {
    const type = Object.prototype.toString
        .call(val)
        .slice(8, -1)
        .toLowerCase()

    return type
}

/** -------------------------- 时间 --------------------- */
// 格式化时间显示
export const dateFormat = (dataStr: string | number, pattern = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(dataStr).format(pattern)
}

// 计算从当前时间开始，到传入时间的相对时间，例如 3天前
// 时间范围划分标准 https://day.js.org/docs/zh-CN/display/from-now#list-of-breakdown-range
export const dateFromNow = (dataStr: string | number) => {
    return dayjs(dataStr).fromNow()
}

/** -------------------------- 业务数据处理 --------------------- */
// 对象字面量中的值去除前后空格，只处理第一层
export const trimParams = (params: Record<string, any>): Record<string, any> => {
    if (params && getType(params) === 'object') {
        // 避免直接修改源对象，由于双向数据绑定会使输入框内容显示为去空格后内容
        const obj = cloneDeep(params)

        Object.keys(obj).forEach(key => {
            // 如果为字符串直接 trim
            if (getType(obj[key]) === 'string') {
                obj[key] = obj[key].trim()
            }

            // 如果为 number，转换为 string trim 后再转换为 number
            if (getType(obj[key]) === 'number') {
                obj[key] = String(obj[key]).trim()
                obj[key] = Number(obj[key])
            }
        })

        return obj
    }

    return params
}

// 将对象处理成 select 选择器下拉选项
export interface IOptions{
    label: string
    value: string | number | boolean
}
interface IToOptionsConfig {
    type?: 'string' | 'number' | 'boolean'
    labelAsVal?: boolean // 将 label 的值设置成 value
    exclude?: string[]
    include?: string[]
}

export const toOptions = (
    obj: Record<string, any>,
    config?: IToOptionsConfig,
): IOptions[] => {
    const exclude = config?.exclude || []
    const include = config?.include || []
    const excludeLen = exclude.length
    const includeLen = include.length

    const type = config?.type || 'string'
    const options: IOptions[] = []

    Object.keys(obj).forEach(key => {
        if (
            (!excludeLen && !includeLen)
            || (excludeLen && exclude.indexOf(key) === -1)
            || (includeLen && include.indexOf(key) !== -1)
        ) {
            const label = getType(obj[key]) === 'string' ? obj[key] : obj[key].text
            let value

            if (type === 'number') {
                value = +key
            } else if (type === 'boolean') {
                value = Boolean(+key)
            } else {
                value = key
            }

            if (config?.labelAsVal) {
                value = label
            }

            options.push({
                label,
                value,
            })
        }
    })

    return options
}

/**
 * 数据中有字段为空的处理, 字段为空（null、字符串为空），不处理空数组、空对象，0的情况，都改为'-'
 * @param data 数据类型包含基础类型值（布尔型数据保留）、数组、对象
 * @param config
 *      deep 默认为 true，是否深层处理，对数组，对象嵌套内容深层处理，默认会深层处理
 *      exlucde 指定排除处理的字段名组成的数组
 *      include 指定包含处理的字段名组成的数组
 * @returns
 */
export interface IConvertEmptyConfig {
    deep?: boolean
    exclude?: string[]
    include?: string[]
}

export const convertEmptyField: any = (
    data: any,
    config?: IConvertEmptyConfig,
) => {
    const isEmpty = (val: any) => {
        // null、字符串为空（注意存在数值为0时）
        if (val === '' || String(val) === 'null') {
            return EMPTY_STR
        }
        return val
    }

    // 拷贝一份，不改变原数据
    let copyData = cloneDeep(data)
    const exclude = config?.exclude || []
    const include = config?.include || []
    const excludeLen = exclude.length
    const includeLen = include.length

    // 当数据为数组时
    if (copyData instanceof Array) {
        copyData.forEach((val, key, array) => {
            array[key] = config?.deep !== false ? convertEmptyField(val, config) : isEmpty(val)
        })
    }

    // 当数据为对象时
    if (copyData instanceof Object) {
        for (const key in copyData) {
            // 未指定排除此字段 或 指定包含此字段
            if (
                (!excludeLen && !includeLen)
                || (excludeLen && exclude.indexOf(key) === -1)
                || (includeLen && include.indexOf(key) !== -1)
            ) {
                copyData[key] = config?.deep !== false
                    ? convertEmptyField(copyData[key], config)
                    : isEmpty(copyData[key])
            }
        }
    }

    // 当数据为基本数据类型时
    copyData = isEmpty(copyData)

    return copyData
}

