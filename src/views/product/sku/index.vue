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
          <el-button
            size="small"
            type="info"
            icon="InfoFilled"
            @click="findSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`您确定要删除“${row.skuName}”吗?`"
            @confirm="deleteSku(row.id)"
            width="200px"
          >
            <template #reference>
              <el-button size="small" type="danger" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
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
    <!-- 抽屉展示商品详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
              style="margin-right: 5px; margin-bottom: 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
              style="margin-right: 5px; margin-bottom: 5px"
            >
              {{ item.saleAttrName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel
              :interval="4000"
              type="card"
              height="200px"
              indicator-position="outside"
            >
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
  reqDeleteSku,
} from '@/api/product/sku/index'
import type {
  SkuResponseData,
  SkuData,
  SkuInfoData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(2)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
let drawer = ref<boolean>(false) //控制抽屉的显示与隐藏
let skuInfo = ref<any>({})

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
const findSku = async (row: SkuData) => {
  drawer.value = true
  let res: SkuInfoData = await reqSkuInfo(row.id as number)
  skuInfo.value = res.data
  console.log(skuInfo.value)
}
const deleteSku = async (id: number) => {
  let res = await reqDeleteSku(id)
  if (res.code == 200) {
    ElMessage.success('删除SKU成功')
    getHasSku(pageNo.value)
  } else {
    ElMessage.error('删除SKU失败')
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
