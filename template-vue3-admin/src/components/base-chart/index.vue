<template>
    <div ref='echartRef' />
</template>

<script setup lang='ts'>
import type { ECBasicOption } from 'echarts/types/dist/shared'
import { useDebounceFn } from '@vueuse/core'
import { addListener, removeListener } from 'resize-detector'
import echarts from './echarts'

interface IProps {
    option: ECBasicOption
}

const props = defineProps<IProps>()

// dom ref
const echartRef = ref<HTMLElement>()

// 图表实例
type ECharts = ReturnType<typeof echarts.init>
let chart: ECharts = null

// 响应式
const resizeChart = () => {
    chart?.resize()
}

const resize = useDebounceFn(resizeChart, 500)

// 初始化图表
const initChart = () => {
    disposeChart()
    if (echartRef.value) {
        chart = echarts.init(echartRef.value)
        chart.setOption(props.option)
        addListener(echartRef.value, resize)
    }
}

// 销毁实例
const disposeChart = () => {
    if (echartRef.value) {
        removeListener(echartRef.value, resize)
    }
    chart?.dispose()
    chart = null
}

onMounted(() => {
    watch(
        () => props.option,
        () => {
            chart?.setOption(props.option, true)
        },
        { flush: 'post' },
    )
    initChart()
})

onUnmounted(() => {
    disposeChart()
})
</script>
