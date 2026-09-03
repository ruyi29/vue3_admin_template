// 品牌管理模块接口
import request from '@/utils/request'
import type { Trademark, TrademarkResponseData } from './type'

const API = {
  // 获取品牌列表接口
  TRADEMARK_URL: '/admin/product/baseTrademark',
  //添加品牌
  ADDTRADEMARK_URL: '/admin/product/baseTrademark/save',
  //修改品牌
  UPDATETRADEMARK_URL: '/admin/product/baseTrademark/update',
  //删除已有品牌
  DELETE_URL: '/admin/product/baseTrademark/remove/',
} as const

// page：获取第几页；limit：每页显示多少条数据
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResponseData>(
    API.TRADEMARK_URL + `/${page}/${limit}`,
  )

// 添加品牌和修改品牌的接口
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  if (data.id) {
    //修改品牌
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    //添加品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 删除已有品牌的接口
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
