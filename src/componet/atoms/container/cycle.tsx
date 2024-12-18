import { FC } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { EsCycleSize } from "../res/EsCommon"
import { FlexView } from "./FlexContainer"
import { IContainerProps } from "../Types/IContinerProps"

export interface ICycleProps {
    children?:React.ReactNode
    styles?:StyleProp<ViewStyle>
    size:EsCycleSize
} 
export const Cycle:FC<IContainerProps&ICycleProps> = (props) => {
    return (
        <FlexView {...props} noneBasicStyle style={[
            {
                justifyContent:"center",
                alignItems:"center",
                width:props.size,
                height:props.size,
                borderRadius:props.size/2
            }
            ,props.styles]}>{props.children}</FlexView>
    )
}