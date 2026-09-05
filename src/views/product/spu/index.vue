<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <el-button type="primary" icon="Plus">添加SPU</el-button>
      <el-table border style="margin: 10px 0px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="SPU名称"
          width="120px"
          prop="spuName"
        ></el-table-column>
        <el-table-column label="SPU描述"></el-table-column>
        <el-table-column label="SPU操作">
          <template #="{ row }">
            <el-button type="primary" size="small" icon="Edit"></el-button>
            <el-popconfirm title="您确定删除该SPU吗？">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="400"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let scene = ref<number>(0) //card组件内容切换变量；0：table，1：添加与修改
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
</script>

<style scoped></style>
