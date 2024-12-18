import { Dimensions, StyleSheet, View } from "react-native"
import { Colors } from "../../res/color"
import { PropsWithChildren } from "react"

const InfoCardStyle = StyleSheet.create({
    container:{
        // minHeight:Dimensions.get("screen").height/3,
        paddingBottom:30,
        backgroundColor:Colors.infoCard,
        borderBottomLeftRadius:40,
        borderBottomRightRadius:40,
        paddingHorizontal:20,
    }
})

type IInfoCard = PropsWithChildren<{}>
export const InfoCard = (props:IInfoCard) => {
    return(
        <View style={InfoCardStyle.container}> 
            {props.children}
        </View>
    )
}