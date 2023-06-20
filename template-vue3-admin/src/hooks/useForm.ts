import { OpsRowEnum } from '@/constants'

// 表单常用功能
export const useForm = (opsType?: Ref<OpsRowEnum>) => {
    const formRef = ref<Form.FormInstance>()
    const loading = ref<boolean>(false)
    const title = ref<string>('')
    const isUpdate = computed<boolean>(() => opsType.value === OpsRowEnum.UPDATE)

    // 手动校验，form 无法在变化时校验
    const validField = (fieldName: string) => {
        formRef.value.validateField(fieldName)
    }

    return {
        formRef,
        loading,
        title,
        isUpdate,
        validField,
    }
}
