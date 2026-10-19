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
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

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

type AdScreenStatus = 'loading' | 'failed' | 'offline' | 'downloading';

// isInternetReachable is null while unknown, so only treat an explicit false as offline
const isOffline = (net: NetInfoState) =>
  net.isConnected === false || net.isInternetReachable === false;

export const ADS = (props: IProps) => {
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<AdScreenStatus>('loading');
  const downloading = status === 'downloading';
  const book = props.route.params;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loadedRef = useRef(false);
  const adEarnedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<AdScreenStatus>('loading');

  const updateStatus = (next: AdScreenStatus) => {
    statusRef.current = next;
    setStatus(next);
  };

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
    clearAdTimeout();
    updateStatus('downloading');
    downloadFile(book).then((downloadedBook) => {
      if (downloadedBook) {
        props.navigation.popToTop();
        props.navigation.navigate(MainNav.Reader, downloadedBook);
      }
    });
  };

  const clearAdTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Request a rewarded ad; on mount, on "Watch Ad" / "Try Again", and when the connection returns
  const startAdRequest = async () => {
    clearAdTimeout();
    loadedRef.current = false;
    setLoaded(false);
    updateStatus('loading');

    // User may have turned off mobile data / Wi-Fi before opening the ad
    const net = await NetInfo.fetch();
    if (isOffline(net)) {
      updateStatus('offline');
      return;
    }

    rewarded.load();

    // 1-minute timeout: if ad hasn't loaded after 60s, show the failure guidance
    timeoutRef.current = setTimeout(() => {
      if (!loadedRef.current && statusRef.current === 'loading') {
        console.log('Ad load timeout (60s) — showing failure guidance');
        updateStatus('failed');
      }
    }, 60000);
  };

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      loadedRef.current = true;
      clearAdTimeout();
      setLoaded(true);
    });

    const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
      // No internet → ask to reconnect; otherwise usually Mytel blocking Google ad servers
      console.log('Rewarded ad failed', error);
      clearAdTimeout();
      NetInfo.fetch().then((net) => {
        if (statusRef.current !== 'downloading') {
          updateStatus(isOffline(net) ? 'offline' : 'failed');
        }
      });
    });

    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward', reward);
        adEarnedRef.current = true; // Mark that they successfully finished
    });

    const unsubscribAdClose = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      if (adEarnedRef.current) {
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

    // Connection dropped → show the offline panel; connection back → request the ad again
    const unsubscribeNetInfo = NetInfo.addEventListener((net) => {
      const current = statusRef.current;
      if (isOffline(net)) {
        if (current === 'loading' || current === 'failed') {
          clearAdTimeout();
          updateStatus('offline');
        }
      } else if (net.isConnected && current === 'offline') {
        startAdRequest();
      }
    });

    startAdRequest();

    return () => {
      clearAdTimeout();
      unsubscribeNetInfo();
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribAdClose();
      unsubscribeError();
    };
    // Register listeners and request the first ad once, on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {status === 'offline' ? (
          <View style={styles.textContainer}>
            <EsSmallHeader color={ESColor.gray} style={styles.statusText}>
              အင်တာနက် ချိတ်ဆက်မှု မရှိပါ
            </EsSmallHeader>

            <EsSmallHeader style={[styles.subText, styles.mutedText]}>
              Mobile Data (သို့) Wi-Fi ကို ဖွင့်ပြီး 'Try Again' ကို နှိပ်ပါ။
            </EsSmallHeader>

            <EsSmallHeader style={[styles.subText, styles.mutedText, styles.failureEnglish]}>
              No internet connection. Please turn on mobile data or Wi-Fi and tap 'Try Again'.
            </EsSmallHeader>

            <TouchableOpacity style={styles.buttonTouch} onPress={startAdRequest}>
              <LinearGradient
                colors={['#7B5EC9', '#22B4D3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <EsSmallHeader color={ESColor.textWhite} style={styles.buttonText}>Try Again</EsSmallHeader>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : status === 'failed' ? (
          <View style={styles.textContainer}>
            <EsSmallHeader color={ESColor.gray} style={styles.statusText}>
              ကြော်ငြာ ဖွင့်၍မရပါ
            </EsSmallHeader>

            <EsSmallHeader style={[styles.subText, styles.mutedText]}>
              Mytel သုံးနေပါက (သို့) အင်တာနက် ချိတ်ဆက်မှု အခက်အခဲရှိပါက VPN ဖွင့်ပြီး 'Watch Ad' ကို ထပ်နှိပ်ပါ။
            </EsSmallHeader>

            <EsSmallHeader style={[styles.subText, styles.mutedText, styles.failureEnglish]}>
              Ad failed to load. If you are using Mytel or experiencing connection issues, please turn on a VPN and tap 'Watch Ad' again.
            </EsSmallHeader>

            <TouchableOpacity style={styles.buttonTouch} onPress={startAdRequest}>
              <LinearGradient
                colors={['#7B5EC9', '#22B4D3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <EsSmallHeader color={ESColor.textWhite} style={styles.buttonText}>Watch Ad</EsSmallHeader>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonTouch, styles.secondaryButton]}
              onPress={handleTransitionToDownload}
            >
              <EsSmallHeader style={[styles.buttonText, styles.secondaryButtonText]}>Read Now</EsSmallHeader>
            </TouchableOpacity>
          </View>
        ) : (
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
        )}
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
  },
  mutedText: {
    color: '#A0A0A0',
  },
  failureEnglish: {
    marginTop: 8,
    fontSize: 12,
  },
  buttonTouch: {
    width: 220,
    marginTop: 16,
    borderRadius: 25,
  },
  primaryButton: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#7B5EC9',
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#7B5EC9',
  }
});