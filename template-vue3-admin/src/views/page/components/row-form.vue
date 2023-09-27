<template>
    <base-dialog
        :visible='visible'
        :title='title'
        :loading='loading'
        @ok='onOk'
        @close='onClose'>
        <el-form
            ref='formRef'
            :validate-on-rule-change='false'
            :model='formState'
            :rules='formRules'
            @submit.prevent>
            <el-form-item
                label='名称'
                prop='name'>
                <el-input
                    v-model='formState.name'
                    clearable
                    placeholder='请输入名称'
                    @keyup.enter='onOk' />
            </el-form-item>
        </el-form>
    </base-dialog>
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus'
import { OpsRowEnum } from '@/constants'
import { useForm } from '@/hooks/useForm'
import { getPageDetail, addPage, updatePage } from '@/services/page'

interface IProps {
    visible: boolean
    type: OpsRowEnum
    id?: Key
}

interface IFormState {
    name: string;
}

const props = defineProps<IProps>()
const emits = defineEmits([ 'update:visible', 'ok' ])

const { type } = toRefs(props)
const {
    formRef,
    loading,
    title,
    isUpdate,
} = useForm(type)

const formState = reactive<IFormState>({
    name: '',
})
const formRules = reactive<Form.FormRules>({
    name: [ { required: true, whitespace: true, message: '请输入名称' } ],
})

// 获取详情
const getDetail = () => {
    loading.value = true

    getPageDetail(props.id)
        .then((res) => {
            Object.keys(formState).forEach(key => {
                if (res[key] !== undefined) {
                    formState[key] = res[key]
                }
            })
        })
        .finally(() => {
            loading.value = false
        })
}

// 关闭
const onClose = () => {
    formRef.value.resetFields()
    emits('update:visible', false)
}

// 保存
const onOk = () => {
    formRef.value.validate((valid) => {
        if(valid) {
            const params = { ...formState }
            const apiMethod = isUpdate.value
                ? updatePage(props.id, params)
                : addPage(params)

            loading.value = true
            apiMethod
                .then(() => {
                    const msg = isUpdate.value ? '更新成功' : '添加成功'
                    ElMessage.success(msg)

                    onClose()
                    emits('ok')
                })
                .finally(() => {
                    loading.value = false
                })
        }
    })
}

watch(
    () => props.visible,
    (visible) => {
        if (!visible) return

        if(isUpdate.value) {
            title.value = '编辑页面'
            getDetail()
        }else {
            title.value = '添加页面'
        }
    },
)
</script>
