import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native"
import { IEsButtonProps } from "../Types/IButtonProps"
import { FC } from "react"
import { ESColor } from "../res/EsColor"
import { Colors, GradientColor } from "../../../res/color"
import LinearGradient from "react-native-linear-gradient"


export const GradientButton:FC<IEsButtonProps> =(props) => {
  return (
    <TouchableOpacity disabled={props.isDisible}  onPress={props.onPress} 
    style={[
            props.isDisible||props.loading?styles.isDisible:{},
            props.loading?styles.loading:{}
        ]}>
      <LinearGradient
        colors={[GradientColor[6], GradientColor[1], GradientColor[2]]}
        locations={[0.0, 0.5, 1.0]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base,props.style]}
      >
        <Text style={[styles.baseColor,props.textStyle]}>{props.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const EsButton:FC<IEsButtonProps> = (props) => {
    return (
        <TouchableOpacity disabled={props.isDisible} style={[styles.base,props.style,props.isDisible||props.loading?styles.isDisible:{},props.loading?styles.loading:{}]} onPress={props.onPress}>
            {props.loading && <ActivityIndicator size="small" style={{paddingRight:10}} color="#ffffff" />}
            <Text style={[styles.baseColor,props.textStyle]}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export const QuizButton:FC<IEsButtonProps> = (props) => {
    return (
        <TouchableOpacity style={[styles.quizBase,props.style,props.isDisible||props.loading?styles.isDisible:{},props.loading?styles.loading:{}]} onPress={props.onPress}>
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
        backgroundColor:Colors.infoCard
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
        backgroundColor:ESColor.darkGray
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