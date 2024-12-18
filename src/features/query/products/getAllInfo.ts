import { useMutation } from "@tanstack/react-query";
import { fetchGetAllCategories, fetchGetQuizzesByCategory } from "../../apiClient/Products";
import { ICategory } from "../../../types/models/ICategory";
import { fetchCreateCategory } from "../../apiClient/Category";

// const QUERY_KEY = ['Products'];

export const useGetAllCategories = () => {
  return useMutation({
    mutationFn:()=>{
      return fetchGetAllCategories()
    }
  })
};

export const useGetAllQuizzes = () => {
  return useMutation({
    mutationFn:(category:number)=>{
      return fetchGetQuizzesByCategory(category)
    }
  })
};

