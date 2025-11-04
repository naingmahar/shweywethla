import { Colors } from "react-native/Libraries/NewAppScreen"
import { EsNormalText, EsTextHeader } from "../../componet/atoms/EsText"
import { FlexContainer, FlexRowContainer, FlexView } from "../../componet/atoms/container/FlexContainer"
import { ESColor } from "../../componet/atoms/res/EsColor"
import { View } from "react-native"

export const CompleteQuiz = (props:{isLoading:boolean,isCompleted:boolean,onPress:()=>any}) => {
    if(props.isLoading || !props.isCompleted) return <View />
    return(
        <FlexView centerAlign fullFlex style={{marginBottom:20}}>
            <FlexRowContainer fullFlex centerAlign> 
                <EsTextHeader color={ESColor.gray}> Congratuations, you've completed this quiz!</EsTextHeader>
            </FlexRowContainer>
            <FlexContainer shadow useDefaultBtnStyle isTouchable fullWidth style={{backgroundColor:Colors.infoCard}} onPress={props.onPress}>
                <EsNormalText noneBasicStyle isBtnText>Back To Home</EsNormalText>
            </FlexContainer>
        </FlexView>
    )
}