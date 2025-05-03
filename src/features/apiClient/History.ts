import { ICreateHistory, IDashboard, IHistory, TCreateHistoryRes, TDashboardRes } from "../../types/models/history";
import { instance } from "./config/Instance";
import { END_POINT } from "./config/endpoint";

export const fetchCreateHistory = async (param:ICreateHistory):Promise<TCreateHistoryRes> => {
    let res = await instance.post(END_POINT.history,param);
    return res.data
}

export const fetchDashboard = async (param:{date:string}):Promise<IDashboard> => {
    let res = await instance.get(END_POINT.dashboard+`?date=${param.date}`);
    return res.data
}

