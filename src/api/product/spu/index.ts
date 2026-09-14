// SPU管理模块接口
import request from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponse,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'

const API = {
  //获取SPU列表的接口
  HASSPU_URL: '/admin/product',
  //获取全部品牌的数据
  ALLTRADEMARK_URL: '/admin/product/baseTrademark/getTrademarkList',
  //获取某个SPU下的全部售卖商品的品牌数据
  IMAGE_URL: '/admin/product/spuImageList/',
  //获取某个SPU下已有的销售属性列表
  SPUHASSALEATTR_URL: '/admin/product/spuSaleAttrList/',
  //获取所有销售属性列表
  ALLSALEATTR_URL: '/admin/product/baseSaleAttrList',
  //追加新的SPU
  ADDSPU_URL: '/admin/product/saveSpuInfo',
  //更新已有的SPU
  UPDATESPU_URL: '/admin/product/updateSpuInfo',
  //删除已有SPU
  DELETESPU_URL: '/admin/product/deleteSpu/',
  //添加新的SKU
  ADDSKU_URL: '/admin/product/saveSkuInfo',
  //查看某一个SPU下的sku
  SKUINFO_URL: '/admin/product/findBySpuId/',
}

export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `/${page}/${limit}?category3Id=${category3Id}`,
  )
export const reqAllTradeMark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponse>(API.ALLSALEATTR_URL)
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) return request.post<any, any>(API.UPDATESPU_URL, data)
  else return request.post<any, any>(API.ADDSPU_URL, data)
}
export const reqDeleteSpu = (spuId: number) =>
  request.delete<any, any>(API.DELETESPU_URL + spuId)
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)
export const reqSkuList = (spuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
