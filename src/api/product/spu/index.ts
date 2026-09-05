// SPU管理模块接口
import request from '@/utils/request'
import type { HasSpuResponseData } from './type'

const API = {
  HASSPU_URL: '/admin/product', //获取SPU列表的接口
}

export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `/${page}/${limit}?category3Id=${category3Id}`,
  )
