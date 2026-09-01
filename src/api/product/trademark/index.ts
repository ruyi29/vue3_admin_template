// 品牌管理模块接口
import request from '@/utils/request'

const API = {
  // 获取品牌列表接口
  TRADEMARK_URL: '/admin/product/baseTrademark',
} as const

export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, any>(API.TRADEMARK_URL + `/${page}/${limit}`)
