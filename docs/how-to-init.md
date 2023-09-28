[TOC]

##### 1 搭建步骤

1. 使用 yarn 初始化项目信息，如果想发布以 用户 为 `scope` 的公开包，`package.json` 中的 `name` 字段的包名增加 `@用户名` 为前缀；

   ```bash
   yarn init
   ```

   

2. 将项目模版 [vue3-template](https://github.com/shizhihuaxu/vue3-template) **去除以下文件**的所有文件放入到模版文件夹 `template-vue3-ts  ` 中：

   ```
   .git
   node_modules
   dist
   ```

   

3. 将模版文件夹 `template-vue3-ts` 中的 `.gitignore` 文件重命名为 `_gitignore` ，避免对当前仓库产生影响；

4. 在 `package.json` 中新增 `bin` 配置，增加安装命令到对应执行文件的映射；

   ```json
   "bin": {
       "create-front-apps": "index.js",
   },
   ```

   

5. 增加处理安装命令的执行文件 `index.js`；

   ```
   下面这行表示为可执行的文件
   #!/usr/bin/env node
   
   // 执行 build 出来的文件
   import './dist/index.mjs'
   ```

   

6. 增加  `src/index.ts` 文件处理项目初始化逻辑，模版文件夹的名称为 `template-[模版选项名称]`

7. 使用打包工具 [unbuild](https://github.com/unjs/unbuild) 打包，`build.config.ts` 打包配置

   

##### 2 使用 yarn link 本地调试

1. 进入 `create-front-apps` 项目开发根目录中执行一下命令，会在全局的 `.yarn/bin`下生成对应的可执行文件软链

   ```
   yarn link
   ```

   

2. 然后在任意位置直接运行以下命令创建项目

   ```bash
   # 注意本地调试产生的link 是不带 scope 的
   yarn exec create-front-apps appname -- --template vue3-ts 
   ```



3. `Permission denied` 修改可执行文件的权限，在 `create-front-apps` 项目中执行

   ```bash
   chmod +x ./index.js
   ```

   

4. 取消链接，进入 `create-front-apps` 项目开发根目录中执行一下命令

   ```bash
   yarn unlink
   ```

   

##### 3 发布到 npm上

1. [注册 npm 账号](https://www.npmjs.com/signup)

2. 在 package.json 指定 files 字段

3. 发布流程

   ```
   yarn login 登录 
   yarn publish --access public 发布 scope 包，会执行项目中一系列跟发布相关的命令
   ```

   

4. 发布报错 [FORBIDDEN] Public registration is not allowed

   问题原因：配置了项目的镜像，去除镜像配置即可

   

5. 发布报错 You do not have permission to publish

   问题原因：包名重复，修改包名即可

   

6. 更新版本

   ```
   yarn version xxx 更改版本号
   yarn publish 发布
   ```

7. 同时可以将代码仓库放在 github 上，并保证 package.json 的版本与仓库的 tag 一致

8. 修改版本号

   ```
   // patch：补丁号，修复bug，小变动，如 v1.0.0->v1.0.1
   yarn version patch
   
   // minor：次版本号，增加新功能，如 v1.0.0->v1.1.0
   yarn version minor
   
   // major：主版本号，不兼容的修改，如 v1.0.0->v2.0.0
   yarn version major
   ```

6. 退出登录

   ```
   yarn logout
   ```

   

##### 4 发布后如何使用

1. 全局安装（使用 create 命令时也会自动安装，可不执行此步骤）

   ```
   yarn global add @szhxa/create-front-apps 
   ```

2. 创建项目

   ```
   yarn create @szhxa/front-apps appname --template vue3-ts
   
   // yarn create @szhxa/front-apps 相当于 
   yarn exec @szhxa/create-front-apps // 会执行  package.json 中 bin 的内容
   
   按照提示，安装依赖并运行即可
   yarn 
   yarn dev
   ```




##### 5 其它命令

```
yarn global list --depth=0 # 查看全局包
yarn global remove @szhxa/create-front-apps # 移除全局安装的包
```

