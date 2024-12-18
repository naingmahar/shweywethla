import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native"
import { IEsButtonProps } from "../Types/IButtonProps"
import { FC } from "react"
import { ESColor } from "../res/EsColor"

export const EsButton:FC<IEsButtonProps> = (props) => {
    return (
        <TouchableOpacity style={[styles.base,props.isDisible||props.loading?styles.isDisible:{},props.loading?styles.loading:{},props.style]} onPress={props.onPress}>
            {props.loading && <ActivityIndicator size="small" style={{paddingRight:10}} color="#ffffff" />}
            <Text style={[styles.baseColor,props.textStyle]}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export const QuizButton:FC<IEsButtonProps> = (props) => {
    return (
        <TouchableOpacity style={[styles.quizBase,props.isDisible||props.loading?styles.isDisible:{},props.loading?styles.loading:{},props.style]} onPress={props.onPress}>
            {props.loading && <ActivityIndicator size="small" style={{paddingRight:10}}  />}
            <Text style={[styles.quizBaseColor,props.textStyle]}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    base:{
        paddingHorizontal:10,
        paddingVertical:18,
        borderRadius:30,
        margin:10,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:ESColor.bgButton
    },
    quizBase:{
        paddingHorizontal:10,
        paddingVertical:18,
        borderRadius:30,
        margin:10,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#ffffff"
    },
    loading:{
        flexDirection:"row",
    },
    isDisible:{
        backgroundColor:ESColor.gray
    },
    baseColor:{
        color:"#fff",
        fontSize:16,
        fontWeight:"500"
    },
    quizBaseColor:{
        color:"black",
        fontSize:14,
    }
})