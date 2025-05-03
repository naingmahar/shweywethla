import { StyleProp, StyleSheet, ViewProps } from "react-native"
import { FlexRowContainer } from "./container/FlexContainer"
import { Icon, IconKey } from "./icons"
import { EsText } from "./res/EsResText"
import { EsNormalText } from "./EsText"
import { Colors } from "../../res/color"

export interface IEsPickup {
    label:string,
    val:string,
    icon:IconKey,
    style?:StyleProp<ViewProps>,
    onPress:() => any
}
export const EsPickup = (props:IEsPickup) => {
    return(
        <FlexRowContainer isTouchable onPress={props.onPress} fullFlex noneBasicStyle style={[props.style,styles.box]}>
            <Icon icon={props.icon}  />
            <EsNormalText noneBasicStyle>{props.val || props.label}</EsNormalText>
            <Icon icon={IconKey.dropDown} className={{color:"rgba(0,0,0,1)"}} />
        </FlexRowContainer>
    )
}

const styles = StyleSheet.create({
    box:{
        borderWidth:1,
        borderColor:Colors.nav,
        borderRadius:10,
        paddingHorizontal:5,
        paddingVertical:3,
        justifyContent:"space-between",
        marginBottom:20
    }
})