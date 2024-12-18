import { instance } from "./config/Instance";
import { SECURITY_END_POINT } from "./config/endpoint";
import {} from './storage/Auth'
export const uploadImage = async (form:FormData) => {
    let res = await instance.post(SECURITY_END_POINT.fileUpload,form,{
        headers: {
          "Content-Type": "multipart/form-data",
        }});
    return res.data.url
}