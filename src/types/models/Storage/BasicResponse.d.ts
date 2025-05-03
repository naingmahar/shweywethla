export interface BasicResponse <T>{
    data:{
        status: number
        data: T
        error: string
    }
  }
  


export interface IPagination<T>{
    skip:number,
    limit:number,
    total:number,
    data:T,
    index:number,
    id:number
}