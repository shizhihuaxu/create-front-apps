import type {  UserConfig } from 'vite'
import { loadEnv } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default ({ mode }): UserConfig => {
    const root = process.cwd()
    const env = loadEnv(mode, root)
    // const isDev = mode === 'development'

    return {
        base: env.VITE_APP_PUBLIC_PATH,
        plugins: [
            vue(),
            vueJsx(),
            eslint({ cache: false }),
            legacy({
                targets: [ 'defaults', 'not IE 11' ],
            }),
            AutoImport({
                // vue、vue-router 自动导入
                imports: [
                    'vue',
                    'vue-router',
                ],
                // element-plus 组件自动导入
                resolvers: [ ElementPlusResolver({ importStyle: 'sass' }) ],
                eslintrc: {
                    enabled: true,
                    filepath: './.eslintrc-auto-import.json',
                    globalsPropValue: true,
                },
            }),
            Components({
                // 自定义组件自动引入
                dirs: [ 'src/components' ],
                extensions: [ 'vue' ],
                // element-plus 组件自动导入
                resolvers: [ ElementPlusResolver({ importStyle: 'sass' }) ],
            }),
            // element-plus 样式自动导入，除部分组件
            ElementPlus({
                useSource: true,
            }),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src'),
            },
        },
        css: {
            devSourcemap: true,
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "@/styles/global/index.scss" as global;
                    `,
                },
            },
        },
        server: {
            open: true,
            host: true,
        },
    }
}
