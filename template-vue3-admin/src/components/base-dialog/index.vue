<template>
    <el-dialog
        align-center
        append-to-body
        :model-value='visible'
        :title='title'
        :width='width'
        :close-on-click-modal='false'
        :before-close='onClose'
        v-bind='$attrs'>
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
    </el-dialog>
</template>

<script setup lang='ts'>
interface IProps {
    visible: boolean
    title: string
    width?: string | number
    loading?: boolean
    footer?: boolean // 是否显示 footer
}

withDefaults(defineProps<IProps>(), {
    width: '520px',
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
