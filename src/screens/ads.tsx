// import { NavigationProp, useNavigation } from "@react-navigation/native";
// import { FlexContainer, FlexRowContainer, FlexView } from "../componet/atoms/container/FlexContainer";
// import { useGetAllQuizzes } from "../features/query/products/getAllInfo";
// import { useEffect, useState } from "react";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { MainNav, RootStackParamList } from "../nav/main.nav";
// import { Text, View } from "react-native";
// import { Colors } from "../res/color";
// import { BgPhoto } from "../componet/atoms/Photo/BgPhoto";
// import { EsNormalHeader, EsNormalText, EsSmallHeader, EsTextHeader } from "../componet/atoms/EsText";
// import mobileAds, { AdEventType, BannerAd, BannerAdSize, MaxAdContentRating, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
// import { ESColor } from "../componet/atoms/res/EsColor";
// import LottieView from "lottie-react-native";
// import { setRecordAdWatch } from "../services/recordAdsWatch";
// import { downloadFile } from "../utils/downloadFile";

// type IProps = NativeStackScreenProps<RootStackParamList, 'ADS'>;


// const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-1353250294440692/4940249375';
// const adUnitId2 = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1353250294440692/1557238259';

// const rewarded = RewardedAd.createForAdRequest(adUnitId, {
// keywords: ['game','fashion', 'clothing'],
// });

// export const ADS = (props:IProps) => {

//     const [loaded, setLoaded] = useState(false);
//     const [downloading,setDownloading] = useState(false)
//     // const book = props.route.params as IBook;
//     const book = props.route.params;

//   useEffect(() => {
//     console.log('Set loading ');
//     const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, (reward) => {
//       console.log('Set loading True ',reward);
//       setLoaded(true);
//     });

//     const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (reward) => {
//       setDownloading(true)
//             downloadFile(book)
//             .then((downloadedBook)=>{
//                 if(downloadedBook) {
//                     props.navigation.popToTop()
//                     props.navigation.navigate(MainNav.Reader,downloadedBook)
//                   }
//             })
//     });

//     const unsubscribeEarned = rewarded.addAdEventListener(
//       RewardedAdEventType.EARNED_REWARD,
//       reward => {
//         console.log('User earned reward of ', reward);
//         // fetchCreateHistory({coin:1,quiz:String(currentQuizInfo.id)})
//       },
//     );

//     // Start loading the rewarded ad straight away
//     rewarded.load();

//     const unsubscribAdClose = rewarded.addAdEventListener(AdEventType.CLOSED,()=>{
//       console.log('User close',book);
//         setRecordAdWatch().then(()=>{
//           console.log("Success","ADS VIEWD")
//         }).finally(()=>{
//            setDownloading(true)
//             downloadFile(book)
//             .then((downloadedBook)=>{
//                 if(downloadedBook) {
//                     props.navigation.popToTop()
//                     props.navigation.navigate(MainNav.Reader,downloadedBook)
//                   }
//             })
//         })
//     })  

//     // Unsubscribe from events on unmount
//     return () => {
//       unsubscribeLoaded();
//       unsubscribeEarned();
//       unsubscribAdClose();
//       unsubscribeError();
//     };
//   }, []);

//   // useEffect(()=>{
//   //   downloadFile(book)
//   //   .then((downloadedBook)=>{
//   //       if(downloadedBook) {
//   //           props.navigation.popToTop()
//   //           props.navigation.navigate(MainNav.Reader,downloadedBook)
//   //         }
//   //   })
//   // },[])

  

//     const requestMobileAds = () => {
//         mobileAds()
//             .setRequestConfiguration({
//                 // Update all future requests suitable for parental guidance
//                 maxAdContentRating: MaxAdContentRating.PG,

//                 // Indicates that you want your content treated as child-directed for purposes of COPPA.
//                 tagForChildDirectedTreatment: true,

//                 // Indicates that you want the ad request to be handled in a
//                 // manner suitable for users under the age of consent.
//                 tagForUnderAgeOfConsent: true,


//                 // An array of test device IDs to allow.
//                 testDeviceIdentifiers: ['EMULATOR'],
                
//             })
//             .then(() => {
//                 console.log(" Request config successfully set!")
//                 // Request config successfully set!
//             });
//     }

//     useEffect(()=>{
//         requestMobileAds()  
//         // TrackPlayer.pause()      
//         // initMobileAds()
//     },[])

//     useEffect(()=>{
//         if(loaded) {rewarded.show()}
//         // props.navigation.popToTop()
//         // props.navigation.navigate("Quizzes")
//     },[loaded])
  
