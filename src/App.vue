<template>
  <div>
    <h1>What's up</h1>
    <el-button type="primary" size="default" :icon="Plus" @click="">
      我是一个按钮
    </el-button>
    <el-pagination
      :page-sizes="[100, 200, 300, 400]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    />
    <Test>123</Test>
    <!-- 测试svg图标 -->
    <svg style="width: 50px; height: 50px">
      <use xlink:href="#icon-grape"></use>
    </svg>
    <!-- 使用SvgIcon组件 -->
    <svg-icon name="grape" width="50px" height="50px" color="blue"></svg-icon>
    <svg-icon name="test" width="50px" height="50px" color="red"></svg-icon>
    <pagination></pagination>
  </div>
</template>

<script setup lang="ts">
//引入图标组件
import { Plus } from '@element-plus/icons-vue'
import Test from '@/components/Test.vue'
import { onMounted } from 'vue'
import { reqLogin, reqUserInfo } from './api/user'

onMounted(() => {
  // 包一层async函数
  async function loadData() {
    // 1.登录
    const loginRes = await reqLogin({ username: 'admin', password: '111111' })
    console.log('登录结果：', loginRes)
    localStorage.setItem('token', loginRes.data.token)
    // 2.获取用户信息，记得加 () 执行函数
    const userRes = await reqUserInfo()
    console.log('用户信息：', userRes)
  }

  loadData()
})
</script>

<style scoped lang="scss">
div {
  h1 {
    background-color: $base-color;
  }
}
.el-button {
  margin-bottom: 20px;
}
</style>
