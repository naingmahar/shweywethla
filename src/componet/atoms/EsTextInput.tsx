import { TextInput } from "react-native"
import { FlexContainer } from "./container/FlexContainer"
import { EsNormalText, EsSmallText } from "./EsText"
import { ESColor } from "./res/EsColor"

interface IEsTextInput{
    onChange:(text:string)=>any,
    errorMsg?:string,
    isError:boolean,
    label:string,
    placeHolder:string,
    type?:"default"|"email-address"|"phone-pad"
}

export const EsTextInput = (props:IEsTextInput) => {
    return (
        <FlexContainer noneBasicStyle style={{marginBottom:10,paddingHorizontal:10}}>
            <EsNormalText defaultColor="white">{props.label}</EsNormalText>
            <TextInput 
                keyboardType={props.type||"default"}
                onChangeText={props.onChange} 
                placeholder={props.placeHolder} 
                placeholderTextColor={"#aaaaaa"}
                style={{borderBottomColor:"#fff",color:"#fff",borderBottomWidth:0.5}} />
            {props.isError && <EsSmallText color={ESColor.bgRed}>{props.errorMsg||props.label+" cannot be empty."}</EsSmallText>}
        </FlexContainer>
    )
}