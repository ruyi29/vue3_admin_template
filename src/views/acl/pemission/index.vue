<template>
  <el-table
    :data="permissionArr"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="code" label="权限值" />
    <el-table-column prop="updateTime" label="修改时间" />
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button
          type="primary"
          icon="User"
          size="small"
          @click="addPermission(row)"
          :disabled="row.level == 4 ? true : false"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          icon="Edit"
          size="small"
          @click="updatePermission(row)"
          :disabled="row.level == 1 ? true : false"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`您确定要删除“${row.name}”吗？`"
          width="260px"
          @confirm="deletePermission(row.id)"
        >
          <template #reference>
            <el-button
              type="primary"
              icon="Delete"
              size="small"
              :disabled="row.level == 1 ? true : false"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框：添加与更新菜单 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
    style="width: 450px"
  >
    <el-form :model="menuData" label-width="70px">
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请您输入菜单名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限值" prop="code">
        <el-input
          placeholder="请您输入权限数值"
          v-model="menuData.code"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  reqAllPermission,
  reqAddOrUpdatePermission,
  reqRemoveMenu,
} from '@/api/acl/menu/index'
import type {
  PermisstionResponseData,
  PermisstionList,
  Permisstion,
  MenuParams,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

let permissionArr = ref<PermisstionList>([])
let dialogVisible = ref<boolean>(false)
let menuData = reactive<MenuParams>({
  code: '', //权限数值
  level: 0, //几级菜单
  name: '', //菜单的名字
  pid: 0, //菜单的ID
})

onMounted(() => {
  getHasPermission()
})
const getHasPermission = async () => {
  let res: PermisstionResponseData = await reqAllPermission()
  if (res.code == 200) {
    permissionArr.value = res.data
  } else {
    ElMessage.error('获取菜单信息失败')
  }
}
const addPermission = (row: Permisstion) => {
  dialogVisible.value = true
  Object.assign(menuData, {
    id: '',
    code: '', //权限数值
    level: 0, //几级菜单
    name: '', //菜单的名字
    pid: 0, //菜单的ID
  })
  menuData.level = row.level + 1
  menuData.pid = row.id as number
}
const updatePermission = (row: Permisstion) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}
//添加、更新菜单确认按钮
const save = async () => {
  let res: any = await reqAddOrUpdatePermission(menuData)
  if (res.code == 200) {
    dialogVisible.value = false
    ElMessage.success(menuData.id ? '更新菜单成功' : '添加菜单成功')
    getHasPermission()
  } else {
    dialogVisible.value = false
    ElMessage.error(menuData.id ? '更新菜单失败' : '添加菜单失败')
  }
}
const deletePermission = async (menuId: number) => {
  let res = await reqRemoveMenu(menuId)
  if (res.code == 200) {
    ElMessage.success('删除菜单成功')
    getHasPermission()
  } else {
    ElMessage.error(res.message)
  }
}
</script>

<style scoped></style>
