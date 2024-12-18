import IUser  from "@repo/common"
import {  ISecurtiyKeyRes } from "../../../types/models/Storage/SecurityKey";
import { storageInstance } from "../config/Instance";
import { SECURITY_END_POINT } from "../config/endpoint";
import { BasicResponse } from "../../../types/models/Storage/BasicResponse";
import { IFile } from "../../../types/models/Storage/Files";

export const fetchKey = async ():Promise<ISecurtiyKeyRes> => {
    return await storageInstance.post(SECURITY_END_POINT.key);
}


export const fetchRegister = async (props:IUser):Promise<BasicResponse<IUser>> => {
    return await storageInstance.post(SECURITY_END_POINT.register,props);
}


export const fetchLogin = async (props:{username:string,password:string}):Promise<BasicResponse<{access_token:string}>> => {
    return await storageInstance.post(SECURITY_END_POINT.login,props);
}

export const fetchFiles = async ():Promise<BasicResponse<IFile[]>> => {
    return await storageInstance.get(SECURITY_END_POINT.files);
}
