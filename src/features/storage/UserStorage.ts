// import moment  from "moment";
import { STORAGE_KEY, Storage } from "./localstorage";
// import { AES, enc } from 'crypto-js';
// import { ICreateShop } from "../../types/models/ICreateShop";
import { ILoginData } from "../../types/models/ILogin";

// let SALT =  "ABCD";
// export const StoreUserInfo = (data:{}) => {
//     let secret = moment().format("mmyydd");
//     Storage.setItem(STORAGE_KEY.date,secret);
    
//     let message= JSON.stringify(data);
//     const cipherText = AES.encrypt(message, SALT+secret);
//     Storage.setItem(STORAGE_KEY.user,cipherText.toString());
// }

// export const getStoreUserInfo = <T>() => {
//     try {
//         let secret = Storage.getItem(STORAGE_KEY.date);
//         let cipher = Storage.getItem(STORAGE_KEY.user);
//         let bytes = AES.decrypt(cipher||"", SALT + secret||"");
//         const decrypted = bytes.toString(enc.Utf8);
//         return JSON.parse(decrypted) as T;
//     } catch (error) {
        
//     }
// }

export const StoreUserInfo = (data:ILoginData) => {
    // let secret = moment().format("mmyydd");
    // Storage.setItem(STORAGE_KEY.date,secret);
    
    // let message= JSON.stringify(data);
    // const cipherText = AES.encrypt(message, SALT+secret);
    Storage.setItemByObjectOrArray(STORAGE_KEY.user,data);
}

export const getStoreUserInfo = <T>() => {
    try {
        let data:T|null = Storage.getItemByObjectOrArray(STORAGE_KEY.user)
        return data
    } catch (error) {
        return null
    }
}