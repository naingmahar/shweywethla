import { Text } from "react-native";
import { FlexRowContainer } from "./FlexContainer"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Icon, IconKey } from "../icons";
import { Colors } from "../../../res/color";
import { useState } from "react";

interface IEsChooseItem {
    label: string,
    icon: IconKey,
    isActive?:boolean,
    onPress: (index:number|string) => any,
    value:number|string

}
export const EsRadioItem = (props:IEsChooseItem) => {
    return (
        <FlexRowContainer
            shadow
            style={{
                padding: 8,
                // marginVertical: 10,
                borderRadius: 10,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor:props.isActive?Colors.nav:"white",
                marginRight:20,
                minWidth:80,
            }}
            noneBasicStyle
            centerAlign
            isTouchable
            // fullWidth
            onPress={() => props.onPress(props.value)}>
            <Icon icon={props.icon} />
            <Text>{props.label}</Text>
        </FlexRowContainer>
    )
}

interface IEsRadioContainer{
    data:{
        label: string,
        value:number|string,
        icon: IconKey,
    }[],
    onChange:(val:string|number)=>any
}

export const EsRadioContainer = (props:IEsRadioContainer)=>{
    const [active,setActive] = useState<string|number>()

    return (
        <FlexRowContainer noneBasicStyle style={{marginBottom:20,}}>
            {props.data.map((item)=>
                <EsRadioItem 
                    key={item.value}
                    {...{...item,...{isActive:active == item.value}}} 
                    onPress={(val)=>{
                        props.onChange(val)
                        setActive(val)
                    }} 
                />
            )}
        </FlexRowContainer>
    )
}