<!-- 这里是一次性加载 LayoutComponents -->
<template>
    <component :is='LayoutComponents["vertical"]' />
</template>

<script setup lang="ts" name="layout">
import LayoutVertical from './layout-vertical/index.vue'

const LayoutComponents: { [key: string]: Component } = {
    vertical: LayoutVertical,
}
</script>

<style scoped lang='scss'>
.layout {
    min-width: 760px;
}
</style>
