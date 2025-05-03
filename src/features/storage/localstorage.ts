import AsyncStorage from '@react-native-async-storage/async-storage';

export enum STORAGE_KEY  {
    token = "@token",
    shop = "@shop",
    user = "@us",
    date = "@dt",
    customer ="@customer",
    quizInfo="@quizzes"
}


class LocalStorage{

    setItem= (key:STORAGE_KEY|string,data:string) => {
        AsyncStorage.setItem(key,data)
    }

    getItem= async (key:STORAGE_KEY|string):Promise<string|null> => {
        return AsyncStorage.getItem(key)
    }

    clearAll = () =>{
        AsyncStorage.clear()
    }

    removeItem = (key:STORAGE_KEY|string) => {
        AsyncStorage.removeItem(key)
    }

    setItemByObjectOrArray = (key:STORAGE_KEY|string,data:{}|[]) => {
        let storeData = JSON.stringify(data);
        AsyncStorage.setItem(key,storeData)
    }

    async getItemByObjectOrArray<T>(key:STORAGE_KEY|string):Promise<T|null> {
        let storeData = await AsyncStorage.getItem(key)
        if(storeData) return JSON.parse(storeData);
        return null;
    }
}


export const Persit = new LocalStorage()
export const Storage = new LocalStorage()