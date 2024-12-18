import { ICustomer } from "./ICustomer"
import { IDefaultFormat } from "./ILogin"

export type TBasicOrderRes = IDefaultFormat<IOrderRes>
export type TOrdersRes = IDefaultFormat<IPagination<IOrderRes>>
export type IPagination<T> = {
    dataList:T[]
    pageNumber: number,
    pageSize:number,
    totalCount:number,
    totalPage: number
  }
  export interface IOrderRes {
    id: number
    customer_id: number
    customer: ICustomer
    shop_id: number
    shop: string
    delivery_method_id: number
    delivery_method: string
    amount: number|string,
    discount: number|string,
    discount: number
    order_date: string
    order_status: string
    payment_status: string
    order_items: OrderItem[]
  }
  
  export interface OrderItem {
    id: number
    qty: number
    price: string
    amount: number
    product: Product
  }
  
  export interface Product {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
    price: number
    imagesUrl: ImagesUrl[]
    images: any[]
    additionalinfo?: string|null
    category_id: number
    category_name: string
    qty: number
    shop_id: number
    shop_name: string
    delivery_method_id: number
    delivery_method: string
  }
  
  export interface ImagesUrl {
    name: string
    url: string
    mime: string
  }