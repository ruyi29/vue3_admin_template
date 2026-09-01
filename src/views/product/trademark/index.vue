<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" @click="addTrademark" icon="Plus">
      添加品牌
    </el-button>
    <!-- 展示表格 -->
    <el-table style="margin: 10px 0px" border>
      <el-table-column
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column label="品牌名称"></el-table-column>
      <el-table-column label="品牌Logo"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="400"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
//分页器相关数据
const currentPage4 = ref<number>(1) //当前页码
const pageSize4 = ref<number>(3) //每页条数

const addTrademark = () => {
  console.log('添加品牌')
}
</script>

<style scoped></style>
