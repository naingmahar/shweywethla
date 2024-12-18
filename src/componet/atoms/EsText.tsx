import { FC } from "react";
import { ITextProps } from "./Types/ITextProps";
import { StyleSheet, Text } from "react-native";
import { ESColor } from "./res/EsColor";

export const BasicText:FC<ITextProps> = (props) => {
    return <Text 
            onPress={props.onPress}
            style={[
                props.noneBasicStyle ? {} :Styles.base,
                props.alignCenter ? {textAlign:"center"} :{},
                props.defaultColor == "white" ? {color:ESColor.textWhite}: {color:ESColor.textBlack},
                props.color ? {color:props.color} : {},
                props.style
            ]}>{props.children}</Text>
}

export const EsTextHeader:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[Styles.base,Styles.baseHeader,props.style]}
            >{props.children}</BasicText>
}

export const EsNormalHeader:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[
                    Styles.baseNormalHeader,
                    props.style
                ]}>{props.children}</BasicText>
}

export const EsSmallHeader:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[
                    Styles.baseSmall,
                    props.style
                ]}>{props.children}</BasicText>
}

export const EsSmallLightHeader:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[
                    Styles.baseLightSmall,
                    props.style
                ]}>{props.children}</BasicText>
}

export const EsXsHeader:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[
                    Styles.baseXsHeader,
                    props.style
                ]}>{props.children}</BasicText>
}

export const EsSCardHeader:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[
                    Styles.baseCardTitle,
                    props.style
                ]}>{props.children}</BasicText>
}

export const EsNormalText:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[
                    Styles.baseText,
                    props.style
                ]}>{props.children}</BasicText>
}

export const EsSmallText:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[
                    Styles.baseSmallText,
                    props.style
                ]}>{props.children}</BasicText>
}

export const EsXsText:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[
                    Styles.baseXsText,
                    props.style
                ]}>{props.children}</BasicText>
}

export const EsLargeText:FC<ITextProps> = (props) => {
    return <BasicText 
                {...props}
                style={[
                    Styles.baseLargeText,
                    props.style
                ]}>{props.children}</BasicText>
}



const Styles = StyleSheet.create({
    base:{
        marginTop:10,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    baseHeader:{
        // color:"#fff",
        fontSize:26,
        textAlign:"center",
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    baseNormalHeader:{
        fontSize:20,
        fontWeight:"700"
    },
    baseSmall:{
        fontSize:18,
        fontWeight:"700"
    },
    baseLightSmall:{
        fontSize:18,
    },
    baseXsHeader:{
        fontSize:14,
        fontWeight:"500"
    },
    baseText:{
        fontSize:15,
    },
    baseSmallText:{
        fontSize:13,
        letterSpacing:0.5,
    },
    baseXsText:{
        fontSize:10,
    },
    baseLargeText:{
        fontSize:18,
    },
    baseCardTitle:{
        fontSize:16,
        fontWeight:"400"
    }
})