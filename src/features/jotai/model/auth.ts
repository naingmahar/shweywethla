import AsyncStorage from "@react-native-async-storage/async-storage";
import { IEsUser } from "../../../types/models/user";
import { JotaiPersistence,JotaiPersistenceKey } from "../config";

export const AuthAtom =  JotaiPersistence<IEsUser>(JotaiPersistenceKey.auth,undefined)
export const GetUser = async ():Promise<IEsUser> => {
    const data  = (await AsyncStorage.getItem(JotaiPersistenceKey.auth))
    return data ? JSON.parse(data) : null
}