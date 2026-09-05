export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number
  spuSaleAttrList?: null
  spuImageList?: null
}

export type Records = SpuData[]

export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
    searchCount: boolean
  }
}
//品牌数据ts类型
export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}
//品牌接口返回数据ts
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}
//商品图片的ts类型
export interface SpuImg {
  id: number
  createTime: string
  updateTime: string
  spuId: number
  imgName: string
  imgUrl: string
}
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}
//已有销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number
  createTime: null
  updateTIme: null
  spuId: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName: string
  isChecked: null
}
export type SpuSaleAttrValueList = SaleAttrValue[]
//销售属性对象
export interface SaleAttr {
  id?: number
  createTime: null
  updateTime: null
  spuId: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
}
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}
//已有的全部SPU返回数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}
export interface HasSaleAttrResponse extends ResponseData {
  data: HasSaleAttr[]
}