//         return <FlexContainer fullFlex centerAlign style={{backgroundColor:"rgba(76, 175, 80, 0.2)"}}>
//             { !downloading && <LottieView
//                   source={require("../assets/Books-stack.json")}
//                   style={{width: "100%",height:"40%"}}
//                   autoPlay
//                   loop
//                 />
//             }
//             { downloading && <LottieView
//                   source={require("../assets/Downloading.json")}
//                   style={{width: "100%",height:"30%"}}
//                   autoPlay
//                   loop
//                 />
//             }
//            { !downloading && <EsSmallHeader color={ESColor.gray}>များများဖတ်လေ ဗဟုသုတတိုးလေ</EsSmallHeader>}
//            { downloading && <EsSmallHeader color={ESColor.gray}>Downloading Book .....</EsSmallHeader>}
//         </FlexContainer> ;
// }


import React, { useEffect, useState, useRef } from "react";
import { 
  ActivityIndicator, 
  View, 
  Animated, 
  Easing, 
  StyleSheet, 
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import mobileAds, { 
  AdEventType, 
  MaxAdContentRating, 
  RewardedAd, 
  RewardedAdEventType, 
  TestIds 
} from 'react-native-google-mobile-ads';
import LinearGradient from 'react-native-linear-gradient';

import { FlexContainer } from "../componet/atoms/container/FlexContainer";
import { MainNav, RootStackParamList } from "../nav/main.nav";
import { EsSmallHeader } from "../componet/atoms/EsText";
import { ESColor } from "../componet/atoms/res/EsColor";
import { setRecordAdWatch } from "../services/recordAdsWatch";
import { downloadFile } from "../utils/downloadFile";
import { Icon, IconKey } from "../componet/atoms/icons"; // Using your existing icon component

type IProps = NativeStackScreenProps<RootStackParamList, 'ADS'>;

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-1353250294440692/4940249375';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['game', 'fashion', 'clothing'],
});

export const ADS = (props: IProps) => {
  const [loaded, setLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const book = props.route.params;

  // Animation value for the pulse effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, () => {
      handleTransitionToDownload();
    });

    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward', reward);
    });

    rewarded.load();

    const unsubscribAdClose = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setRecordAdWatch().finally(() => {
        handleTransitionToDownload();
      });
    });

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribAdClose();
      unsubscribeError();
    };
  }, []);

  const handleTransitionToDownload = () => {
    setDownloading(true);
    downloadFile(book).then((downloadedBook) => {
      if (downloadedBook) {
        props.navigation.popToTop();
        props.navigation.navigate(MainNav.Reader, downloadedBook);
      }
    });
  };

  const requestMobileAds = () => {
    mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
        testDeviceIdentifiers: ['EMULATOR'],
      })
      .then(() => {
        console.log("Ads Config set");
      });
  };

  useEffect(() => {
    requestMobileAds();
  }, []);

  useEffect(() => {
    if (loaded) {
      rewarded.show();
    }
  }, [loaded]);

  return (
    <FlexContainer fullFlex centerAlign style={styles.container}>
      
      <View style={styles.contentWrapper}>
        <Animated.View style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={['#7B5EC9', '#22B4D3']}
            style={styles.gradientCircle}
          >
            <Icon 
              icon={downloading ? IconKey.download : IconKey.book} 
              size={40} 
              className={{ color: '#fff' }} 
            />
          </LinearGradient>
        </Animated.View>

        <View style={styles.textContainer}>
          <ActivityIndicator 
            size="small" 
            color="#7B5EC9" 
            style={{ marginBottom: 15 }} 
          />
          
          <EsSmallHeader color={ESColor.gray} style={styles.statusText}>
            {downloading ? "စာအုပ်ကို သိမ်းဆည်းနေပါသည်..." : "ကြော်ငြာကို ရှာဖွေနေပါသည်..."}
          </EsSmallHeader>
          
          <EsSmallHeader color="#A0A0A0" style={styles.subText}>
            {downloading ? "ခေတ္တစောင့်ဆိုင်းပေးပါ" : "အသိပညာသည် အကြီးမားဆုံး ရင်းနှီးမြှုပ်နှံမှုဖြစ်သည်"}
          </EsSmallHeader>
        </View>
      </View>
    </FlexContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F7FA',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#7B5EC9',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 40,
  },
  gradientCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  statusText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subText: {
    textAlign: 'center',
    fontSize: 14,
  }
});