import { useMutation } from "@tanstack/react-query";
import { IFetchGetQuizzesByCategory, fetchGetAllCategories, fetchGetQuizzesByCategory } from "../../apiClient/Products";
import { QuizStorage } from "../../storage/QuizStore";

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
    mutationFn:(category:number,skip?:number)=>{
      // return new Promise((res,rej)=>{
      //   setTimeout(()=>{
      //     return res({})
      //   },10000)
      // })
      return QuizStorage(category)
      .then(data=>{
        // console.log("QUIZ MUTATE DATA",data)
        return data
      })
      .catch(error=>console.log("QUIZ MUTATE ERROR",error))
    },
  })
};

