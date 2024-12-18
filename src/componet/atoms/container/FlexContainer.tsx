import { FC } from "react";
import { IContainerProps } from "../Types/IContinerProps";
import { Dimensions, ImageBackground, StyleSheet, View ,TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native";
import { KeyboardAvoidingView } from "react-native";


export const FlexView:FC<IContainerProps> = (props) =>{
    let combineStyles = [
        props.noneBasicStyle ? {}:styles.base,
        props.centerAlign ? styles.centerAlign : {},
        props.fullWidth ? styles.fullWidth :{},
        props.fullFlex ? styles.fullFlex : {},
        props.spaceBetween ? styles.spaceBetween:{},
        props.shadow ? styles.shadow :{},
        props.transparent ? styles.transparent : {},
        props.style,
    ]
    if(props.isTouchable) return <TouchableOpacity onPress={props.onPress} style={combineStyles}>{props.children}</TouchableOpacity>
    if(props.KeyboardAvoidingView) return <KeyboardAvoidingView style={combineStyles}>{props.children}</KeyboardAvoidingView>
    return  <View style={combineStyles}>{props.children}</View>
}

export const FlexContainer:FC<IContainerProps> = (props) => {
    return <FlexView
                {...props} 
                style={[
                    styles.baseColunm,
                    props.style,
                ]} 
            >{props.children}</FlexView>
}

export const FlexRowContainer:FC<IContainerProps> = (props) => {
    return  <FlexView 
                {...props}
                style={[
                    styles.baseRow,
                    props.style
                ]}>{props.children}</FlexView>
}

export const SafeAreaContainer:FC<IContainerProps> = (props) => {
    return <SafeAreaView style={[styles.base,props.style]} >{props.children}</SafeAreaView>
}


export const CubicContainer:FC<IContainerProps> = (props) => {
    let width = Dimensions.get("window").width
    return <View style={[{width,height:width},props.style]} >{props.children}</View>
}

export const ImgBgContainer:FC<IContainerProps & {source:any}> = (props) => {
    let width = Dimensions.get("window").width
    return <ImageBackground source={props.source} style={[{width,height:width},props.style]} >{props.children}</ImageBackground>
}

const  styles = StyleSheet.create({
    base:{
        padding:15,
    },
    fullFlex:{
        flex:1,
    },
    fullWidth:{
        width:"100%"
    },
    centerAlign:{
        justifyContent:"center",
        alignItems:"center"
    },
    spaceBetween:{
        alignItems:"center",
        justifyContent:"space-between"
    },
    baseColunm:{
    },
    baseRow:{
        flexDirection:"row",
    },
    transparent:{
        backgroundColor:"rgba(255,255,255,0.4)"
    },
    shadow:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }

})