import { IQuiz } from "../../types/models/IQuiz";
import { Persit, STORAGE_KEY } from "./localstorage";

export const ValidateIsOldParam = async<T>(storageKey:STORAGE_KEY,param:T) =>{
    const PARAM_KEY = storageKey+"_KEY"
    const oldKey = await Persit.getItemByObjectOrArray(PARAM_KEY)

    console.log(JSON.stringify(param) , JSON.stringify(oldKey))
    if(!oldKey){
        // Persit.setItemByObjectOrArray(PARAM_KEY,param as {})
        console.log("MY NAD")
        return false
    }

    if(JSON.stringify(param) == JSON.stringify(oldKey)){
        return true
    }

    return false
}


