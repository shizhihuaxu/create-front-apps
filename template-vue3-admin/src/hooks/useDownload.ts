import { saveAs } from 'file-saver'
import { ElMessage } from 'element-plus'
import request from '@/services'

// 获取下载地址接口
export enum DownloadUrlEnum {
    VULN = '/module/download',
}

// 下载
export const useDownload = () => {
    // 获取文件名，下载
    const downloadUtil = (res) => {
        const contentType = res.headers?.['content-type'] || 'text/plain;charset=utf-8'
        const blob = new Blob([ res.data ], { type: contentType })

        const disposition = res.headers['content-disposition']
        const fileNameReg = /(filename\*=utf-8''|filename=)(.*)$/
        // 匹配出 filename\*=utf-8'' 或 filename= 后的内容，解码
        let fileName = fileNameReg.exec(disposition)?.[2] || 'download'
        fileName = fileName.replace(/"/g, '') // 删除掉 filename= 后的文件前后引号，避免下载错误
        const fileNameDecoded = decodeURIComponent(fileName)

        saveAs(blob, `${fileNameDecoded}`)
    }

    // 处理下载事件
    const handleDownload = (url: string, data: Record<string, any> = {}) => {
        ElMessage.success('开始下载')

        return request
            .get(
                url,
                {
                    action: 'download',
                    ...data,
                },
                {
                    headers: { Accept: '*/*' },
                    responseType: 'blob', // 返回二进制流 处理
                },
            )
            .then(res => {
                downloadUtil(res)
            })
            .catch(() => {
                ElMessage.error('下载失败')
            })
    }

    return {
        downloadUtil,
        handleDownload,
    }
}
