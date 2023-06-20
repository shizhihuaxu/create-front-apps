<template>
    <el-dialog
        :model-value='visible'
        :title='title'
        :destroy-on-close='true'
        width='580px'>
        <el-form>
            <el-form-item
                v-if='downloadUrl'
                label='模板下载'>
                <el-button
                    type='primary'
                    @click='onDownload'>
                    <el-icon class='el-icon--left'><download /></el-icon>
                    点击下载
                </el-button>
            </el-form-item>
            <el-form-item label='文件上传'>
                <el-upload
                    v-model:file-list='fileList'
                    action='fake string'
                    style='width: 100%;'
                    :auto-upload='false'
                    :drag='true'
                    :show-file-list='true'
                    :accept='FILE_TYPE_CONFIG[fileType].accept'
                    :on-change='onChange'
                    v-bind='$attrs'>
                    <el-icon class='el-icon--upload'><upload-filled /></el-icon>
                    <div class='el-upload__text'>将文件拖到此处，或<em>点击上传</em></div>
                    <template #tip>
                        <div class='el-upload__tip'>
                            请上传 {{ FILE_TYPE_CONFIG[fileType].accept }} 标准格式文件，文件大小不超过 {{ fileSize }} MB
                        </div>
                        <div class='el-upload__tip'>
                            {{ $attrs.tips }}
                        </div>
                    </template>
                </el-upload>
            </el-form-item>
            <el-form-item
                v-if='queryBackup'
                label='数据备份'>
                <el-switch v-model='isBackup'/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click='onCancel'>取消</el-button>
            <el-button
                type='primary'
                :loading='loading'
                @click='onOk'>
                确定
            </el-button>
        </template>
    </el-dialog>
</template>

<script lang='ts'>
export default {
    inheritAttrs: false,
}
</script>

<script setup lang='ts'>
import type { UploadUserFile, UploadFile, UploadFiles } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useDownload } from '@/hooks/useDownload'
import type { TUploadFile } from './typing'

interface IProps {
    title: string // 对话框标题
    visible: boolean // 是否显示上传对话框
    downloadUrl?: string // 下载文件的 url
    maxCount?: number // 最大上传文件数量
    fileType?: TUploadFile // 文件类型
    fileSize?: number // 数据大小限制，单位 MB
    loading?: boolean // 是否加载中，确定按钮禁用
    queryBackup?: boolean // 是否有提示数据备份的选项
}

const props = withDefaults(defineProps<IProps>(), {
    downloadUrl: '',
    maxCount: 1,
    fileType: 'zip',
    fileSize: 5,
    loading: false,
    queryBackup: false,
})
const emits = defineEmits([ 'update:visible', 'download', 'upload' ])

// 不同类型的文件配置
const FILE_TYPE_CONFIG = {
    excel: {
        accept: '.xlsx', // 遵从MIME_type写法，多个使用英文逗号分隔
    },
    zip: {
        accept: '.zip',
    },
}

const isBackup = ref(true)
const fileList = ref<UploadUserFile[]>([]) // 文件列表

// 下载模版
const {
    handleDownload,
} = useDownload()

const onDownload = () => {
    handleDownload(props.downloadUrl)
}

// 手动根据数量限制设置最终文件，并校验
const onChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    const ext = uploadFile.name.split('.').pop()
    const supportType = FILE_TYPE_CONFIG[props.fileType].accept
    // 获取支持的文件类型组成的数组，使用逗号分割，去除扩展名前的点号
    const supportTypeArr = supportType?.split(',').map(item => item.replace('.', ''))

    if (supportTypeArr.indexOf(ext) === -1) {
        ElMessage.error(`上传文件格式非${supportType}`)
        fileList.value = uploadFiles.slice(0, -1)
    } else if (uploadFile.size > 1024 * 1024 * props.fileSize) {
        ElMessage.error(`文件大小超过 ${props.fileSize}M`)
        fileList.value = uploadFiles.slice(0, -1)
    }else {
        fileList.value = uploadFiles.slice(-props.maxCount)
    }
}

// 取消
const onCancel = () => {
    fileList.value = []

    emits('update:visible', false)
}

// 确定
const onOk = () => {
    if (!fileList.value.length) {
        ElMessage.error('您还未选择任何文件')
        return
    }

    const formData = new FormData()
    props.queryBackup ? formData.append('backup', isBackup.value ? '1' : '0') : '' // 只能追加字符串类型的值

    fileList.value.forEach(file => {
        formData.append('file', file.raw)
    })

    emits('upload', formData)
}
</script>
