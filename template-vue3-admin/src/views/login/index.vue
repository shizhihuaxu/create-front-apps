<template>
    <div>login</div>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/stores/modules/user'

// 重置所有用户数据
const userStore = useUserStore()
userStore.$reset()
</script>
