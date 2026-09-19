// 品牌管理模块接口
import request from '@/utils/request'
import type { PermisstionResponseData, MenuParams } from './type'

const API = {
  //获取菜单列表
  GETMENU_URL: '/admin/acl/permission',
  //新增菜单
  ADDMENU_URL: '/admin/acl/permission/save',
  //更新菜单
  UPDATEMENU_URL: '/admin/acl/permission/update',
} as const

export const reqAllPermission = () =>
  request.get<any, PermisstionResponseData>(API.GETMENU_URL)
export const reqAddOrUpdatePermission = (data: MenuParams) => {
  if (data.id) return request.put<any, any>(API.UPDATEMENU_URL, data)
  else return request.post<any, any>(API.ADDMENU_URL, data)
}
