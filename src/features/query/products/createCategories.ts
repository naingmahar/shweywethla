import { useMutation } from "@tanstack/react-query";
import { fetchCreateCategory } from "../../apiClient/Category";
import { ICategory } from "../../../types/models/ICategory";

export const useCreateCategories = () => {
    return useMutation<any, Error,ICategory>(fetchCreateCategory,{
      onError(error){
        console.warn("Mutate Error",error)
      },
      onSuccess(data,param) {
      },
    });
  };