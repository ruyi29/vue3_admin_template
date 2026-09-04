// 属性管理模块接口
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'

const API = {
  C1_URL: '/admin/product/getCategory1', // 获取一级分类的接口
  C2_URL: '/admin/product/getCategory2', // 获取二级分类的接口
  C3_URL: '/admin/product/getCategory3', // 获取三级分类的接口
  ATTR_URL: '/admin/product/attrInfoList', // 获取平台属性的接口
  ADD_OR_UPDATE_URL: '/admin/product/saveAttrInfo', // 添加或修改属性的接口
} as const

export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + `/${category1Id}`)
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + `/${category2Id}`)
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `/${category1Id}/${category2Id}/${category3Id}`,
  )
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADD_OR_UPDATE_URL, data)
