import { FC } from "react";
import { IContainerProps } from "../Types/IContinerProps";
import { FlexContainer, FlexRowContainer, FlexView } from "./FlexContainer";
import { Image, StyleSheet, View } from "react-native";
import { CardLeftSlideColors, ESCardColor, ESColor } from "../res/EsColor";
import { EsNormalText, EsSCardHeader, EsSmallHeader, EsSmallText } from "../EsText";
import { EsButton } from "./EsButton";

export const EsCardContainer:FC<IContainerProps> = (props) => {
    return (
        <FlexRowContainer style={[styles.base,styles.baseCardContainer,props.style]}>
            {props.children}
        </FlexRowContainer>
    )
}

export type IEsCardProps = IContainerProps& {
    flexDirection?:"row"|"column",
    backgroundColor?:ESCardColor
}
export const EsCard:FC<IEsCardProps> = (props) => {
    return (
        <FlexView 
            {...props} 
            style={[
                styles.base,
                {backgroundColor:props.backgroundColor||ESCardColor.black},
                props.flexDirection=="row"?{flexDirection:"row"}:{},
                props.style
            ]}>
            {props.children}
        </FlexView>
    )
}


export  interface IEsChooseCard  {
    icon:any,
    isUrl?:boolean,
    title:string,
    description:string,
    onPress?:()=>any
}

export const EsChooseCard:FC<IEsChooseCard&{index:number,onPress:()=>any}> = (props) => {
    return (
        <EsCard 
            noneBasicStyle 
            fullWidth
            style={{ marginVertical: 5,borderRadius:5}}  
            backgroundColor={ESCardColor.white} 
            flexDirection="row">

            <View style={{
                width:15,
                borderTopLeftRadius:5,
                borderBottomLeftRadius:5,
                backgroundColor:CardLeftSlideColors[(props.index % 4)]
            }} />
            <FlexContainer noneBasicStyle fullWidth style={{justifyContent:"center",paddingHorizontal:10}}>
                <FlexRowContainer noneBasicStyle style={{alignItems:"center",justifyContent:"space-around",paddingVertical:10}}>
                    <Image source={props.isUrl? {uri:props.icon} :props.icon} style={{width:25,height:28,marginRight:20}} />
                    <FlexContainer noneBasicStyle style={{width:"60%"}}>
                        <EsSCardHeader style={{marginTop:0}}>{props.title}</EsSCardHeader>
                        <EsSmallText>{props.description}</EsSmallText>
                    </FlexContainer>
                    <EsButton style={{width:80, height:40,paddingVertical:2}} onPress={props.onPress} title="Select" textStyle={{fontSize:12}} />
                </FlexRowContainer>
            </FlexContainer>
        </EsCard>
    )
}


const styles = StyleSheet.create({
    base:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    baseCardContainer:{
        borderRadius:5,
        marginTop:30,
        backgroundColor:ESColor.bgCard,
        marginHorizontal:20
    }
})