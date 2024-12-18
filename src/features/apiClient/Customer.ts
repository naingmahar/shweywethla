import { TAllCustomer } from "../../types/models/ICustomer"
import { instance } from "./config/Instance"
import { END_POINT } from "./config/endpoint"

export const fetchAllCustomer = ():Promise<TAllCustomer> => {
    return instance.get(END_POINT.customer)
}