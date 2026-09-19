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
          :title="`您确定要删除“${row.roleName}”吗？`"
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
    :title="permissionParams.id ? '更新菜单' : '添加菜单'"
    style="width: 450px"
  >
    <el-form
      :model="permissionParams"
      :rules="rules"
      ref="form"
      label-width="70px"
    >
      <el-form-item label="名称" prop="roleName">
        <el-input
          placeholder="请您输入菜单名称"
          v-model="permissionParams.roleName"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限值" prop="roleName">
        <el-input
          placeholder="请您输入权限数值"
          v-model="permissionParams.roleName"
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
import { reqAllPermission } from '@/api/acl/menu/index'
import type {
  PermisstionResponseData,
  PermisstionList,
  Permisstion,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

let permissionArr = ref<PermisstionList>([])
let dialogVisible = ref<boolean>(false)
let permissionParams = reactive<Permisstion>({})

onMounted(() => {
  getHasPermission()
})
const getHasPermission = async () => {
  let res: PermisstionResponseData = await reqAllPermission()
  if (res.code == 200) {
    permissionArr.value = res.data
    console.log(res)
  } else {
    ElMessage.error('获取菜单信息失败')
  }
}
const addPermission = (row: Permisstion) => {
  dialogVisible.value = true
}
const updatePermission = (row: Permisstion) => {
  dialogVisible.value = true
}
//添加、更新菜单确认按钮
const save = () => {}
const deletePermission = (row) => {}
</script>

<style scoped></style>
