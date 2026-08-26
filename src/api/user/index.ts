//统一管理项目用户相关接口
import request from '@/utils/request'
import type { loginFrom, loginResponseData, userResponseData } from './type'
//统一管理接口
const API = {
  LOGIN_URL: '/user/login', //登录接口
  USERINFO_URL: '/user/info', //获取用户信息接口
} as const

//暴露请求函数
//登录接口方法
export const reqLogin = (data: loginFrom) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息接口方法
export const reqUserInfo = () =>
  request.get<any, userResponseData>(API.USERINFO_URL, {
    headers: { token: localStorage.getItem('token') },
  })
