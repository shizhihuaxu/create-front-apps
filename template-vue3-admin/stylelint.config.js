module.exports = {
    extends: [
        'stylelint-config-standard', // 标准语法
        'stylelint-config-rational-order', // 属性顺序规范
    ],
    customSyntax: 'postcss-scss', // 处理 scss 语法
    overrides: [ // 校验 .vue/html 的样式
        {
            files: [ '**/*.{vue,html}' ],
            customSyntax: 'postcss-html',
        },
    ],
    rules: { // 自定义规则
        indentation: 4, // 缩进 4
        'string-quotes': 'single', // 单引号
        'at-rule-no-unknown': null, // 允许未知的 @规则, @mixin 和变量声明
        'selector-class-pattern': null, // 强制选择器类名的格式
        'import-notation': null, // 关闭强制转换为 @import url
        'selector-pseudo-class-no-unknown': [ // 深度选择器
            true,
            {
                ignorePseudoClasses: [ 'deep' ],
            },
        ],
        'function-no-unknown': [
            true,
            { ignoreFunctions: [ 'v-bind' ] },
        ],
    },
}
