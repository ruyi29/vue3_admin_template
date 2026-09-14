<template>
  <Category :scene="scene" />
  <el-card style="margin: 10px 0px">
    <div v-show="scene == 0">
      <el-button
        type="primary"
        icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
        @click="addSpu"
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
              @click="addSku(row)"
            ></el-button>
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              title="修改SPU"
              @click="updateSpu(row)"
            ></el-button>
            <el-button
              type="info"
              size="small"
              icon="View"
              title="查看SKU列表"
              @click="findSku(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定删除“${row.spuName}”吗？`"
              @confirm="removeSpu(row.id)"
            >
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
    </div>
    <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
    <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
    <!-- sku展示对话框 -->
    <el-dialog title="SKU列表" v-model="show">
      <el-table border :data="skuArr">
        <el-table-column label="SKU名字" prop="skuName"></el-table-column>
        <el-table-column label="SKU价格" prop="price"></el-table-column>
        <el-table-column label="SKU重量" prop="weight"></el-table-column>
        <el-table-column label="SKU图片">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useCatoryStore from '@/store/modules/category'
import { reqHasSpu, reqDeleteSpu, reqSkuList } from '@/api/product/spu'
import type { HasSpuResponseData, Records } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import type { SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

let categoryStore = useCatoryStore()
let scene = ref<number>(0) //card组件内容切换变量，012
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let records = ref<Records>([])
let total = ref<number>(0)
let spu = ref<any>()
let sku = ref<any>()
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

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
//添加新的SPU
const addSpu = () => {
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}
//修改已有SPU
const updateSpu = (row: SpuData) => {
  scene.value = 1
  //调用子组件内的方法
  spu.value.initHasSpuData(row)
}
//子组件SpuForm绑定自定义事件
const changeScene = async (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在最新页
    let res: HasSpuResponseData = await reqHasSpu(
      1,
      pageSize.value,
      categoryStore.c3Id,
    )
    const lastPage = Math.ceil(res.data.total / pageSize.value)
    getHasSpu(lastPage)
  }
}
//删除SPU
const removeSpu = async (spuId: number) => {
  let res = await reqDeleteSpu(spuId)
  if (res.code == 200) {
    ElMessage.success('删除SPU成功')
    getHasSpu(pageNo.value)
  } else {
    ElMessage.error('删除SPU失败')
  }
}
//添加SKU
const addSku = (row: SpuData) => {
  scene.value = 2
  //调用子组件方法进行初始化
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
//查看SKU列表
const findSku = async (row: SpuData) => {
  let res: SkuInfoData = await reqSkuList(row.id as number)
  if (res.code == 200) {
    skuArr.value = res.data
    show.value = true
  } else {
  }
}
</script>

<style scoped></style>
