<template>
    <svg
        aria-hidden='true'>
        <use :xlink:href='`#${icon}`'></use>
    </svg>
</template>

<script setup lang='ts'>
interface IProps {
    icon: string // 例如 icon-robot， symbol 模式下显示的图标名称
}

defineProps<IProps>()
</script>
