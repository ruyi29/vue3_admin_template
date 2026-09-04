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
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateAttr(row)"
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
          <el-input
            placeholder="请输入属性名称"
            v-model="attrParams.attrName"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        @click="addAttrValue"
        type="primary"
        icon="Plus"
        :disabled="attrParams.attrName ? false : true"
      >
        添加属性值
      </el-button>
      <el-button @click="cancel">取消</el-button>
      <el-table
        border
        style="margin: 10px 0px"
        :data="attrParams.attrValueList"
      >
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="属性值">
          <template #="{ row, $index }">
            <el-input
              :ref="(vc: any) => (inputArr[$index] = vc)"
              v-if="row.flag"
              v-model="row.valueName"
              placeholder="请输入属性值"
              size="small"
              @blur="toLook(row, $index)"
            ></el-input>
            <div v-else @click="toEdit(row, $index)">
              {{ row.valueName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="attrParams.attrValueList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        @click="save"
        :disabled="attrParams.attrValueList.length > 0 ? false : true"
      >
        保存
      </el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick } from 'vue'
import { reqAttr, reqAddOrUpdateAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import useCatoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'

let categoryStore = useCatoryStore()
let attrArr = ref<Attr[]>([]) //存储属性
let scene = ref<number>(0) //card组件内容切换变量；0：table，1：添加与修改
//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [], //新增的属性值数组
  categoryId: '', //三级分类的ID
  categoryLevel: 3, //代表的是三级分类
})
//存储对应的组件实例el-input
let inputArr = ref<any>([])

//监听三级分类id变化，获取属性
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
//新增属性
const addAttr = () => {
  //每一次点击的时候，先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: '', //新增的属性的名字
    attrValueList: [], //新增的属性值数组
    categoryId: categoryStore.c3Id, //三级分类的ID
    categoryLevel: 3, //代表的是三级分类
  })
  scene.value = 1
}
//添加属性值
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每一个属性值编辑模式与切换模式的切换
  })
  //获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
//保存属性
const save = async () => {
  let res = await reqAddOrUpdateAttr(attrParams)
  if (res.code == 200) {
    scene.value = 0
    ElMessage.success(attrParams.id ? '修改属性成功' : '添加属性成功')
    getAttr()
  } else {
    ElMessage.error(attrParams.id ? '修改属性失败' : '添加属性失败')
  }
}
//属性值表单元素失去焦点时，切换为展示模式
const toLook = (row: AttrValue, $index: number) => {
  //非法情况1：属性为空
  if (row.valueName.trim() == '') {
    //删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能为空')
    return
  }
  //非法情况2：属性重复
  let repeat = attrParams.attrValueList.find((item) => {
    //把当前失却焦点属性值对象从当前数组扣除判断
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    //将重复的属性值删除掉
    attrParams.attrValueList.splice($index, 1)
    ElMessage.error('属性值不能重复')
    return
  }
  row.flag = false
}
//属性值表单元素点击时，切换为编辑模式
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
//编辑属性
const updateAttr = (row: Attr) => {
  scene.value = 1
  //这样是深拷贝，直接写row是浅拷贝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
const cancel = () => {
  scene.value = 0
}
</script>

<style scoped></style>
