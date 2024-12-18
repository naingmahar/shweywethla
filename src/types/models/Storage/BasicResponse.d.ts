export interface BasicResponse <T>{
    data:{
        status: number
        data: T
        error: string
    }
  }
  
