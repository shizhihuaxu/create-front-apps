<template>
    <span class='base-copy'>
        <span
            v-if='$slots.default'
            :class='{
                "ellipsis": ellipsis,
                "content": true
            }'>
            <slot />
        </span>
        <el-tooltip
            :content='copied ? "复制成功" : "复制"'
            placement='top'
            :disabled='!tooltip'>
            <el-icon
                v-if='!copied'
                class='icon-copiable'
                @click='copy(content)'><copy-document /></el-icon>
            <el-icon
                v-else
                class='icon-copied'><check /></el-icon>
        </el-tooltip>
    </span>
</template>

<script setup lang='ts'>
import { useClipboard } from '@vueuse/core'

interface IProps {
    content?: string // copy 的内容
    tooltip?: boolean // 是否显示 tooltip
    ellipsis?: boolean // 是否超出容器宽度溢出隐藏
}

withDefaults(defineProps<IProps>(), {
    tooltip: true,
    ellipsis: false,
})

const { copy, copied } = useClipboard()
</script>

<style scoped lang='scss'>
.base-copy {
    overflow-wrap: break-word;
    cursor: pointer;

    .content {
        margin-right: 6px;
        vertical-align: middle;

        &.ellipsis {
            display: inline-block;
            max-width: calc(100% - 28px); // width 14 + padding 4*2 + mr 6
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
        }
    }

    .icon-copiable,
    .icon-copied {
        padding: 4px; // 增加热区
        vertical-align: middle;
    }

    .icon-copiable {
        color: var(--el-color-primary);
    }

    .icon-copied {
        color: var(--el-color-success);
    }
}
</style>
