import LottieView from "lottie-react-native"
import { FlexContainer } from "../../componet/atoms/container/FlexContainer"
import { EsNormalHeader, EsNormalText } from "../../componet/atoms/EsText"
import { View } from "react-native"

export const QuizLoading = (props:{isLoading:boolean,onPress:()=>any}) => {
    if(!props.isLoading) return <View />
    return(
        <FlexContainer fullFlex centerAlign style={{backgroundColor:"rgba(76, 175, 80, 0.2)"}}>
            <LottieView
                source={require("../../assets/sk.json")}
                style={{width: "100%",height:"90%"}}
                autoPlay
                loop
            />
            <EsNormalHeader style={{position:"absolute",bottom:300}}>ကျေးဇူးပြု၍ခေတ္တစောင့်ပါ။</EsNormalHeader>

            <FlexContainer 
                shadow 
                useDefaultBtnStyle 
                isTouchable 
                fullWidth 
                style={{backgroundColor:"#fafafa"}}
                onPress={props.onPress}>
                <EsNormalText noneBasicStyle isBtnText>Back To Home</EsNormalText>
            </FlexContainer>
        </FlexContainer>
    )
}