import AppLovinMAX, { Configuration, InterstitialAd, RewardedAd } from 'react-native-applovin-max';
import { Platform } from 'react-native';

const SDK_KEY = "YOUR_SDK_KEY_HERE";
const INTERSTITIAL_ID = Platform.select({
  ios: 'YOUR_IOS_INTER_ID',
  android: 'YOUR_ANDROID_INTER_ID',
}) || '';

export const AppLovinController = {
  /**
   * Initialize the SDK. Call this in your App entry point (e.g., App.tsx)
   */
  init: async (): Promise<boolean> => {
    try {
      const configuration: Configuration = await AppLovinMAX.initialize(SDK_KEY);
      console.log('AppLovin MAX Initialized', configuration.countryCode);
      
      // Preload Interstitial
      InterstitialAd.loadAd(INTERSTITIAL_ID);
      
      return true;
    } catch (error) {
      console.error('AppLovin Initialization Failed', error);
      return false;
    }
  },

  /**
   * Show Interstitial Ad with a simple callback
   */
  showInterstitial: async (onAdHidden?: () => void) => {
    const isReady = await InterstitialAd.isAdReady(INTERSTITIAL_ID);
    
    if (isReady) {
      // Add a listener once to handle the close event
      const listener = InterstitialAd.addAdHiddenEventListener(() => {
        onAdHidden?.();
        // Remove listener after trigger to avoid memory leaks
        listener.remove();
        // Load the next ad for future use
        InterstitialAd.loadAd(INTERSTITIAL_ID);
      });

      InterstitialAd.showAd(INTERSTITIAL_ID);
    } else {
      console.warn('Interstitial not ready yet');
      InterstitialAd.loadAd(INTERSTITIAL_ID);
      onAdHidden?.();
    }
  },
};