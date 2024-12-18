import { ButtonProps, StyleProp, TextProps, TextStyle, ViewStyle } from "react-native";

export interface IEsButtonProps{
    title:string,
    style?:StyleProp<ViewStyle>,
    textStyle?:StyleProp<TextStyle>,
    isDisible?:boolean,
    loading?:boolean,
    onPress:()=>void;
} 