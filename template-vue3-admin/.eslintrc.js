module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parser: 'vue-eslint-parser', // 指定解析器
    parserOptions: { // 优先级低于 parse 的语法解析配置
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: [
        'vue',
        '@typescript-eslint',
    ],
    // 避免 .vue 文件中使用全局 ts 类型报错
    overrides: [
        {
            files: [ '*.vue' ],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
    rules: {
        // https://github.com/eslint/eslint/issues/13956
        indent: 'off',
        '@typescript-eslint/indent': [
            'error',
            4,
            {
                SwitchCase: 1, // switch case 添加一个单位缩进
            },
        ],
        quotes: [
            'error',
            'single',
        ],
        'quote-props': [ 'error', 'as-needed' ], // 对象属性在必要时才加引号
        semi: [
            'error',
            'never',
        ],
        'comma-dangle': [ 'warn', 'always-multiline' ], // 对象、数组等最后一个元素使用尾逗号
        'comma-spacing': [ 'error', { before: false, after: true } ], // 逗号后加空格
        'prefer-template': 'error', // 优先使用字符串模板
        // 对象、函数、数组、操作符 前后空格
        'space-infix-ops': 'error',
        'space-before-function-paren': [ 'warn', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'object-curly-spacing': [ 'error', 'always' ],
        'arrow-spacing': [ 'error', { before: true, after: true } ],
        // NOTE 解决 ts 函数重载
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        // NOTE 解决 ts 类型声明参数名称未使用的问题
        'no-unused-vars': [ 'off' ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        'vue/multi-word-component-names': 'off', // 允许单个单词的组件名
        'vue/mustache-interpolation-spacing': 'error', // 插值双花括号和内容之间需要有空格
        'vue/multiline-html-element-content-newline': 'error', // 标签包裹的内容独占一行
        'vue/component-name-in-template-casing': [ // 模板中组件名称使用 kebab-case 模式
            'error',
            'kebab-case',
            {
                registeredComponentsOnly: true,
                ignores: [],
            },
        ],
        'vue/html-quotes': [ // vue 模版单引号
            'error',
            'single',
            {
                avoidEscape: true,
            },
        ],
        // NOTE 关闭 vscode/setting.json 的 editor.formatOnSave 属性，否则格式化后又会还原
        'vue/max-attributes-per-line': [ // 属性换行，每个属性一行
            'error',
            {
                singleline: 1,
                multiline: 1,
            },
        ],
        'vue/first-attribute-linebreak': [ // 属性换行，第一个属性独占一行
            'error',
            {
                singleline: 'ignore',
                multiline: 'below',
            },
        ],
        'vue/html-indent': [ // 属性换行，缩进配置
            'error',
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: false,
                ignores: [],
            },
        ],
    },
}
