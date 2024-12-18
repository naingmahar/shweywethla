import { useMutation } from "@tanstack/react-query";
import { fetchCreateProduct } from "../../apiClient/Products";
import { TProductRes,ICreateProduct } from "../../../types/models/IProducts";

export const useCreateProduct = () => {
    return useMutation<TProductRes, Error, ICreateProduct>(fetchCreateProduct);
};