// 品牌管理模块接口
import request from '@/utils/request'
import type { TrademarkResponseData } from './type'

const API = {
  // 获取品牌列表接口
  TRADEMARK_URL: '/admin/product/baseTrademark',
} as const

// page：获取第几页；limit：每页显示多少条数据
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResponseData>(
    API.TRADEMARK_URL + `/${page}/${limit}`,
  )
