import { IDefaultFormat } from "./ILogin";

export interface ICategory {
    id?:string|number,
    name:string,
    image:string,
    flag?:boolean
}


export type TCategoryRes = IDefaultFormat<ICategory>
export type TAllCategoryRes = IDefaultFormat<ICategory[]>