// 品牌管理模块接口
import request from '@/utils/request'
import type { RoleResponseData } from './type'

const API = {
  //获取全部角色信息
  ALLROLE_URL: '/admin/acl/role/',
} as const

export const reqRoleInfo = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`,
  )
