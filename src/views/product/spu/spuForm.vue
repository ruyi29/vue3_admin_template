<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="spuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="spuParams.tmId">
        <el-option
          v-for="item in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入描述"
        v-model="spuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图标">
      <!-- v-model:fileList->展示默认图片
        action:上传图片的接口地址
        list-type:文件列表的类型 
      -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select style="width: 200px; margin-right: 10px">
        <el-option label="hua"></el-option>
      </el-select>
      <el-button type="primary" icon="Plus">添加属性值</el-button>
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="属性名"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="属性值">
          <template #="{ row }">
            <el-tag
              v-for="item in row.spuSaleAttrValueList"
              :key="row.id"
              class="mx-1"
              closable
              style="margin-right: 5px; margin-top: 5px; margin-bottom: 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-button icon="Plus" type="primary" size="small"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
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
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])
//存储已有的SPU数据
let allTradeMark = ref<Trademark[]>([]) //全部品牌
let imgList = ref<SpuImg[]>([]) //商品图片
let saleAttr = ref<SaleAttr[]>([]) //已有的spu销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]) //全部销售属性
let spuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})
let dialogVisible = ref<boolean>(false) //控制照片墙对话框的显示隐藏
let dialogImageUrl = ref<string>('') //存储预览图片的地址

const cancel = () => {
  $emit('changeScene', 0)
}
const initHasSpuData = async (spu: SpuData) => {
  //spu:即为父组件传递过来的已有的SPU对象[不完整]
  spuParams.value = spu
  //获取全部品牌的数据
  let res: AllTradeMark = await reqAllTradeMark()
  allTradeMark.value = res.data
  //获取品牌下全部售卖商品的图片
  let res1: SpuHasImg = await reqSpuImageList(spu.id as number)
  imgList.value = res1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  //获取已有SPU的所有属性
  let res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  saleAttr.value = res2.data
  //获取全部项目所有销售属性
  let res3: HasSaleAttrResponse = await reqAllSaleAttr()
  allSaleAttr.value = res3.data
}
//照片墙点击预览按钮触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
//照片墙点击删除按钮触发的钩子
const handleRemove = () => {}
//照片墙上传图片成功之后的钩子，约束文件的大小与类型
const handlerUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) return true
    else ElMessage.error('上传的文件大小必须小于3M')
    return false
  } else ElMessage.error('上传的文件必须是PNG|JPG|GIF')
  return false
}
defineExpose({ initHasSpuData })
</script>

<style scoped></style>
