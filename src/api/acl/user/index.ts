// 品牌管理模块接口
import request from '@/utils/request'
import type { UserResponseData, User } from './type'

const API = {
  //获取全部用户信息
  ALLUSER_URL: '/admin/acl/user/',
  //新增用户
  ADDUSER_URL: '/admin/acl/user/save',
  //编辑用户
  UPDATEUSER_URL: '/admin/acl/user/update',
} as const

export const reqUserInfo = (page: number, limit: number) =>
  request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}`)
//添加与编辑用户接口
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}
