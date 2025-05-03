import { IQuiz } from "../../types/models/IQuiz";
import { IPagination } from "../../types/models/Storage/BasicResponse";
import { IFetchGetQuizzesByCategory, fetchGetQuizzesByCategory } from "../apiClient/Products";
import { ValidateIsOldParam } from "./StoreManager";
import { Persit, STORAGE_KEY } from "./localstorage";

export interface IGetStoreQuizzes{
    skip?:number,
    limit?:number,
    index?:number,
    id?:number,
    total?:number
    data?:IQuiz[]
}

export const updateQuizStorageInfo = async (category:number,index:number,id:number):Promise<{index:number,id:number}> => {
    const oldData = await GetStoredQuizzes(String(category))
   
    // return {index,id} 
        // console.log("OLD INDEX",index >= (oldData?.data||[]).length ) 
        if( index >= (oldData?.data||[]).length   ){
            console.log("NEXTTTTT......................")
            await storeQuizzes(String(category),{id:0,index:0,data:[]})
            return ({index:0,id:0})
            
        }else{
            await storeQuizzes(String(category),{id,index})
            return {index,id}
        }
        
    
}

const fetchQuizzes = async ({category,skip}:{category:number,skip:number}) => {
    try {
        const res = await fetchGetQuizzesByCategory({category,skip})
        await storeQuizzes(String(category),res)
        // if(res.data.length) {
        //     console.log("NEW DATA",res.data.length)
        //     await storeQuizzes(String(category),res)
        // }
        return res
    } catch (error) {
        throw error
    }
}

export const QuizStorage = async (category:number,skip?:number)=>{
    const oldData = await GetStoredQuizzes(String(category))
    console.log("OLD DATA",oldData)
    // console.log("OLDDATA",oldData?.index , oldData?.data.length -1)
    if(skip){
        console.log("SKIPPPPPPPP")
        return  fetchQuizzes({category,skip})
    }

    else if(!oldData){
        console.log("EMPTYYYYYY")
        return  fetchQuizzes({category,skip:0})
    }
    else if(oldData?.index >= oldData?.data.length -1 || !oldData.data.length ){
        console.log("NEXTTTTTT",oldData?.index,oldData?.data.length,oldData.id)
        return  fetchQuizzes({category,skip:(( (parseInt(String(oldData.limit))) + (parseInt(String(oldData.skip)))) ||0)})
    }

    console.log("NExt Limit",oldData?.index , oldData?.id, oldData.data.length)

    return  oldData
    
}

export const GetStoredQuizzes =async (category:string):Promise<IPagination<IQuiz[]>|null> => {
    const KEY = STORAGE_KEY.quizInfo+"_"+category
    const persitData:IPagination<IQuiz[]>|null = await Persit.getItemByObjectOrArray(KEY)
    return persitData
}

export const storeQuizzes =async (category:string,{id,index,skip,data,total,limit}:IGetStoreQuizzes) => {
        try {
            const KEY = STORAGE_KEY.quizInfo+"_"+category
            const oldData = await GetStoredQuizzes(category)
            const getData = () => {
                if(data != undefined) return data
                if(oldData?.data) return oldData.data
                return [] 
            }
            let storeData:IGetStoreQuizzes = {
                data:getData(),
                id,
                index,
                skip:skip||oldData?.skip,
                limit:limit||oldData?.limit||5,
                total:total||(oldData?oldData?.total:0)
            }
            await Persit.setItemByObjectOrArray(KEY,storeData)
        } catch (error) {
            throw error
        }
    }