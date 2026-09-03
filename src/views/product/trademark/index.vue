<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" @click="addTrademark" icon="Plus">
      添加品牌
    </el-button>
    <!-- 展示表格 -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <!-- table-column:默认展示数据用div，不想用div的话就用插槽 -->
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌Logo">
        <template #="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #>
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="danger" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark/index'
import type {
  Records,
  TrademarkResponseData,
} from '@/api/product/trademark/type'
//分页器相关数据
let pageNo = ref<number>(1) //当前页码
let limit = ref<number>(3) //每页条数
let total = ref<number>(0) //总条数
let trademarkArr = ref<Records>([]) //存储已有品牌的数据
//获取品牌列表接口
const getHasTrademark = async () => {
  let res: TrademarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (res.code == 200) {
    total.value = res.data.total
    trademarkArr.value = res.data.records
  } else {
    console.log('获取品牌列表失败', res.message)
  }
}
//组件挂载后调用获取品牌列表接口
onMounted(() => {
  getHasTrademark()
})

const addTrademark = () => {
  console.log('添加品牌')
}
</script>

<style scoped></style>
