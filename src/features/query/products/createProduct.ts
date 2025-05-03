import { useMutation } from "@tanstack/react-query";
import { fetchCreateProduct, fetchRegister } from "../../apiClient/Products";
import { TProductRes,ICreateProduct } from "../../../types/models/IProducts";
import { ICreateUser, TUserRes } from "../../../types/models/user";
import { StoreUserInfo } from "../../storage/UserStorage";

// export const useCreateProduct = () => {
//     return useMutation<TProductRes, Error, ICreateProduct>(fetchCreateProduct);
// };

// export const useCreateProduct = () => {
//     return useMutation<TUserRes, any, ICreateUser,any>(fetchRegister);
// };

export const useCreateUser = () => {
    return useMutation({
      mutationFn:(param:ICreateUser)=>{
        return fetchRegister(param)
      },
      onSuccess(data, variables, context) {
          StoreUserInfo(data)
      },
    })
  };