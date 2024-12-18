import { FC } from "react"
import { EsNormalText, EsTextHeader } from "../EsText"
import { FlexContainer, FlexRowContainer } from "./FlexContainer"
import { ESColor } from "../res/EsColor"
import { StyleProp, ViewProps, ViewStyle } from "react-native"

export const SelectedInfoContainer:FC<{hideLabel?:boolean,label?:string,info?:string,title?:string,children?:React.ReactNode,style?:StyleProp<ViewStyle>}> = (props) => {
    return(
        <FlexContainer fullWidth style={{backgroundColor:ESColor.bgColor,minHeight:60}}>
            <FlexRowContainer style={props.style} fullWidth noneBasicStyle>
                {!props.hideLabel && <EsNormalText style={{marginRight:8}} color={ESColor.darkGray}>{props.label||"Selected:"}</EsNormalText>}
                {props.info != undefined && <EsNormalText defaultColor="white">{props.info}</EsNormalText>}
                {props.title != undefined && <EsTextHeader style={{color:ESColor.borderColor}}>{props.title}</EsTextHeader>}
                {props.children}
            </FlexRowContainer>
        </FlexContainer>
    )
}