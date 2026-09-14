// 品牌管理模块接口
import request from '@/utils/request'
import type { SkuResponseData } from '@/api/product/sku/type'

const API = {
  //获取已有SKU数据
  SKU_URL: '/admin/product/list/',
  //上架
  SALE_URL: '/admin/product/onSale/',
  //下架
  CANCELSALE_URL: '/admin/product/cancelSale/',
}

export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId)
export const reqCancelSale = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)
