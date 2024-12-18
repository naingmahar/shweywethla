import React from "react";
import { StyleProp, ViewProps, ViewStyle } from "react-native";

export interface IContainerProps {
    style?:StyleProp<ViewStyle>,
    children:React.ReactNode,
    noneBasicStyle?:boolean,
    centerAlign?:boolean,
    fullWidth?:boolean,
    isTouchable?:boolean,
    onPress?:()=>void,
    fullFlex?:boolean,
    spaceBetween?:boolean,
    KeyboardAvoidingView?:boolean,
    shadow?:boolean
    transparent?:boolean
}