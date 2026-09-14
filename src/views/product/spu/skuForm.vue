<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="80px">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select style="width: 150px" v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select style="width: 150px" v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import { ref, reactive } from 'vue'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

let attrArr = ref<any>([]) //平台属性
let saleArr = ref<any>([]) //销售属性
let imgArr = ref<any>([]) //照片的数据
let $emit = defineEmits(['changeScene'])
let skuParams = reactive<SkuData>({
  //收集SKU的参数
  category3Id: '', //三级分类的ID
  spuId: '', //已有的SPU的ID
  tmId: '', //SPU品牌的ID
  skuName: '', //sku名字
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku的描述
  skuAttrValueList: [], //平台属性的收集
  skuSaleAttrValueList: [], //销售属性
  skuDefaultImg: '',
})
let table = ref<any>() //获取table组件实例

const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
//对外暴露初始化方法
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  Object.assign(skuParams, {
    category3Id: '', //三级分类的ID
    spuId: '', //已有的SPU的ID
    tmId: '', //SPU品牌的ID
    skuName: '', //sku名字
    price: '', //sku价格
    weight: '', //sku重量
    skuDesc: '', //sku的描述
    skuAttrValueList: [], //平台属性的收集
    skuSaleAttrValueList: [], //销售属性
    skuDefaultImg: '',
  })
  //收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId

  let res: any = await reqAttr(c1Id, c2Id, spu.category3Id) //获取平台属性
  attrArr.value = res.data
  let res1: any = await reqSpuHasSaleAttr(spu.id) //获取销售属性
  saleArr.value = res1.data
  let res2: any = await reqSpuImageList(spu.id) //获取照片墙的数据
  imgArr.value = res2.data
}
//设置默认图片的回调
const handler = (row: any) => {
  imgArr.value.forEach((item: any) => {
    //点击的时候，全部图片的的复选框不勾选
    table.value.toggleRowSelection(item, false)
  })
  table.value.toggleRowSelection(row, true) //选中的图片才勾选
  skuParams.skuDefaultImg = row.imgUrl //收集图片地址
}
const save = async () => {
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])
  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({ saleAttrId, saleAttrValueId })
      }
      return prev
    },
    [],
  )
  //发送请求
  let res: any = await reqAddSku(skuParams)
  if (res.code == 200) {
    ElMessage.success('添加SKU成功')
    $emit('changeScene', { flag: 0, params: 'update' })
  } else {
    ElMessage.error('添加SKU失败')
  }
}
defineExpose({ initSkuData })
</script>

<style scoped></style>
