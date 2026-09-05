<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          style="width: 180px"
          v-model="categoryStore.c1Id"
          @change="handler"
          :disabled="scene !== 0"
        >
          <!-- option:label即为显示文字 value属性即为select下拉菜单收集的数据-->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :label="c1.name"
            :key="c1.id"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          style="width: 180px"
          v-model="categoryStore.c2Id"
          @change="handler1"
          :disabled="scene !== 0"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :label="c2.name"
            :key="c2.id"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          style="width: 180px"
          v-model="categoryStore.c3Id"
          :disabled="scene !== 0"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :label="c3.name"
            :key="c3.id"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCatoryStore from '@/store/modules/category'

let categoryStore = useCatoryStore()

//组件挂载后运行
onMounted(() => {
  getC1()
})
const getC1 = () => {
  categoryStore.getC1()
}
//一级下拉菜单选中值的时候会触发
const handler = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC2()
}
//二级下拉菜单选中值的时候会触发
const handler1 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
defineProps(['scene'])
</script>

<style scoped></style>
