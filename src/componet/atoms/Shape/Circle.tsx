import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native"

type ICircleProps = PropsWithChildren<{
    size: number;
    style: StyleProp<ViewStyle>
}>;

export const Circle = (props: ICircleProps) => {
    return <View style={[
        { 
            width: props.size, 
            height: props.size, 
            borderRadius: props.size / 2,
            justifyContent:"center",
            alignItems:"center",
        }, props.style]}>
            {props.children}
    </View>
}