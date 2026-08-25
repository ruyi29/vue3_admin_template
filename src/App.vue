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
</script>

<style scoped>
h1 {
  background-color: red;
}

.el-button {
  margin-bottom: 20px;
}
</style>
