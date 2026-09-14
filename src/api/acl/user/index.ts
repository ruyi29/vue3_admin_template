// 品牌管理模块接口
import request from '@/utils/request'
import type { UserResponseData } from './type'

const API = {
  //获取全部用户信息
  ALLUSER_URL: '/admin/acl/user/',
} as const

export const reqUserInfo = (page: number, limit: number) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}`)
