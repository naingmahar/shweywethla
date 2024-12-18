import { ICreateOrder } from "../../types/models/IOrder"
import { TBasicOrderRes, TOrdersRes } from "../../types/models/IOrderRes"
import { instance } from "./config/Instance"
import { END_POINT } from "./config/endpoint"

export const fetchCreateOrder = (data:ICreateOrder):Promise<TBasicOrderRes> => {
    return instance.post(END_POINT.order,data)
}

export const fetchUpdateOrder = (props:{id:number,data:ICreateOrder}):Promise<TBasicOrderRes> => {
    return instance.put(END_POINT.order+"/"+props.id,props.data)
}

export const fetchGetOrder = (page?:number):Promise<TOrdersRes> => {
    return instance.get(END_POINT.order+`?page=${page||1}`)
}