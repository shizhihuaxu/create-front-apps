<template>
    <div class='toolbar-left'>
        <slot />
    </div>
</template>

<style scoped lang='scss'>
.toolbar-left {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    white-space: nowrap;
}
</style>

