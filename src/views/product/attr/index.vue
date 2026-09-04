<template>
  <Category :scene="scene"></Category>
  <el-card style="margin: 10px 0px">
    <div v-show="scene == 0">
      <el-button
        type="primary"
        icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
        @click="addAttr"
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
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateAttr"
            ></el-button>
            <el-button type="danger" size="small" icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 展示添加属性与修改属性界面 -->
    <div v-show="scene == 1">
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input placeholder="请输入属性名称"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="Plus">添加属性值</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-table border style="margin: 10px 0px">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { reqAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr } from '@/api/product/attr/type'
import useCatoryStore from '@/store/modules/category'

let categoryStore = useCatoryStore()
let attrArr = ref<Attr[]>([]) //存储属性
let scene = ref<number>(1) //card组件内容切换变量；0：table，1：添加与修改

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
const addAttr = () => {
  scene.value = 1
}
const updateAttr = () => {
  scene.value = 1
}
const cancel = () => {
  scene.value = 0
}
</script>

<style scoped></style>
