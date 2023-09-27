// 按需引入图表
import * as echarts from 'echarts/core'

import {
    GridComponent,
    LegendComponent,
    LegendScrollComponent,
    TooltipComponent,
    TitleComponent,
} from 'echarts/components'

import {
    BarChart,
    LineChart,
    PieChart,
} from 'echarts/charts'

// 注意，新的接口中默认不再包含 Canvas 渲染器，需要显示引入，如果需要使用 SVG 渲染模式则使用 SVGRenderer
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
    // 基础组件
    GridComponent,
    LegendComponent,
    LegendScrollComponent,
    TooltipComponent,
    TitleComponent,
    // 基础图表
    BarChart,
    LineChart,
    PieChart,
    // 渲染器
    CanvasRenderer,
])

export default echarts
