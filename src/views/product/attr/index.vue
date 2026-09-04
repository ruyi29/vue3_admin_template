<template>
  <Category></Category>
  <el-card style="margin: 10px 0px">
    <el-button
      type="primary"
      icon="Plus"
      :disabled="categoryStore.c3Id ? false : true"
    >
      添加平台属性
    </el-button>
    <el-table border style="margin: 10px 0px" :data="attrArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="属性名称"
        width="120px"
        prop="attrName"
      ></el-table-column>
      <el-table-column label="属性值名称">
        <template #="{ row }">
          <el-tag
            v-for="item in row.attrValueList"
            :key="item.id"
            style="margin: 5px"
          >
            {{ item.valueName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px">
        <template #>
          <el-button type="primary" size="small" icon="Edit"></el-button>
          <el-button type="danger" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { reqAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr } from '@/api/product/attr/type'
import useCatoryStore from '@/store/modules/category'

let categoryStore = useCatoryStore()
let attrArr = ref<Attr[]>([])

watch(
  () => categoryStore.c3Id,
  async () => {
    attrArr.value = []
    if (!categoryStore.c3Id) return
    getAttr()
  },
)
//获取已有的属性和属性值
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (res.code == 200) {
    attrArr.value = res.data
  }
}
</script>

<style scoped></style>
