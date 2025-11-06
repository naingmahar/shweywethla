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
import mobileAds, { AdEventType, BannerAd, BannerAdSize, MaxAdContentRating, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { ESColor } from "../componet/atoms/res/EsColor";
import LottieView from "lottie-react-native";
import { setRecordAdWatch } from "../services/recordAdsWatch";
import { downloadFile } from "../utils/downloadFile";

type IProps = NativeStackScreenProps<RootStackParamList, 'ADS'>;


const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-1353250294440692/4940249375';
const adUnitId2 = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1353250294440692/1557238259';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
keywords: ['game','fashion', 'clothing'],
});

export const ADS = (props:IProps) => {

    const [loaded, setLoaded] = useState(false);
    const [downloading,setDownloading] = useState(false)
    // const book = props.route.params as IBook;
    const book = props.route.params;

  useEffect(() => {
    console.log('Set loading ');
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, (reward) => {
        console.log('Set loading True ',reward);
      setLoaded(true);
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        // fetchCreateHistory({coin:1,quiz:String(currentQuizInfo.id)})
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    const unsubscribAdClose = rewarded.addAdEventListener(AdEventType.CLOSED,()=>{
      console.log('User close');
        setRecordAdWatch().then(()=>{
        setDownloading(true)
        downloadFile(book)
            .then((downloadedBook)=>{
                if(downloadedBook) {
                    props.navigation.popToTop()
                    props.navigation.navigate(MainNav.Reader,downloadedBook)
                  }
            })
          // props.navigation.goBack()
        })
    })  

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribAdClose();
    };
  }, []);

  // useEffect(()=>{
  //   downloadFile(book)
  //   .then((downloadedBook)=>{
  //       if(downloadedBook) {
  //           props.navigation.popToTop()
  //           props.navigation.navigate(MainNav.Reader,downloadedBook)
  //         }
  //   })
  // },[])

  

    const requestMobileAds = () => {
        mobileAds()
            .setRequestConfiguration({
                // Update all future requests suitable for parental guidance
                maxAdContentRating: MaxAdContentRating.PG,

                // Indicates that you want your content treated as child-directed for purposes of COPPA.
                tagForChildDirectedTreatment: true,

                // Indicates that you want the ad request to be handled in a
                // manner suitable for users under the age of consent.
                tagForUnderAgeOfConsent: true,


                // An array of test device IDs to allow.
                testDeviceIdentifiers: ['EMULATOR'],
                
            })
            .then(() => {
                console.log(" Request config successfully set!")
                // Request config successfully set!
            });
    }

    useEffect(()=>{
        requestMobileAds()  
        // TrackPlayer.pause()      
        // initMobileAds()
    },[])

    useEffect(()=>{
        if(loaded) {rewarded.show()}
        // props.navigation.popToTop()
        // props.navigation.navigate("Quizzes")
    },[loaded])
  
        return <FlexContainer fullFlex centerAlign style={{backgroundColor:"rgba(76, 175, 80, 0.2)"}}>
            { !downloading && <LottieView
                  source={require("../assets/Books-stack.json")}
                  style={{width: "100%",height:"40%"}}
                  autoPlay
                  loop
                />
            }
            { downloading && <LottieView
                  source={require("../assets/Downloading.json")}
                  style={{width: "100%",height:"30%"}}
                  autoPlay
                  loop
                />
            }
           { !downloading && <EsSmallHeader color={ESColor.gray}>များများဖတ်လေ ဗဟုသုတတိုးလေ</EsSmallHeader>}
           { downloading && <EsSmallHeader color={ESColor.gray}>Downloading Book .....</EsSmallHeader>}
        </FlexContainer> ;
}