<template>
    <el-drawer
        append-to-body
        :model-value='visible'
        :title='title'
        :size='width'
        :close-on-click-modal='false'
        :before-close='onClose'
        v-bind='$attrs'>
        <template
            #header='scope'
            v-if='$slots.header'>
            <slot
                name='header'
                v-bind='scope' />
        </template>
        <slot />
        <template
            #footer
            v-if='footer'>
            <slot name='footer'>
                <span>
                    <el-button @click='onClose'>取消</el-button>
                    <el-button
                        type='primary'
                        :loading='loading'
                        @click='onOk'>
                        确定
                    </el-button>
                </span>
            </slot>
        </template>
    </el-drawer>
</template>

<script setup lang='ts'>
interface IProps {
    visible: boolean
    title?: string // 标题
    width?: string | number // 宽度
    loading?: boolean // 是否加载中
    footer?: boolean // 是否显示 footer
}

withDefaults(defineProps<IProps>(), {
    title: '标题',
    width: '600px',
    loading: false,
    footer: true,
})
const emits = defineEmits([ 'update:visible', 'close', 'ok' ])

const onClose = () => {
    emits('update:visible', false)
    emits('close')
}

const onOk = () => {
    emits('ok')
}
</script>
