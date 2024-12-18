import { instance } from "../apiClient/config/Instance"
import { STORAGE_KEY, Storage } from "./localstorage"

export const isLogin = () => {
    let token =  Storage.getItem(STORAGE_KEY.token)
    if(token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}` 
        return true
    }
    return false
}
