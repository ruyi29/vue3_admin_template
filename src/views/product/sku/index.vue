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
        <template #>
          <el-button size="small" type="info" icon="Top"></el-button>
          <el-button size="small" type="primary" icon="Edit"></el-button>
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
import { reqSkuList } from '@/api/product/sku/index'
import type { SkuResponseData, SkuData } from '@/api/product/sku/type'

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
</script>

<style scoped></style>
