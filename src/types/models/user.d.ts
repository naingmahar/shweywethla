interface ICreateUser{
  id?: number,
  name: string,
  device_id: string,
  device_info: string,
  device_name: string,
  phone?: string,
  password?: string,
  user_image?: string,
  referral?: string,
  dob?:string,
  gender?:string,
}
interface IEsUser{
  id: number,
  name: string,
  phone?: string,
  password?: string,
  user_image?: string,
  referral?: string,
  my_referral:string,
  dob?:string,
  token?:string,
  gender?:string,
}

interface IFindUser{
  id:number,
  phone:string,
  device_id:string
}

export type TUserRes = IDefaultFormat<IUser>
export  {ICreateUser,IFindUser,IEsUser}