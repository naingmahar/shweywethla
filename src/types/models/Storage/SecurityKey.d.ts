import { BasicResponse } from "./BasicResponse"

export interface ISecurtiyKey{
    privateKey: string
    publicKey: string
    id: number
}

export type ISecurtiyKeyRes = BasicResponse<ISecurtiyKey>

