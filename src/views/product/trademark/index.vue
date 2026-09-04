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
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          ></el-button>
          <el-popconfirm
            :title="`您确定要删除“${row.tmName}”吗？`"
            width="250px"
            icon="Delete"
            @confirm="removeTrademark(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
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
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
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
import { ref, onMounted, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
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
let formRef = ref() //获取表单组件实例

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
    ElMessage.error(res.message)
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
  //第一种写法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  //第二种写法
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!(
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/png'
  )) {
    ElMessage.error('上传文件格式务必PNG|JPG|GIF')
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
  formRef.value.clearValidate('logoUrl') //清除表单校验状态
}
//确定按钮
const confirm = async () => {
  //对所有表单内容进行校验
  await formRef.value.validate()
  let result = await reqAddOrUpdateTrademark(trademarkParams.value)
  if (result.code == 200) {
    //关闭对话框
    dialogFormVisible.value = false
    //弹出提示信息
    ElMessage.success(
      trademarkParams.value.id ? '修改品牌成功' : '添加品牌成功',
    )
    //再次调用获取品牌列表接口
    getHasTrademark()
  } else {
    ElMessage.error(trademarkParams.value.id ? '修改品牌失败' : '添加品牌失败')
    dialogFormVisible.value = false
  }
}
//取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}
//修改品牌
const updateTrademark = (row: Trademark) => {
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  //ES6语法合并对象(拷贝)
  Object.assign(trademarkParams.value, row)
  // trademarkParams.value.id = row.id
  // trademarkParams.value.tmName = row.tmName
  // trademarkParams.value.logoUrl = row.logoUrl
}
//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  //自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数需要大于等于两位'))
  }
}
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  //如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }
}
//表单校验规则对象
const rules = {
  tmName: [
    //required:这个字段务必校验,表单项前面出来五角星
    //trigger:代表触发校验规则时机[blur、change]
    { required: true, trigger: 'blur', validator: validatorTmName },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
//删除品牌
const removeTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage.success('删除品牌成功')
    getHasTrademark()
  } else {
    ElMessage.error('删除品牌失败')
  }
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
