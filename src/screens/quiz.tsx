import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlexContainer, FlexRowContainer, FlexView } from "../componet/atoms/container/FlexContainer";
import { useGetAllQuizzes } from "../features/query/products/getAllInfo";
import { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MainNav, RootStackParamList } from "../nav/main.nav";
import { Text, ToastAndroid, Vibration, View } from "react-native";
import { Colors } from "../res/color";
import { BgPhoto } from "../componet/atoms/Photo/BgPhoto";
import { EsNormalHeader, EsNormalText, EsSmallHeader, EsTextHeader } from "../componet/atoms/EsText";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { QuizButton } from "../componet/atoms/container/EsButton";
import mobileAds, { BannerAd, BannerAdSize, MaxAdContentRating, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import * as Progress from 'react-native-progress';
import { useRecoilState } from "recoil";
import { quizIndexState } from "../features/recoilState";
import { ESColor } from "../componet/atoms/res/EsColor";
import { Icon, IconKey, IconsSize } from "../componet/atoms/icons";
import { updateQuizStorageInfo } from "../features/storage/QuizStore";
import LottieView from "lottie-react-native";
import { BackgroundMusic } from "../componet/atoms/music";
import TrackPlayer from "react-native-track-player";

type IProps = NativeStackScreenProps<RootStackParamList, 'Quizzes'>;

const adUnitId2 = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1353250294440692/1557238259';


export const Quizzes = (props:IProps) => {
    const getQuizzesByCategory = useGetAllQuizzes();
    const [ans,setAns] = useState<number>(0)
    // const [index,setIndex] = useState(0); 

    const [currentQuizInfo,setNextQuizInfo] = useRecoilState(quizIndexState)

    useEffect(()=>{
        console.log("currentQuizInfo",currentQuizInfo)
        if(currentQuizInfo) getQuizzesByCategory.mutate(currentQuizInfo.categoryId)
    },[])

    useEffect(()=>{
        TrackPlayer.play();
    },[])


    let getRow =(index:number) => {
        // console.log("index",index,currentQuizInfo)
        if( 
            getQuizzesByCategory.data &&
            getQuizzesByCategory.data.data && 
            getQuizzesByCategory.data.data[index]) return getQuizzesByCategory.data.data[index]
        return {
            id: 0,
            description: "",
           ans:"",
            q1:"", 
            q2:"", 
            q3:"", 
            q4:"", 
            q5:"", 
            q6:"", 
            image: "",
            isTesting: true
        }
    }

    //@ts-ignore
    let QuestionArr:Array<"q1"|"q2"|"q3"|"q4"> = ["q1","q2","q3","q4"]

      // No advert ready to show yet
    //   if (!loaded) {
    //     return <FlexContainer fullFlex centerAlign>
    //         <Progress.Circle 
    //                 size={100} 
    //                 indeterminate
    //                 thickness={10} 
    //                 color={Colors.progressCycle} 
    //             />
    //     </FlexContainer> ;
    //   }

    // const showToastWithGravityAndOffset = (isTrue:boolean) => {
    //     ToastAndroid.showWithGravityAndOffset(
    //       isTrue?'Congratulation , Your answer is correct.':'Oops, Your answer is wrong!',
    //       ToastAndroid.SHORT,
    //       ToastAndroid.CENTER,
    //       50,
    //       100,
    //     );
    //   };

    const _onChooseAns = (ans:number) => {
        setAns(ans)
        let currentQuizData =  getRow(currentQuizInfo.index)
        console.log(ans,currentQuizData.ans )
        if(currentQuizData.ans !== String(ans)){ 
            Vibration.vibrate([10,5,8,20])
            // showToastWithGravityAndOffset(false)
        }
        // showToastWithGravityAndOffset(true)
    }

   const getBorderColor = (currentAns:number) => {
        let currentQuizData =  getRow(currentQuizInfo.index)

        if(String(currentAns) == currentQuizData.ans && ans == currentAns) return Colors.infoCard
        else if(ans == currentAns) return Colors.reject
        else return "white"
    }

    // console.log("QUIZ DATA",getQuizzesByCategory.data)
    // console.log("QUIZ DATA 2",currentQuizInfo.index,getRow(currentQuizInfo.index))

    if(getQuizzesByCategory.status == "pending"){
        return (
            <FlexContainer fullFlex centerAlign style={{backgroundColor:"rgba(76, 175, 80, 0.2)"}}>
                <LottieView
                    source={require("../assets/sk.json")}
                    style={{width: "100%",height:"90%"}}
                    autoPlay
                    loop
                />
                <EsNormalHeader style={{position:"absolute",bottom:300}}>ကျေးဇူးပြု၍ခေတ္တစောင့်ပါ။</EsNormalHeader>

                <FlexContainer shadow useDefaultBtnStyle isTouchable fullWidth style={{backgroundColor:Colors.infoCard}} onPress={()=>{props.navigation.navigate("Home")}}>
                    <EsNormalText noneBasicStyle isBtnText>Back To Home</EsNormalText>
                </FlexContainer>
            </FlexContainer>
    )
    }
    
    if(currentQuizInfo.index >= (getQuizzesByCategory.data?.data||[]).length) {
        return(
            <FlexView centerAlign fullFlex style={{marginBottom:20}}>
                <FlexRowContainer fullFlex centerAlign> 
                    <EsTextHeader color={ESColor.gray}> Congratuations, you've completed this quiz!</EsTextHeader>
                </FlexRowContainer>
                <FlexContainer shadow useDefaultBtnStyle isTouchable fullWidth style={{backgroundColor:Colors.infoCard}} onPress={()=>{props.navigation.navigate("Home")}}>
                    <EsNormalText noneBasicStyle isBtnText>Back To Home</EsNormalText>
                </FlexContainer>
            </FlexView>
        )
    }

    return(
        <FlexView noneBasicStyle fullFlex style={{backgroundColor:"#fafafa"}}>
            <BackgroundMusic />
            <BannerAd
                unitId={adUnitId2}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    networkExtras: {
                    collapsible: 'bottom',
                    },
                }}
            />
            <FlexContainer fullFlex>
                <FlexContainer shadow fullFlex style={{backgroundColor:"#fff",borderRadius:10,borderWidth:1,borderColor:"rgba(76, 175, 80, 0.2)"}}>
                    {
                        getRow(currentQuizInfo.index) != undefined &&
                        (<FlexView noneBasicStyle centerAlign style={{borderRadius:10,backgroundColor:"rgba(76, 175, 80, 0.2)",paddingVertical:10}}>
                            <FlexView noneBasicStyle centerAlign style={{paddingHorizontal:5}}> 
                                <EsNormalText style={{fontWeight:"400",lineHeight:25}}>{getRow(currentQuizInfo.index).description}</EsNormalText>
                                <BgPhoto uri={getRow(currentQuizInfo.index).image} style={{width:80,height:80}}  />
                            </FlexView>
                        </FlexView>)
                    }
                    <FlexView>
                    {
                        getRow(currentQuizInfo.index) != undefined &&
                        QuestionArr.map((question,rowIndex)=>{
                            if(getRow(currentQuizInfo.index)[question] != null){
                                return(
                                    <FlexRowContainer 
                                        key={question} 
                                        shadow 
                                        style={{
                                            padding:8,
                                            marginVertical:10,
                                            borderRadius:10,
                                            backgroundColor:"white",
                                            borderWidth:1,
                                            borderColor:getBorderColor(rowIndex+1)
                                        }} 
                                        noneBasicStyle 
                                        isTouchable 
                                        fullWidth
                                        onPress={()=>{
                                            _onChooseAns(rowIndex+1)
                                        }}>
                                        <BouncyCheckbox 
                                            size={20}  
                                            fillColor={getBorderColor(rowIndex+1)}
                                            unFillColor={"#fff"}
                                            iconStyle={{ borderColor: "red",borderWidth:1 }}
                                            isChecked={rowIndex+1 == ans}         
                                            iconComponent={
                                                getRow(currentQuizInfo.index).ans !== String(rowIndex+1) && ans == rowIndex+1
                                                ? <Icon icon={IconKey.close} size={IconsSize.xs} className={{color:"white",fontWeight:"800"}} />
                                                :null
                                            }
                                            onPress={(isChecked: boolean) => {setAns(rowIndex+1)}} />
                                        <EsNormalText noneBasicStyle>{getRow(currentQuizInfo.index)[question]||""}</EsNormalText>
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
                        <EsNormalText noneBasicStyle  style={{textAlign:"center",fontWeight:"600"}}>Cancel</EsNormalText>
                    </FlexContainer>
                    <FlexContainer 
                        centerAlign 
                        fullFlex 
                        shadow 
                        isTouchable={String(ans) == getRow(currentQuizInfo.index).ans} 
                        onPress={()=>{
                            // rewarded.show();
                            updateQuizStorageInfo(currentQuizInfo.categoryId,currentQuizInfo.index+1,getRow(currentQuizInfo.index).id)
                            .then(param=>{
                                // console.log("CURRENT PARAM",param)
                                setNextQuizInfo({index:param.index,categoryId:currentQuizInfo.categoryId,id:param.id})
                            })   
                            props.navigation.navigate("ADS") 
                    }} style={{backgroundColor:(String(ans) == getRow(currentQuizInfo.index).ans) ? Colors.nav : Colors.disable,borderRadius:20,marginLeft:10}}>
                        <Text style={{textAlign:"center",color:"white",fontWeight:"600"}}>Next</Text>
                    </FlexContainer>
                </FlexRowContainer>
            </FlexContainer>
        </FlexView>
    )
}