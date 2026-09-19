<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="角色搜索：">
        <el-input placeholder="请输入搜索角色" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="keyword ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addRole" icon="Plus">添加角色</el-button>
    <el-table style="margin: 10px 0" border :data="roleArr">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column
        label="ID"
        align="center"
        prop="id"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="角色名称"
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
            @click="setPermission(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`您确定要删除“${row.roleName}”吗？`"
            width="260px"
            @confirm="deleteRole(row.id)"
          >
            <template #reference>
              <el-button type="primary" icon="Delete" size="small">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange"
    ></el-pagination>
  </el-card>
  <!-- 对话框：添加与更新角色 -->
  <el-dialog
    v-model="dialogVisible"
    :title="roleParams.id ? '更新角色' : '添加角色'"
  >
    <el-form :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          placeholder="请您输入角色名称"
          v-model="roleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="save">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉 分配权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="selectArr"
        :props="defaultProps"
        default-expand-all
      ></el-tree>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="handler">确定</el-button>
        <el-button @click="drawer = false">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqRoleInfo,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqRemoveRole,
} from '@/api/acl/role/index'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
} from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let roleArr = ref<Records>([])
let keyword = ref<string>('') //收集用户搜索框关键字
let settingStore = useLayOutSettingStore() //获取模版setting仓库
let dialogVisible = ref<boolean>(false)
let roleParams = reactive<RoleData>({
  roleName: '',
})
let form = ref<any>()
let drawer = ref<boolean>(false) //控制分配角色权限的抽屉
let menuArr = ref<MenuList>([])
let selectArr = ref<number[]>([])
let tree = ref<any>()

onMounted(() => {
  getHasRole()
})
const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let res: RoleResponseData = await reqRoleInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (res.code == 200) {
    roleArr.value = res.data.records
    total.value = res.data.total
  } else {
    ElMessage.error('获取角色信息失败')
  }
}
//页码变化时
const sizeChange = () => {
  getHasRole()
}
const addRole = () => {
  dialogVisible.value = true
  Object.assign(roleParams, {
    id: '',
    roleName: '',
  })
  nextTick(() => {
    form.value?.clearValidate()
  })
}
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) callBack()
  else callBack(new Error('角色名称至少两位'))
}
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}
//添加、更新角色确定按钮
const save = async () => {
  await form.value.validate()
  let res: any = await reqAddOrUpdateRole(roleParams)
  if (res.code == 200) {
    dialogVisible.value = false
    ElMessage.success(roleParams.id ? '更新角色成功' : '添加角色成功')
    const lastPage = Math.ceil((total.value + 1) / pageSize.value)
    getHasRole(roleParams.id ? pageNo.value : lastPage)
  } else {
    dialogVisible.value = false
    ElMessage.error(roleParams.id ? '更新角色失败' : '添加角色失败')
  }
}
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(roleParams, row)
  nextTick(() => {
    form.value?.clearValidate()
  })
}
const setPermission = async (row: RoleData) => {
  drawer.value = true
  Object.assign(roleParams, row)
  let res: MenuResponseData = await reqAllMenuList(roleParams.id as number)
  if (res.code == 200) {
    menuArr.value = res.data
    selectArr = filterSelectArr(menuArr.value, [])
  }
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
//分配权限确定按钮
const handler = async () => {
  const roleId = roleParams.id as number
  //选中节点的ID
  let arr = tree.value.getCheckedKeys()
  //半选的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  //下发权限
  let res = await reqSetPermission(roleId, permissionId)
  if (res.code == 200) {
    drawer.value = false
    ElMessage.success('分配权限成功')
    //刷新页面
    window.location.reload()
  } else {
    ElMessage.error('分配权限失败')
  }
}
const defaultProps = {
  children: 'children',
  label: 'name',
}
const deleteRole = async (roleId: number) => {
  let res = await reqRemoveRole(roleId)
  if (res.code == 200) {
    ElMessage.success('删除角色成功')
    getHasRole(pageNo.value)
  } else {
    ElMessage.error('删除角色失败')
  }
}
//搜索按钮的回调
const search = () => {
  getHasRole()
  keyword.value = ''
}
//重置按钮
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  height: 50px;
}
</style>
