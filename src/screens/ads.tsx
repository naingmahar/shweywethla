import React, { useEffect, useState, useRef } from "react";
import { 
  ActivityIndicator, 
  View, 
  Animated, 
  Easing, 
  StyleSheet, 
  Alert,
  TouchableOpacity
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
import { Icon, IconKey } from "../componet/atoms/icons";

type IProps = NativeStackScreenProps<RootStackParamList, 'ADS'>;

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-1353250294440692/4940249375';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  // keywords: [
  //   // Core Reading Experience
  //   'ebooks', 'kindle', 'audiobooks', 'literature', 'digital library',
  //   'reading app', 'epubs', 'pdf reader', 'bestsellers',
    
  //   // Education & Knowledge
  //   'online courses', 'learning', 'skillshare', 'coursera', 'non-fiction',
    
  //   // High-Value Ad Verticals (Better eCPM)
  //   'productivity', 'personal finance', 'business books', 'stock market',
  //   'meditation', 'mental health', 'masterclass',
  // ],
  // // Set to false for better targeting (requires user consent in EU/CA)
  // requestNonPersonalizedAdsOnly: false,
  // keywords: [
  //   // High-Demand (Keeps fill rate high like your 'clothing' ads)
  //   'shopping', 'fashion', 'lifestyle', 'ecommerce', 'gifts',
    
  //   // High-Value (Higher pay per click)
  //   'finance', 'investing', 'credit cards', 'insurance', 'university',
    
  //   // Industry Specific (Relevant to readers)
  //   'audiobooks', 'self help', 'magazines', 'productivity tools', 'software',
    
  //   // Broad Entertainment (Similar to 'game' demand)
  //   'streaming', 'movies', 'subscriptions', 'mobile games'
  // ],
  keywords: [
    // --- HIGH FILL RATE IN MYANMAR ---
    'mobile phone',       // Highest demand in Myanmar
    'smartphone',         // Telco & device ads very common
    'online shopping',    // Shopee, Lazada heavily advertise in Myanmar
    'food delivery',      // KBZ Pay, WaveMoney food ads
    'mobile banking',     // KBZ, AYA, CB Bank ads
    'money transfer',     // Wave Money, KBZ Pay

    // --- EDUCATION (Matches your app) ---
    'online learning',    // Growing sector in Myanmar
    'english learning',   // Very popular in Myanmar
    'e-learning',

    // --- LIFESTYLE (High volume in Myanmar) ---
    'beauty',             // Cosmetics ads very common
    'fashion',            // Clothing brands advertise heavily
    'health',             // Health products popular
    'game',               // Mobile gaming huge in Myanmar
  ],
  requestNonPersonalizedAdsOnly: false,
});

export const ADS = (props: IProps) => {
  const [loaded, setLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [adEarned, setAdEarned] = useState(false);
  const book = props.route.params;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loadedRef = useRef(false);

  // Animation logic
  useEffect(() => {
    const animation = Animated.loop(
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
    );
    animation.start();
    return () => animation.stop();
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

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      loadedRef.current = true;
      setLoaded(true);
    });

    const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, () => {
      // If ad fails to load, we allow download so user isn't punished for tech errors
      handleTransitionToDownload();
    });

    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward', reward);
        setAdEarned(true); // Mark that they successfully finished
    });

    const unsubscribAdClose = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      if (adEarned) {
        // Only download if they finished the ad
        setRecordAdWatch().finally(() => {
          handleTransitionToDownload();
        });
      } else {
        // User closed early
        // Alert.alert(
        //     "သတိပေးချက်",
        //     "စာအုပ်ဖတ်ရှုရန် ကြော်ငြာကို ဆုံးအောင်ကြည့်ပေးရပါမည်။",
        //     [{ text: "Ok", onPress: () => props.navigation.goBack() }]
        // );
      }
    });

    rewarded.load();

    // 1-minute timeout: if ad hasn't loaded after 60s, skip to book page
    const timeoutId = setTimeout(() => {
      if (!loadedRef.current) {
        console.log('Ad load timeout (60s) — skipping to book page');
        handleTransitionToDownload();
      }
    }, 60000);

    return () => {
      clearTimeout(timeoutId);
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribAdClose();
      unsubscribeError();
    };
  }, [adEarned]); // Listen to adEarned state change

  // Show ad once loaded
  useEffect(() => {
    if (loaded) {
      rewarded.show();
    }
  }, [loaded]);

  return (
    <FlexContainer fullFlex centerAlign style={styles.container}>
      {/* Back button in case they get stuck */}
      {!downloading && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => props.navigation.goBack()}
        >
          <Icon icon={IconKey.back} size={24} className={{ color: ESColor.gray }} />
        </TouchableOpacity>
      )}

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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    zIndex: 10,
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