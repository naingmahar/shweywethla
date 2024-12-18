import { ReactNode } from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { ESCardColor, ESColor } from "../res/EsColor";

export interface ITextProps {
    children:string|ReactNode,
    style?:StyleProp<TextStyle>,
    defaultColor?:"black"|"white",
    alignCenter?:boolean,
    noneBasicStyle?:boolean,
    color?:ESColor,
    onPress?:()=>any
}