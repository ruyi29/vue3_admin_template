<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select>
        <el-option label="hua"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请输入描述"></el-input>
    </el-form-item>
    <el-form-item label="SPU图标">
      <el-upload
        v-model:file-list="fileList"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select style="width: 200px; margin-right: 10px">
        <el-option label="hua"></el-option>
      </el-select>
      <el-button type="primary" icon="Plus">添加属性值</el-button>
      <el-table border style="margin: 10px 0px">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="属性名" width="120px"></el-table-column>
        <el-table-column label="属性值"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template #>
            <el-button type="danger" size="small" icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {
  SpuData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponse,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
} from '@/api/product/spu/type'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '@/api/product/spu/index'

let $emit = defineEmits(['changeScene'])
//存储已有的SPU数据
let allTradeMark = ref<Trademark[]>([]) //全部品牌
let imgList = ref<SpuImg[]>([]) //商品图片
let saleAttr = ref<SaleAttr[]>([]) //已有的spu销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]) //全部销售属性

const cancel = () => {
  $emit('changeScene', 0)
}
const initHasSpuData = async (spu: SpuData) => {
  //spu:即为父组件传递过来的已有的SPU对象[不完整]
  //获取全部品牌的数据
  let res: AllTradeMark = await reqAllTradeMark()
  allTradeMark.value = res.data
  //获取品牌下全部售卖商品的图片
  let res1: SpuHasImg = await reqSpuImageList(spu.id as number)
  imgList.value = res1.data
  //获取已有SPU的所有属性
  let res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  saleAttr.value = res2.data
  //获取全部项目所有销售属性
  let res3: HasSaleAttrResponse = await reqAllSaleAttr()
  allSaleAttr.value = res3.data
}
defineExpose({ initHasSpuData })
</script>

<style scoped></style>
