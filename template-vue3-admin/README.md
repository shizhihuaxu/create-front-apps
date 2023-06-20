## 技术选型

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



## 注意

- 需安装 `node 16.x` 及以上版本；

- `vcode(目前使用的是 1.70.2 这个版本，其他版本有问题可以更新一下看，不同版本配置可能稍有不同)`  中安装 `Eslint` 插件可以保存时修复问题；安装 `Voldar` 插件支持 `vue3` 代码高亮及语法提示 ；

- `Vue Language Features (Volar)`  插件使用 `1.4.4`，`TypeScript Vue Plugin (Volar)` 插件使用 `1.4.4` `vscode/settings/json` 中的 ` "typescript.tsdk": "node_modules/typescript/lib"` 配置保证 ts 类型校验一致性；

  

## 运行

```bash
# 本地运行
yarn dev

# 打包
yarn build

# build 后预览
yarn build
yarn preview

# lint js
yarn lint:eslint

# lint css
yarn lint:style

# 单元测试
yarn test:unit
```



## 提交代码

```bash
# 安装 commit 工具
yarn global add commitizen

git add .

# 使用 cz 代替 git commit
git cz 
```



## 项目说明

#### 代码规范

1. 参见 `/docs/code-spec.md` 文档

