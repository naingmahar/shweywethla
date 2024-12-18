import { IDefaultFormat } from "./ILogin";


export interface ICreateProduct{
    name : string,
    description :string,
    price : string,
    images:string[],
    shop_id:string,
    additionalinfo:string,
    category_id:string,
    qty:string,
    delivery_method_id:string
}
export interface IProduct {
    ans: string,
    q1?: string,
    q2?: string,
    q3?: string,
    q4?: string,
    q5?: string,
    q6?: string,
    image?: string,
    description: string,
}

export interface ImagesUrl {
    name: string
    url: string
    mime: string
  }

export type TProductRes = IDefaultFormat<IProduct>
export type TAllProductRes = IDefaultFormat<IProduct[]>