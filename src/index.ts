import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import spawn from 'cross-spawn'
import minimist from 'minimist'
import prompts from 'prompts'
import {
    blue,
    green,
    red,
    yellow,
    reset,
} from 'kolorist'

/**
 * 获取命令行参数，例如 yarn create vue3-apps my-appname --template vue3-ts
 * yarn create vue3-apps 相当于执行 package.json 中 bin 字段
 * 相当于 node create-vue3-apps my-appname --template vue3-ts
 * process.argv.slice(2) 的参数有
 * {
 *     _: ['my-appname'],
 *     template: 'vue3-ts
 * }
 */

// string 选项数组中的参数会被解析成字符串
const argv = minimist<{
    t?: string // 参数名称 template 的简写
    template?: string
}>(process.argv.slice(2), { string: ['_'] })
const cwd = process.cwd()

type ColorFunc = (str: string | number) => string
type Framework = {
    name: string
    display: string
    color: ColorFunc
    variants: FrameworkVariant[]
}
type FrameworkVariant = {
    name: string
    display: string
    color: ColorFunc
    customCommand?: string
}

const FRAMEWORKS: Framework[] = [
    {
        name: 'vue3',
        display: 'Vue3',
        color: green,
        variants: [
            {
                name: 'vue3-ts',
                display: 'TypeScript',
                color: blue,
            },
            {
                name: 'vue3-admin',
                display: 'Admin',
                color: yellow,
            },
        ],
    },
]

// 获取所有的模版名，name 字段，包含所有变体子项
const TEMPLATES = FRAMEWORKS.map(
    (f) => (f.variants && f.variants.map((v) => v.name)) || [f.name],
).reduce((a, b) => a.concat(b), [])

// 处理项目模版中文件名的问题
const renameFiles: Record<string, string | undefined> = {
    _gitignore: '.gitignore',
}

// 默认的项目名称
const defaultTargetDir = 'vue3-project'

