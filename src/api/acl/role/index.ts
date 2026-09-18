// 品牌管理模块接口
import request from '@/utils/request'
import type { RoleResponseData, RoleData } from './type'

const API = {
  //获取全部角色信息
  ALLROLE_URL: '/admin/acl/role/',
  //新增角色
  ADDROLE_URL: '/admin/acl/role/save',
  //更新角色
  UPDATEROLE_URL: '/admin/acl/role/update',
} as const

export const reqRoleInfo = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`,
  )
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) return request.put<any, any>(API.UPDATEROLE_URL, data)
  else return request.post<any, any>(API.ADDROLE_URL, data)
}
