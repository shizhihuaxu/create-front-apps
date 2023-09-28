# create-front-apps		

1. 在开发、学习 `vue3` 项目过程中，搭建了多个 `vue3` 的项目开发模版

​		 [vue3-template](https://github.com/shizhihuaxu/vue3-template) 

​		 [vue3-admin](https://github.com/shizhihuaxu/vue3-admin)

便于在后续项目中复用，为了基于此模版快速创建项目，于是参照 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) 项目，搭建了一个创建项目的脚手架工具。

使用 npm:

```bash
# npm 6.x
npm create @szhxa/front-apps@latest app-name --template [vue3-ts][vue3-admin]

# npm 7+
npm create @szhxa/front-apps@latest app-name -- --template [vue3-ts][vue3-admin]
```

使用 yarn：

```bash
$ yarn create @szhxa/front-apps app-name --template [vue3-ts][vue3-admin]
```



`vue3-ts` 模版：

- 单元测试、mock 数据、国际化及其他vue3项目基础依赖的使用方法示例，不包含任何页面示例及功能逻辑处理示例；
  - node 版本管理：nvm 0.39.1
  - node版本：node 16.16.0
  - 包管理：yarn 1.22.19
  - 构建工具：vite 3.0.0
  - 框架：vue 3.2.37
  - 路由：Vue Router 4.1.3
  - 状态管理：Pinia 2.0.17
  - 请求库：axios 0.27.2
  - 类型检查：Typescript 4.6.4 
  - 代码风格：Eslint 8.20.0
  - 预处理器：SCSS（用于书写样式） + Less（用于配置主题） + StyleLint 14.9.1
  - 组件库：Element Plus 2.2.26
  - 图表：Echarts 5.3.3
  - 国际化：vue i18n 9.2.0
  - Mock数据 Mock.js 1.1.0 + vite-plugin-mock(mock 接口)
  - 单元测试：Jest 
  - E2E 测试：Cypress（TODO） 
  - commit：commitizen+Husky + Lint Staged + Commitlint

`vue3-admin` 模版：

- 无单元测试、mock 数据，封装了部分后台管理系统常用组件、hooks及其他常用工具功能处理示例；
  - node 版本管理：nvm 0.39.1
  - node版本：node 16.16.0
  - 包管理：yarn 1.22.19
  - 构建工具：vite 4.0.0
  - 框架：vue 3.2.45
  - 路由：Vue Router 4.1.3
  - 状态管理：Pinia 2.0.17 + pinia-plugin-persistedstate 持久化
  - 请求库：axios 0.27.2
  - 类型检查：Typescript 4.6.4 
  - 代码风格：Eslint 8.30.0
  - 预处理器：SCSS + StyleLint 14.9.1
  - 组件库：Element-Plus
  - commit：commitizen+Husky + Lint Staged + Commitlint