async function init() {
    const argTargetDir = formatTargetDir(argv._[0])
    const argTemplate = argv.template || argv.t // --template 或 -t

    let targetDir = argTargetDir || defaultTargetDir

    // yarn create vue3-apps . -t vue3-ts
    // 如果项目名称写的是 . 符号，说明使用当前文件夹作为项目目录
    // path.resolve() 将返回当前工作目录的绝对路径
    // path.basename(path) 获取 path 最后的部分，在这里也就是当前工作目录的文件名
    const getProjectName = () =>
        targetDir === '.' ? path.basename(path.resolve()) : targetDir

    let result: prompts.Answers<
        'projectName' | 'overwrite' | 'packageName' | 'framework' | 'variant'
    >

    try {
        result = await prompts(
            [
                // 获取输入的项目名，同时会作为目录，为 null 会跳过此提示
                {
                    type: argTargetDir ? null : 'text',
                    name: 'projectName',
                    message: reset('Project name:'),
                    initial: defaultTargetDir,
                    onState: (state) => {
                        targetDir = formatTargetDir(state.value) || defaultTargetDir
                    },
                },
                // 检测输入的目录是否已存在，询问是否覆盖
                {
                    type: () =>
                        !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
                    name: 'overwrite',
                    message: () =>
                        (targetDir === '.'
                            ? 'Current directory'
                            : `Target directory "${targetDir}"`) +
                        ` is not empty. Remove existing files and continue?`,
                },
                // 目录已存在确认是否覆盖，选择不覆盖报错并退出，选择覆盖则继续
                {
                    type: (_, { overwrite }: { overwrite?: boolean }) => {
                        if (overwrite === false) {
                            throw new Error(red('✖') + ' Operation cancelled')
                        }
                        return null
                    },
                    name: 'overwriteChecker',
                },
                // isValidPackageName 校验文件名是否正确，不正确的话 toValidPackageName 进行转换，与用户确认
                {
                    type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
                    name: 'packageName',
                    message: reset('Package name:'),
                    initial: () => toValidPackageName(getProjectName()),
                    validate: (dir) =>
                        isValidPackageName(dir) || 'Invalid package.json name',
                },
                // 项目模板选择
                {
                    type:
                        argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
                    name: 'framework',
                    message:
                        typeof argTemplate === 'string' && !TEMPLATES.includes(argTemplate)
                            ? reset(
                                `"${argTemplate}" isn't a valid template. Please choose from below: `,
                            )
                            : reset('Select a framework:'),
                    initial: 0,
                    choices: FRAMEWORKS.map((framework) => {
                        const frameworkColor = framework.color
                        return {
                            title: frameworkColor(framework.display || framework.name),
                            value: framework,
                        }
                    }),
                },
                // 选择变种 js/ts
                {
                    type: (framework: Framework) =>
                        framework && framework.variants ? 'select' : null,
                    name: 'variant',
                    message: reset('Select a variant:'),
                    choices: (framework: Framework) =>
                        framework.variants.map((variant) => {
                            const variantColor = variant.color
                            return {
                                title: variantColor(variant.display || variant.name),
                                value: variant.name,
                            }
                        }),
                },
            ],
            {
                onCancel: () => {
                    throw new Error(red('✖') + ' Operation cancelled')
                },
            },
        )
    } catch (cancelled: any) {
        console.log(cancelled.message)
        return
    }

    // user choice associated with prompts
    const { framework, overwrite, packageName, variant } = result

    const root = path.join(cwd, targetDir)

    if (overwrite) {
        emptyDir(root)
    } else if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true })
    }

    // determine template
    let template: string = variant || framework?.name || argTemplate

    // 获取当前使用的是哪一个包管理器
    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
    const pkgManager = pkgInfo ? pkgInfo.name : 'npm'
    const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version.startsWith('1.')

    // 自定义执行命令
    const { customCommand } =
        FRAMEWORKS.flatMap((f) => f.variants).find((v) => v.name === template) ?? {}

    // 处理命令在不同包管理器下的兼容性问题
    if (customCommand) {
        const fullCustomCommand = customCommand
            .replace(/^npm create/, `${pkgManager} create`)
            // Only Yarn 1.x doesn't support `@version` in the `create` command
            .replace('@latest', () => (isYarn1 ? '' : '@latest'))
            .replace(/^npm exec/, () => {
                // Prefer `pnpm dlx` or `yarn dlx`
                if (pkgManager === 'pnpm') {
                    return 'pnpm dlx'
                }
                if (pkgManager === 'yarn' && !isYarn1) {
                    return 'yarn dlx'
                }
                // Use `npm exec` in all other cases,
                // including Yarn 1.x and other custom npm clients.
                return 'npm exec'
            })

        const [command, ...args] = fullCustomCommand.split(' ')
        // we replace TARGET_DIR here because targetDir may include a space
        const replacedArgs = args.map((arg) => arg.replace('TARGET_DIR', targetDir))
        const { status } = spawn.sync(command, replacedArgs, {
            stdio: 'inherit',
        })
        process.exit(status ?? 0)
    }

    console.log(`\nScaffolding project in ${root}...`)

    const templateDir = path.resolve(
        fileURLToPath(import.meta.url), // ...dist/index.mjs
        '../..',
        `template-${template}`,
    )

    // 一种情形是将内容写入目标路径，一种情形是将template-*文件夹下的文件复制到目标路径去
    const write = (file: string, content?: string) => {
        const targetPath = path.join(root, renameFiles[file] ?? file) // ?? 空值合并运算符
        if (content) {
            fs.writeFileSync(targetPath, content)
        } else {
            // 在这里将 _gitignore 复制到目标文件夹时，名称变为 .gitignore， 映射名称 file: renameFiles[file]
            copy(path.join(templateDir, file), targetPath)
        }
    }

    const files = fs.readdirSync(templateDir)
    for (const file of files.filter((f) => f !== 'package.json')) {
        write(file)
    }

    // 以下处理将项目名称写进 template-* package.json name 字段中
    const pkg = JSON.parse(
        fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
    )

    pkg.name = packageName || getProjectName()

    write('package.json', JSON.stringify(pkg, null, 2) + '\n')

    const cdProjectName = path.relative(cwd, root)
    console.log(`\nDone. Now run:\n`)
    if (root !== cwd) {
        console.log(
            `  cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
            }`,
        )
    }
    switch (pkgManager) {
        case 'yarn':
            console.log('  yarn')
            console.log('  yarn dev')
            break
        default:
            console.log(`  ${pkgManager} install`)
            console.log(`  ${pkgManager} run dev`)
            break
    }
    console.log()
}

// trim 并将结尾的所有 / 符号去掉
function formatTargetDir(targetDir: string | undefined) {
    return targetDir?.trim().replace(/\/+$/g, '')
}

// 复制文件
function copy(src: string, dest: string) {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
        copyDir(src, dest)
    } else {
        fs.copyFileSync(src, dest)
    }
}

// 复制文件夹
function copyDir(srcDir: string, destDir: string) {
    fs.mkdirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file)
        const destFile = path.resolve(destDir, file)
        copy(srcFile, destFile)
    }
}

// 判断是否为合法的文件名
function isValidPackageName(projectName: string) {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName,
    )
}

// 处理为合法的文件名
function toValidPackageName(projectName: string) {
    return projectName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-') // 空格替换为 -
        .replace(/^[._]/, '') // 以 . 或 _ 开头
        .replace(/[^a-z\d\-~]+/g, '-') // ^ 在字符集合模式 [] 中时，反向字符集，匹配任何没有包含在方括号中的字符
}

// 判断文件文件夹是否为空，忽略对 .git 文件的 处理
function isEmpty(path: string) {
    const files = fs.readdirSync(path)
    return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

// 清空文件夹，忽略对 .git 文件的 处理
function emptyDir(dir: string) {
    if (!fs.existsSync(dir)) {
        return
    }
    for (const file of fs.readdirSync(dir)) {
        if (file === '.git') {
            continue
        }
        fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
    }
}

// 获取当前使用的包管理器名称和版本
function pkgFromUserAgent(userAgent: string | undefined) {
    if (!userAgent) return undefined
    const pkgSpec = userAgent.split(' ')[0]
    const pkgSpecArr = pkgSpec.split('/') // yarn/1.22.19
    return {
        name: pkgSpecArr[0],
        version: pkgSpecArr[1],
    }
}

init().catch((e) => {
    console.error(e)
})