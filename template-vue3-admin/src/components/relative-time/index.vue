<template>
    <el-tooltip :content='time'>
        <span>{{ timeShow }}</span>
    </el-tooltip>
</template>

<script setup lang='ts'>
import { EMPTY_STR } from '@/constants'
import { dateFormat, dateFromNow } from '@/utils/common'

interface IProps {
    time: string
    type?: 'relative'| 'date'| 'datetime'
}

const props = withDefaults(defineProps<IProps>(), {
    type: 'relative',
})

const timeShow = ref('')

// 设置显示的时间
const setTime = () => {
    // 处理列表数据被转换为横线的情况
    if (props.time === EMPTY_STR) {
        timeShow.value = props.time
        return
    }

    // 时间范围划分标准 https://day.js.org/docs/zh-CN/display/from-now#list-of-breakdown-range
    if (props.type === 'relative') {
        timeShow.value = dateFromNow(props.time)
    } else if (props.type === 'datetime') {
        timeShow.value = dateFormat(props.time, 'YYYY-MM-DD HH:mm:ss')
    } else if (props.type === 'date') {
        timeShow.value = dateFormat(props.time, 'YYYY-MM-DD')
    }
}

watch(
    () => props.time,
    () => {
        setTime()
    },
    { immediate: true },
)
</script>
