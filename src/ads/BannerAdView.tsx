import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { AdView, AdFormat, AdInfo, AdLoadFailedInfo } from 'react-native-applovin-max';

interface BannerAdProps {
  style?: ViewStyle;
}

const BANNER_AD_UNIT_ID = Platform.select({
  ios: 'YOUR_IOS_BANNER_ID',
  android: 'YOUR_ANDROID_BANNER_ID',
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