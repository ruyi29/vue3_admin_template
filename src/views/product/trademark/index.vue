<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" @click="addTrademark" icon="Plus">
      添加品牌
    </el-button>
    <!-- 展示表格 -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <!-- table-column:默认展示数据用div，不想用div的话就用插槽 -->
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌Logo">
        <template #="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark"
          ></el-button>
          <el-button type="danger" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @current-change="getHasTrademark"
      @size-change="sizeChange"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    />
  </el-card>
  <!-- 对话框组件，添加修改品牌 -->
  <!-- v-model：控制对话框的显示与隐藏；title：设置对话框左上角标题 -->
  <el-dialog v-model="dialogFormVisible" title="添加品牌">
    <el-form style="width: 80%">
      <el-form-item label="品牌名称" label-width="80px">
        <el-input
          placeholder="请输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="80px">
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :headers="headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽：footer -->
    <template #footer>
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
} from '@/api/product/trademark/index'
import type { Trademark } from '@/api/product/trademark/type'
import type {
  Records,
  TrademarkResponseData,
} from '@/api/product/trademark/type'
import useUserStore from '@/store/modules/user'
const headers = {
  token: useUserStore().token,
}
//分页器相关数据
let pageNo = ref<number>(1) //当前页码
let limit = ref<number>(3) //每页条数
let total = ref<number>(0) //总条数
let trademarkArr = ref<Records>([]) //存储已有品牌的数据

let dialogFormVisible = ref<boolean>(false) //控制对话框的显示与隐藏
let trademarkParams = ref<Trademark>({
  tmName: '',
  logoUrl: '',
})

//获取品牌列表接口
const getHasTrademark = async () => {
  let res: TrademarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (res.code == 200) {
    total.value = res.data.total
    trademarkArr.value = res.data.records
  } else {
    console.log('获取品牌列表失败', res.message)
  }
}
//组件挂载后调用获取品牌列表接口
onMounted(() => {
  getHasTrademark()
})
//分页器发生变化时调用的函数
const sizeChange = () => {
  pageNo.value = 1
  getHasTrademark()
}
//添加品牌按钮点击事件
const addTrademark = () => {
  dialogFormVisible.value = true
  //清空表单数据
  trademarkParams.value = {
    tmName: '',
    logoUrl: '',
  }
}
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!(
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/png'
  )) {
    ElMessage.error('上传文件格式务必PNG|JPG|GIF"')
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('上传文件大小要求小于4M')
    return false
  }
  return true
}
//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  trademarkParams.value.logoUrl = response.data
}
const confirm = async () => {
  let result = await reqAddOrUpdateTrademark(trademarkParams.value)
  if (result.code == 200) {
    //关闭对话框
    dialogFormVisible.value = false
    //弹出提示信息
    ElMessage.success('添加品牌成功')
    //再次调用获取品牌列表接口
    getHasTrademark()
  } else {
    ElMessage.error('添加品牌失败')
    dialogFormVisible.value = false
  }
}

const cancel = () => {
  dialogFormVisible.value = false
}
const updateTrademark = () => {
  dialogFormVisible.value = true
}
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
}
</style>
