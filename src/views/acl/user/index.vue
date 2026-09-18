<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请输入搜索用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button type="danger">批量删除</el-button>
    <el-table style="margin: 10px 0" border :data="userArr">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column
        label="ID"
        align="center"
        prop="id"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" align="center" width="270px">
        <template #="{ row }">
          <el-button
            type="primary"
            icon="User"
            size="small"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-button type="primary" icon="Delete" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    ></el-pagination>
  </el-card>
  <!-- 抽屉 添加/更新用户 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请您输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="name">
          <el-input
            placeholder="请您输入用户名称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请您输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉 分配用户角色 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配用户角色</h4>
    </template>
    <template #default>
      <el-form :model="userParams">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="userParams.username" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            @change="handleCheckAllChange"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqUserInfo, reqAddOrUpdateUser } from '@/api/acl/user/index'
import type { UserResponseData, Records, User } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let userArr = ref<Records>([])
let drawer = ref<boolean>(false) //控制添加、更新用户的抽屉
let drawer1 = ref<boolean>(false) //分配用户角色的抽屉
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
let formRef = ref<any>()

onMounted(() => {
  getHasUser()
})
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let res: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
  if (res.code == 200) {
    total.value = res.data.total
    userArr.value = res.data.records
  } else {
    ElMessage.error('获取用户信息失败')
  }
}
const handler = () => {
  getHasUser()
}
//添加用户
const addUser = () => {
  Object.assign(userParams, {
    id: '',
    username: '',
    name: '',
    password: '',
  })
  drawer.value = true
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}
//更新用户
const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}
//保存按钮（添加、更新）
const save = async () => {
  await formRef.value.validate()
  let res: any = await reqAddOrUpdateUser(userParams)
  if (res.code == 200) {
    drawer.value = false
    ElMessage.success(userParams.id ? '更新成功' : '添加成功')
    const lastPage = Math.ceil((total.value + 1) / pageSize.value)
    getHasUser(userParams.id ? pageNo.value : lastPage)
    //浏览器自动刷新一次（后端好像没做这个token失效的功能）
    // window.location.reload()
  } else {
    drawer.value = false
    ElMessage.error(userParams.id ? '更新失败' : '添加失败')
  }
}
//取消按钮
const cancel = () => {
  drawer.value = false
}
const validatorUsername = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) callBack()
  else callBack(new Error('用户姓名至少五位'))
}
const validatorName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) callBack()
  else callBack(new Error('用户名称至少五位'))
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) callBack()
  else callBack(new Error('用户密码至少六位'))
}
//表单校验规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
const setRole = (row: User) => {
  drawer1.value = true
  Object.assign(userParams, row)
}
//测试复选框代码
//全选复选框收集数据：是否全选
let checkAll = ref<boolean>(false)
let allRole = ref(['销售', '前台', '财务', 'boss'])
let userRole = ref(['销售', '前台'])
//设置不确定状态，仅负责样式控制
const isIndeterminate = ref<boolean>(true)
//全选复选框的chang事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
//底部的复选框change事件
const handleCheckedCitiesChange = (value: string[]) => {
  //已经勾选的这些项目的长度
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  //顶部的复选框不确定的样式
  isIndeterminate.value = !(checkedCount === allRole.value.length)
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
}
</style>
