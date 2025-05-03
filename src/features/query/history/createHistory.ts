import { useMutation } from "@tanstack/react-query";
import { fetchCreateProduct, fetchRegister } from "../../apiClient/Products";
import { TProductRes,ICreateProduct } from "../../../types/models/IProducts";
import { ICreateUser, TUserRes } from "../../../types/models/user";
import { StoreUserInfo } from "../../storage/UserStorage";
import { fetchCreateHistory, fetchDashboard } from "../../apiClient/History";
import { ICreateHistory } from "../../../types/models/history";

// export const useCreateHistory = () => {
//     return useMutation({
//       mutationFn:(param:ICreateHistory)=>{
//         return fetchCreateHistory(param)
//       },
//     })
//   };

export const useGetDashboard = () => {
    return useMutation({
      mutationFn:(date:string)=>{
        return fetchDashboard({date})
      }
    })
  };