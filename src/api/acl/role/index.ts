// 品牌管理模块接口
import request from '@/utils/request'
import type { RoleResponseData, RoleData, MenuResponseData } from './type'

const API = {
  //获取全部角色信息
  ALLROLE_URL: '/admin/acl/role/',
  //新增角色
  ADDROLE_URL: '/admin/acl/role/save',
  //更新角色
  UPDATEROLE_URL: '/admin/acl/role/update',
  //获取全部的菜单与按钮的数据
  ALLPERMISSION_URL: '/admin/acl/permission/toAssign/',
  //给角色分配权限
  SETPERMISSION_URL: '/admin/acl/permission/doAssign',
  //删除角色
  DELETE_URL: '/admin/acl/role/remove/',
} as const

export const reqRoleInfo = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`,
  )
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) return request.put<any, any>(API.UPDATEROLE_URL, data)
  else return request.post<any, any>(API.ADDROLE_URL, data)
}
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SETPERMISSION_URL + `?roleId=${roleId}&permissionId=${permissionId}`,
  )
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.DELETE_URL + roleId)
