<template>
    <el-dropdown trigger='click'>
        <div class='avatar'>
            <el-avatar :size='22' >
                <el-icon><user-filled /></el-icon>
            </el-avatar>
            <span class='username'>{{ userStore.username }}</span>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item>
                    <el-icon><User /></el-icon>个人信息
                </el-dropdown-item>
                <el-dropdown-item
                    @click='logout'
                    divided>
                    <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { LOGIN_URL } from '@/config'

const userStore = useUserStore()
const router = useRouter()

// 退出登录
const logout = () => {
    ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        router.replace(LOGIN_URL)
        ElMessage.success('退出登录成功！')
    })
}
</script>

<style scoped lang='scss'>
.avatar {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 12px;
    cursor: pointer;

    &:hover {
        background-color: rgb(0 0 0 / 2.5%);
    }

    :deep(.el-avatar) {
        vertical-align: middle;
    }

    .username {
        margin-left: 8px;
        font-size: 15px;
        vertical-align: middle;
    }
}
</style>

