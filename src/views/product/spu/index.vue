<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <el-button
        type="primary"
        icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
      >
        添加SPU
      </el-button>
      <el-table border style="margin: 10px 0px" :data="records">
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
        <el-table-column
          label="SPU描述"
          prop="description"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="SPU操作">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Plus"
              title="添加SKU"
            ></el-button>
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              title="修改SPU"
            ></el-button>
            <el-button
              type="info"
              size="small"
              icon="View"
              title="查看SKU列表"
            ></el-button>
            <el-popconfirm :title="`您确定删除“${row.spuName}”吗？`">
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="Delete"
                  title="删除SPU"
                ></el-button>
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
        :total="total"
        @current-change="getHasSpu"
        @size-change="changeSize"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useCatoryStore from '@/store/modules/category'
import { reqHasSpu } from '@/api/product/spu'
import type { HasSpuResponseData, Records } from '@/api/product/spu/type'

let categoryStore = useCatoryStore()
let scene = ref<number>(0) //card组件内容切换变量；0：table，1：添加与修改
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let records = ref<Records>([])
let total = ref<number>(0)

watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let res: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (res.code == 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}

const changeSize = () => {
  getHasSpu()
}
</script>

<style scoped></style>
