<template>
    <md-editor
        :editor-id='editorId'
        :model-value='modelValue'
        :sanitize='sanitize'
        :preview-only='previewOnly'
        :preview='preview'
        :toolbars-exclude='toolbarsExclude'
        :footers='[]'
        :style='{
            height: height
        }'
        preview-theme='github'
        @on-change='onChange'
        @on-upload-img='onUploadImg'
    />
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus'
import MdEditor, { ToolbarNames } from 'md-editor-v3'
import DOMPurify from 'dompurify'
import http from '@/services'
import 'md-editor-v3/lib/style.css'

interface IProps {
    modelValue: string
    preview?: boolean
    previewOnly?: boolean
    height?: string
}

withDefaults(defineProps<IProps>(), {
    preview: false,
    previewOnly: false,
    height: '250px',
})
const emits = defineEmits([ 'update:modelValue', 'change' ])

// 使用组件唯一 id 生成编辑器唯一 id，防止编辑器互相影响
const editorId = `md-editor-${getCurrentInstance().uid}`

// 不显示的工具
const toolbarsExclude: ToolbarNames[] = [
    'sub',
    'sup',
    'mermaid',
    'katex',
    'save',
    '=',
    'pageFullscreen',
    'htmlPreview',
    'catalog',
    'github',
    'prettier',
]

// 只在做为 html 展示的时候去过滤非代码块（code 标签包裹）中的内容，不在保存时处理
const sanitize = (html) => DOMPurify.sanitize(html)

const onChange = (val: string) => {
    emits('update:modelValue', val)
    emits('change') // 用于表单校验自动校验
}

const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
        files.map((file: File) => {
            return new Promise((resolve) => {
                const form = new FormData()
                form.append('file', file)

                if (file.size > 5 * 1024 * 1024) {
                    ElMessage.error('图片大小不超过 5M')
                    return
                }

                http
                    .post('/module/reports/img', form, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then((res) => resolve(res))
            })
        }),
    )

    callback(res.map((item) => item.data))
}
</script>

<style scoped lang='scss'>
:deep(.md-editor-content .md-editor-preview) {
    font-size: var(--el-font-size-base);
    line-height: 1.5;
}
</style>
