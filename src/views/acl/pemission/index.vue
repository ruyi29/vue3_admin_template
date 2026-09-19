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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqAllPermission } from '@/api/acl/menu/index'
import type {
  PermisstionResponseData,
  PermisstionList,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

let permissionArr = ref<PermisstionList>([])

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
const addPermission = (row) => {}
const updatePermission = (row) => {}
const deletePermission = (row) => {}
</script>

<style scoped></style>
