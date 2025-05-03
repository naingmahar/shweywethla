interface IHistory{
    id: number,
    user: string,
    coin: number,
    quiz: string,
    createdAt: Date
}

interface ICreateHistory{
    coin: number,
    quiz: string,
}


export type TCreateHistoryRes = IDefaultFormat<ICreateHistory>



export type TDashboardRes = IDefaultFormat<IDashboard>
export interface IDashboard {
    my: My
    referral: Referral
  }
  
  export interface My {
    todayCount: number
    totalCoin: number
    taskCompleted: boolean
    todayCoin: number
  }
  
  export interface Referral {
    todayCount: number
    totalCoin: number
    taskCompleted: number
    todayCoin: number
  }
  


export  {IHistory,ICreateHistory,TCreateHistoryRes}