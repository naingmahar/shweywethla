import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlexContainer, FlexRowContainer, FlexView } from "../componet/atoms/container/FlexContainer";
import { useGetAllQuizzes } from "../features/query/products/getAllInfo";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainNav, RootStackParamList } from "../nav/main.nav";
import { Text, View } from "react-native";
import { Colors } from "../res/color";
import { BgPhoto } from "../componet/atoms/Photo/BgPhoto";
import { EsNormalHeader, EsNormalText, EsSmallHeader, EsTextHeader } from "../componet/atoms/EsText";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { QuizButton } from "../componet/atoms/container/EsButton";


type IProps = NativeStackScreenProps<RootStackParamList, 'Quizzes'>;

export const Quizzes = (props:IProps) => {
    const getQuizzesByCategory = useGetAllQuizzes();
    const [ans,setAns] = useState<number>(0)

    useEffect(()=>{
        getQuizzesByCategory.mutate(props.route.params.category)
    },[])

    let row = getQuizzesByCategory.data?getQuizzesByCategory.data[1]:undefined
    let QuestionArr:Array<"q1"|"q2"|"q3"|"q4"|"q5"|"q6"> = ["q1","q2","q3","q4","q5","q6"]

    return(
        <FlexView fullFlex style={{backgroundColor:"#fafafa"}}>
            <FlexContainer shadow fullFlex style={{backgroundColor:"#fff",borderRadius:10,borderWidth:1,borderColor:"rgba(76, 175, 80, 0.2)"}}>
                {
                    row != undefined &&
                    (<FlexView noneBasicStyle centerAlign style={{borderRadius:10,backgroundColor:"rgba(76, 175, 80, 0.2)",paddingVertical:10}}>
                        <FlexView noneBasicStyle centerAlign style={{paddingHorizontal:5}}> 
                            <EsNormalText style={{fontWeight:"400",lineHeight:25}}>{row.description}</EsNormalText>
                            <BgPhoto uri={row.image} style={{width:80,height:80}}  />
                        </FlexView>
                    </FlexView>)
                }
                <FlexView>
                {
                    row != undefined &&
                    QuestionArr.map((question,index)=>{
                        if(row[question] != null){
                            return(
                                <FlexRowContainer 
                                    key={question} 
                                    shadow 
                                    style={{padding:8,marginVertical:10,borderRadius:10,backgroundColor:"white",borderWidth:1,borderColor:ans== index+1?Colors.progressCycle:"white"}} 
                                    noneBasicStyle 
                                    isTouchable 
                                    fullWidth
                                    onPress={()=>{setAns(index+1)}}>
                                    <BouncyCheckbox 
                                        size={20}  
                                        fillColor={Colors.progressCycle}
                                        unFillColor="#FFFFFF"
                                        isChecked={index+1 == ans}         
                                        onPress={(isChecked: boolean) => {setAns(index+1)}} />
                                    <Text>{row[question]||""}</Text>
                                </FlexRowContainer>
                            )
                        }
                        else{
                            return 
                        }
                    })
                }
                </FlexView>
            </FlexContainer>

            <FlexRowContainer fullWidth spaceBetween>
                <FlexContainer centerAlign fullFlex shadow isTouchable onPress={()=>{props.navigation.navigate(MainNav.HOME)}} style={{backgroundColor:"white",borderRadius:20,marginRight:10}}>
                    <Text  style={{textAlign:"center",fontWeight:"600"}}>Cancel</Text>
                </FlexContainer>
                <FlexContainer centerAlign fullFlex shadow isTouchable onPress={()=>{}} style={{backgroundColor:Colors.progressCycle,borderRadius:20,marginLeft:10}}>
                    <Text style={{textAlign:"center",color:"white",fontWeight:"600"}}>Next</Text>
                </FlexContainer>
            </FlexRowContainer>
        </FlexView>
    )
}