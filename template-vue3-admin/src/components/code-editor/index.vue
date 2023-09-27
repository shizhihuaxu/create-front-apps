<template>
    <v-ace-editor
        :value='value'
        :lang='lang'
        :theme='theme'
        :printMargin='false'
        :wrap='true'
        :options='{
            tabSize: 2,
            fontSize: 14,
            useWorker: true
        }'
        :style='{
            height: height,
            width: "100%",
        }'
        @update:value='update'
    />
</template>

<script setup lang='ts'>
import { VAceEditor } from 'vue3-ace-editor'
import ace from 'ace-builds'
// worker
import workerBaseUrl from 'ace-builds/src-noconflict/worker-base?url'
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url'
import workerHtmlUrl from 'ace-builds/src-noconflict/worker-html?url'
// mode
import modeJsonUrl from 'ace-builds/src-noconflict/mode-json?url'
import modeSqlUrl from 'ace-builds/src-noconflict/mode-sql?url'
import modeHtmlUrl from 'ace-builds/src-noconflict/mode-html?url'
import modePythonUrl from 'ace-builds/src-noconflict/mode-python?url'
// theme
import themeMonokaiUrl from 'ace-builds/src-noconflict/theme-monokai?url'
import type { CodeLang, CodeTheme } from './typing'

interface IProps {
    value: string
    lang?: CodeLang
    theme?: CodeTheme
    height?: string
}

withDefaults(defineProps<IProps>(), {
    lang: 'sql',
    theme: 'monokai',
    height: '150px',
})
const emits = defineEmits([ 'update:value', 'change' ])

// worker
ace.config.setModuleUrl('ace/mode/base_worker', workerBaseUrl)
ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl)
ace.config.setModuleUrl('ace/mode/html_worker', workerHtmlUrl)
// mode
ace.config.setModuleUrl('ace/mode/json', modeJsonUrl)
ace.config.setModuleUrl('ace/mode/sql', modeSqlUrl)
ace.config.setModuleUrl('ace/mode/html', modeHtmlUrl)
ace.config.setModuleUrl('ace/mode/python', modePythonUrl)
// theme
ace.config.setModuleUrl('ace/theme/monokai', themeMonokaiUrl)

// 内容变化
const update = (val: any) => {
    emits('update:value', val)
    emits('change') // 用于表单校验自动校验
}
</script>
