import {  IAPICreateShop, ICreateShop, TCreateShopRes } from "../../types/models/ICreateShop";
import { TRegister } from "../../types/models/IRegister";
import { instance } from "./config/Instance";
import { END_POINT } from "./config/endpoint";

export const fetchRegister =async (data:ICreateShop):Promise<TRegister> => {
        return instance.post(END_POINT.create_user,{
            name:data.name,
            phno:data.phone,
            password:data.password,
            email:data.email
        });
    
}

export const fetchCreateShop= async (data:ICreateShop):Promise<TCreateShopRes> => {
    return instance.post(END_POINT.create_shop,{
            name:data.name,
            description:"",
            address:"",
            image:data.image,
            subdomain:data.subdomain
    })   
}

export const fetchUpdateShop= async (props:{id:string|number,data:ICreateShop}):Promise<TCreateShopRes> => {
    return instance.put(END_POINT.update_shop+props.id,props.data)   
}

export const fetchAuthUserShop = async ():Promise<TCreateShopRes> => {
    let res = await instance.get(END_POINT.auth_user_shop);
    return res.data
}

export const fetchSubdomainShop = async (subdomain:string):Promise<IAPICreateShop> => {
    let res = await instance.get(END_POINT.domain_user_shop+`${subdomain}`);
    return res.data
}

