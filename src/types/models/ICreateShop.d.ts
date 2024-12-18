import { ICheckProps } from "../../componet/organisms/CheckedBoxList";
import { IDefaultFormat } from "./ILogin";


interface ICreateProduct {
    name:string,
    images:string[],
    price:number,
    quantity:number,
    ship?:ICheckProps
}

export interface ICreateShop{
    id?:string,
    name:string,
    image?:string,
    phone:string,
    password:string,
    email:string,
    description?:string,
    address?:string,
    subdomain:string,
}
export interface ICreateShopState{
    category?:ICheckProps,
    product:ICreateProduct
    shop:ICreateShop
}


export interface IAPICreateShop  {
    id: number
    name: string
    description: string
    created_at: string
    updated_at: string
    address: string
    imageUrl: string
    image: string
    user_id: number
    subdomain?:string
}

export type TCreateShopRes =  IDefaultFormat<IAPICreateShop>