import { IDefaultFormat } from "./ILogin"

export interface IRegister {
    user: User
    token: string
  }
  
  export interface IUser {
    name: string
    email: string
    phno: string
    telegraph_chat_id: number
    updated_at: string
    created_at: string
    id: number
  }
  

export type TRegister = IDefaultFormat<Register>