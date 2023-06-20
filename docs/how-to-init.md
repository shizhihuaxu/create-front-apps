[TOC]

##### 1 搭建步骤

1. 使用 yarn 初始化项目信息

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

   

6. 增加  `src/index.ts` 文件处理项目初始化逻辑

7. 使用打包工具 [unbuild](https://github.com/unjs/unbuild) 打包，`build.config.ts` 打包配置



##### 2 尝试使用 yalc 调试

1. 安装 yalc

   ```
   yarn global add yalc
   ```

2. 在发布的项目目录下执行项目发布命令，此命令会执行项目中的一系列发布相关的命令

   ```
   yalc publish
   ```

3. 发布修改内容

   ```
   yalc publish --push
   yalc push // 简写
   ```

4. 在使用的目标项目添加此依赖，此处为全局使用

   ```
   yalc add create-front-apps // 添加依赖
   
   yalc update create-front-apps // 更新依赖
   ```

5. 在项目中移除依赖

   ```
   yalc remove create-front-apps
   或者
   yalc remove --all 
   ```

6. 清空发布此依赖

   ```
   yalc installations clean create-front-apps
   ```



##### 3 使用 yalc 调试问题及最终方案

1. 首先需要 `yarn init` 初始化一个项目后才能使用 `yalc add` 添加依赖，但是我们的创建项目不需要本身存在一个项目；

2. 为了测试使用，仍然创建了一个简易的项目名为 test，使用 yalc 添加 `create-front-apps`依赖后，发现 `node_modules` 下没有生成` .bin` 目录来映射 `create-front-apps` 中 `package.json` 中的 `bin` 字段执行文件，[查看此 issues](https://github.com/wclr/yalc/issues/156)；

3. 所以目前还是使用 `yarn link` 的方式调试较好，`yalc` 比较适合用来安装项目的子依赖，而不是全局的可执行依赖。

   

##### 4 使用 yarn link

1. 进入 `create-front-apps` 项目中执行一下命令，会在全局的 `.yarn/bin`下生成对应的可执行文件软链

   ```
   yarn link
   ```

   

2. 然后像全局安装了依赖一样，直接运行以下命令创建项目

   ```
   yarn create front-apps appname --template vue3-ts
   ```



3. `Permission denied` 修改可执行文件的权限，在 `create-front-apps` 项目中执行

   ```
   chmod +x ./index.js
   ```

4.  取消链接，进入 `create-front-apps` 项目中执行一下命令

   ```
   yarn unlink
   ```

   

##### 5 如何发布到 npm上

1. [注册 npm 账号](https://www.npmjs.com/signup)

2. 在 package.json 指定 files 字段

3. 发布流程

   ```
   yarn login 登录 
   yarn publish 发布，会执行项目中一系列跟发布相关的命令
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

   

##### 6 发布后如何使用

1. 全局安装

   ```
   yarn global add create-front-apps 
   ```

2. 创建项目

   ```
   yarn create front-apps appname --template vue3-ts
   
   // yarn create front-apps 相当于 
   yarn exec create-front-apps // 会执行  package.json 中 bin 的内容
   
   按照提示，安装依赖并运行即可
   yarn 
   yarn dev
   ```

   