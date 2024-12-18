export interface IReqLogin {
    email:string,
    password:string
}  

export type TLoginRes = IDefaultFormat<ILoginData>

export type TCheckEmail = IDefaultFormat;
export interface IDefaultFormat<T> {
    status:  string;
    data:    T;
    message: string;
}

interface ILoginData {
    user:  User;
    token: string;
}

interface IUser {
    id:                number;
    name:              string;
    email:             string;
    phno:              string;
    email_verified_at: null;
    telegraph_chat_id: number;
    created_at:        Date;
    updated_at:        Date;
}