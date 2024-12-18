export enum STORAGE_KEY  {
    token = "@token",
    shop = "@shop",
    user = "@us",
    date = "@dt",
    customer ="@customer"
}


class LocalStorage{

    setItem= (key:STORAGE_KEY,data:string) => {
        localStorage.setItem(key,data)
    }

    getItem= (key:STORAGE_KEY):string|null => {
        return localStorage.getItem(key)
    }

    removeItem = (key:STORAGE_KEY) => {
        localStorage.removeItem(key)
    }

    setItemByObjectOrArray = (key:STORAGE_KEY,data:{}|[]) => {
        let storeData = JSON.stringify(data);
        localStorage.setItem(key,storeData)
    }

    getItemByObjectOrArray<T>(key:STORAGE_KEY):T|null {
        let storeData = localStorage.getItem(key)
        if(storeData) return JSON.parse(storeData);
        return null;
    }
}


export const Storage = new LocalStorage()