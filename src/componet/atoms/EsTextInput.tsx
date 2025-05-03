import { StyleSheet, TextInput } from "react-native"
import { FlexContainer, FlexRowContainer } from "./container/FlexContainer"
import { EsNormalText, EsSmallText } from "./EsText"
import { ESColor } from "./res/EsColor"
import { Icon, IconKey } from "./icons"
import { createRef } from "react"

export interface IEsTextInput{
    onChange:(text:string|any)=>any,
    errorMsg?:string,
    isError:boolean,
    label:string,
    icon?:IconKey,
    placeHolder:string,
    type?:"default"|"email-address"|"phone-pad"
    onFocus?:()=>any
    value?:string
}

export const EsTextInput = (props:IEsTextInput) => {
    const textRef = createRef<TextInput>();
    return (
        <FlexRowContainer noneBasicStyle style={styles.container} isTouchable onPress={()=>{textRef.current?.focus()}}>
            {props.icon && <Icon icon={props.icon} className={{marginRight:5}} />}
            <TextInput 
                value={props.value}
                keyboardType={props.type||"default"}
                onChangeText={props.onChange} 
                onFocus={props.onFocus ? props.onFocus : () => {}}
                placeholder={props.placeHolder} 
                placeholderTextColor={"#aaaaaa"}
                ref={textRef}
                style={{borderBottomColor:"rgba(0,0,0,0)",color:"#000",borderBottomWidth:0.5}} />
            {props.isError && <EsSmallText color={ESColor.bgRed}>{props.errorMsg||props.label+" cannot be empty."}</EsSmallText>}
        </FlexRowContainer>
    )
}

const styles = StyleSheet.create({
    container:{
        marginBottom:25,
        paddingHorizontal:10,
        alignItems:"center",
        borderWidth:1,
        borderColor:"rgba(0,0,0,0.3)",
        borderRadius:10
    }
})