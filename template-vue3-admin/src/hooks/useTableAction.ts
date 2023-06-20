import { OpsRowEnum } from '@/constants'
import { ElMessageBox } from 'element-plus'

// 列表操作，添加编辑
export const useTableAction = () => {
    // 单行操作
    const opsRow: {
        visible: boolean
        type: OpsRowEnum
        pk?: Key
        [key: string]: any
    } = reactive({
        visible: false,
        type: OpsRowEnum.ADD,
    })

    const handleOpsRow = (type: OpsRowEnum, item: { pk?: Key, [key: string]: any } = {}) => {
        Object.assign(opsRow, {
            visible: true,
            type,
            pk: item?.pk,
            ...item,
        })
    }

    return {
        OpsRowEnum,
        opsRow,
        handleOpsRow,
    }
}

// 二次确认，例如删除等
export const useActionQuery = (
    onOkCallback: (...args) => void,
    options?: {
        query?: string
        type?: 'success' | 'error' | 'info' | 'warning'
        title?: string
        okText?: string
        cancelText?: string
        cancelCallback?: (...args) => void
        closeCallback?: (...args) => void
    },
) => {
    const handleQuery = (...args) => {
        ElMessageBox.confirm(
            options?.query || '确定要删除选中的内容吗？',
            options?.title || '提示',
            {
                distinguishCancelAndClose: true,
                confirmButtonText: options?.okText || '确定',
                cancelButtonText: options?.cancelText || '取消',
                type: options?.type || 'warning',
            },
        ).then(() => {
            onOkCallback && onOkCallback(...args)
        }).catch((action) => {
            action === 'cancel'
                ? options?.cancelCallback?.(...args)
                : options?.closeCallback?.(...args)
        })
    }

    return {
        handleQuery,
    }
}
