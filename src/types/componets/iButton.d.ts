import { ELABELS } from "../../assets/static_string";
import { IconKey, IconsSize } from "../../componet/atoms/icons";

export interface IButton  {
    label:ELABELS,
    onPress: (e:any) => any; 
    className?:string;
    active?:boolean;
    icon?:IconKey
    iconClass?:string
    iconSize?:IconsSize
    isLoading?:boolean
    labelClass?:HTMLProps<HTMLElement>["className"];
}