import { ICustomer, TCustomer } from "../../types/models/ICustomer";
import {  IReqLogin, TCheckEmail, TLoginRes } from "../../types/models/ILogin";
import { IUser } from "../../types/models/IRegister";
import { StoreUserInfo } from "../storage/UserStorage";
import { STORAGE_KEY, Storage } from "../storage/localstorage";
import { instance } from "./config/Instance";
import { END_POINT } from "./config/endpoint";


export const fetchLogin = async (data:IReqLogin)=> {
    let loginRes = await instance.post(END_POINT.login,data);
    console.log(loginRes)
    Storage.setItem(STORAGE_KEY.token,loginRes.data.access_token);
    StoreUserInfo(loginRes.data.user);
    // return instance.get(END_POINT.auth_user_shop);
}

export const fetchSendOTP = async (data:{email:string}) => {
    await instance.post(END_POINT.senOTP,data);
}

export const fetchVerifyOTP = async (data:{email:string,code:string}):Promise<TLoginRes> => {
    return instance.post(END_POINT.verifyOTP,data);
}


export const fetchCheckEmail = async (data:{email:string}):Promise<TCheckEmail> => {
    return instance.post(END_POINT.check_email,data);
}

export const fetchUpdateProfile= async (props:{id:string|number,data:IUser}):Promise<TLoginRes> => {
    return instance.put(END_POINT.update_profile+props.id,props.data)   
}

export const fetchLogout = async () => {
   instance.get(END_POINT.logout);
   Storage.removeItem(STORAGE_KEY.token);
   Storage.removeItem(STORAGE_KEY.user);
   Storage.removeItem(STORAGE_KEY.shop)
}

export const fetchCreateCustomer =async (data:ICustomer):Promise<TCustomer> => {
    return instance.post(END_POINT.create_customer,{
        name:data.name,
        phno:data.phno,
        email:data.email
    });

}