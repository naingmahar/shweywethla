import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { AdView, AdFormat, AdInfo, AdLoadFailedInfo } from 'react-native-applovin-max';

interface BannerAdProps {
  style?: ViewStyle;
}

// TODO: Replace with your real AppLovin MAX Banner Ad Unit IDs from dashboard
const BANNER_AD_UNIT_ID = __DEV__
  ? Platform.select({
      ios: 'YOUR_IOS_TEST_BANNER_ID',  // AppLovin MAX test banner ID for iOS
      android: 'YOUR_ANDROID_TEST_BANNER_ID',  // AppLovin MAX test banner ID for Android
    }) || ''
  : Platform.select({
      ios: 'YOUR_IOS_PRODUCTION_BANNER_ID',  // Your real iOS banner ID from AppLovin
      android: 'YOUR_ANDROID_PRODUCTION_BANNER_ID',  // Your real Android banner ID from AppLovin
    }) || '';

const BannerAdView: React.FC<BannerAdProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <AdView
        adUnitId={BANNER_AD_UNIT_ID}
        adFormat={AdFormat.BANNER} // Change to AdFormat.MREC for 300x250
        style={styles.adView}
        onAdLoaded={(adInfo: AdInfo) => {
          console.log('Ad loaded from:', adInfo.networkName);
        }}
        onAdLoadFailed={(errorInfo: AdLoadFailedInfo) => {
          console.error('Ad load failed:', errorInfo.message);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#000', // Recommended to prevent layout flashing
  },
  adView: {
    width: '100%',
    // Banners are typically 50dp high, MRECs 250dp
    height: AdFormat.BANNER.adaptiveHeight ? 50 : 50, 
  },
});

export default BannerAdView;