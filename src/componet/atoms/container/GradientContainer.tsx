import LinearGradient from "react-native-linear-gradient"
import { GradientColor } from "../../../res/color"
import { StyleProp, ViewStyle } from "react-native"
import { FC, JSX } from "react"

export interface IGradientContainer {
    style?:StyleProp<ViewStyle>,
    children:JSX.Element|JSX.Element[]
}
export const GradientContainer:FC<IGradientContainer> = (props) => { 
    return (
        <LinearGradient
          colors={[GradientColor[3], GradientColor[1], GradientColor[2]]}
          locations={[0.0, 0.5, 1.0]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={props.style}
        >
            {props.children}
        </LinearGradient>
    )
}