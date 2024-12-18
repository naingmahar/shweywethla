
import { ICategory, TCategoryRes } from "../../types/models/ICategory";
import { instance } from "./config/Instance";
import { END_POINT } from "./config/endpoint";


export const fetchCreateCategory = (data:ICategory):Promise<TCategoryRes> => {
    return instance.post(END_POINT.create_category,data)
}


// export const fetchGetAllProducts = async ():Promise<ICategory[]> => {
//     let res = await instance.get(END_POINT.get_all_products);
//     return res.data
// }