// 品牌管理模块接口
import request from '@/utils/request'
import type { PermisstionResponseData } from './type'

const API = {
  //获取菜单列表
  GETMENU_URL: '/admin/acl/permission',
  //
} as const

export const reqAllPermission = () =>
  request.get<any, PermisstionResponseData>(API.GETMENU_URL)
