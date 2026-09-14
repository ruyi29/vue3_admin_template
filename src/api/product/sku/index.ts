// 品牌管理模块接口
import request from '@/utils/request'
import type { SkuResponseData } from '@/api/product/sku/type'

const API = {
  //获取已有SKU数据
  SKU_URL: '/admin/product/list/',
}

export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
