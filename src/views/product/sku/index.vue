<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="150px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="默认图片" width="150px">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" width="100px" height="100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        width="150px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row }">
          <el-button
            size="small"
            :type="row.isSale == 1 ? 'info' : 'success'"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            size="small"
            type="primary"
            icon="Edit"
            @click="updateSku"
          ></el-button>
          <el-button size="small" type="info" icon="InfoFilled"></el-button>
          <el-button size="small" type="danger" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[2, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    ></el-pagination>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqSaleSku, reqCancelSale } from '@/api/product/sku/index'
import type { SkuResponseData, SkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(2)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])

onMounted(() => {
  getHasSku()
})
const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let res: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (res.code == 200) {
    total.value = res.data.total
    skuArr.value = res.data.records
  }
}
const handler = () => {
  getHasSku()
}
//商品的上架与下架
const updateSale = async (row: SkuData) => {
  if (row.isSale == 1) {
    await reqCancelSale(row.id as number)
    ElMessage.success('下架成功')
    getHasSku(pageNo.value)
  } else {
    console.log(111)
    let res = await reqSaleSku(row.id as number)
    console.log(res)
    ElMessage.success('上架成功')
    getHasSku(pageNo.value)
  }
}
const updateSku = () => {
  ElMessage.success('程序员在努力地更新中')
}
</script>

<style scoped></style>
