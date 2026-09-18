// 品牌管理模块接口
import request from '@/utils/request'
import type {
  UserResponseData,
  User,
  AllRoleResponseData,
  SetRoleData,
} from './type'

const API = {
  //获取全部用户信息
  ALLUSER_URL: '/admin/acl/user/',
  //新增用户
  ADDUSER_URL: '/admin/acl/user/save',
  //编辑用户
  UPDATEUSER_URL: '/admin/acl/user/update',
  //获取用户角色数据
  ALLROLE_URL: '/admin/acl/user/toAssign/',
  //给已有用户分配角色
  SETROLE_URL: '/admin/acl/user/doAssignRole',
  //删除用户
  REMOVEUSER_URL: '/admin/acl/user/remove/',
  //批量删除用户
  BATCHREMOVEUSER_URL: '/admin/acl/user/batchRemove',
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
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)
export const reqSetRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data)
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.REMOVEUSER_URL + userId)
export const reqSelectUser = (idList: number[]) =>
  request.delete<any, any>(API.BATCHREMOVEUSER_URL, { data: idList })
