import { ELABELS } from "../assets/static_string";
import { IconKey } from "../componet/atoms/icons";

export interface IInput {
    label?:ELABELS,
    placeholder:ELABELS,
    onChange:(data:string)=>void,
    className?:string,
    inputStyle?:string;
    icon?:IconKey;
    type?:"text"|"email"|"password"|"number"|"tel";
    value?:string;
    onKeydown?:(e:React.KeyboardEvent<HTMLInputElement>)=>void,
    disabled?:boolean
}