//统一管理项目用户相关接口
import request from '@/utils/request'
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from './type'
//项目用户相关请求地址
const API = {
  LOGIN_URL: '/admin/acl/index/login',
  USEINFO_URL: '/admin/acl/index/info',
  LOGOUT_URL: '/admin/acl/index/logout',
} as const

//登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息
export const reqUserInfo = () =>
  request.get<any, userInfoReponseData>(API.USEINFO_URL)
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
