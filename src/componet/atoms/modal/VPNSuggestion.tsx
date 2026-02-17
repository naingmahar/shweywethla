import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, IconKey, IconsSize } from '../icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const VPN_SUGGESTION_KEY = '@vpn_suggestion_shown';
const MYANMAR_CARRIERS = ['MPT', 'ATOM', 'MyTel', 'Ooredoo'];

// Set to true to test VPN modal in development (bypasses carrier check)
const DEV_MODE = __DEV__; // Change to false for production

interface VPNSuggestionProps {
  onClose?: () => void;
}

export const VPNSuggestion: React.FC<VPNSuggestionProps> = ({ onClose }) => {
  const [visible, setVisible] = useState(false);
  const [carrier, setCarrier] = useState<string>('');

  useEffect(() => {
    checkCarrierAndShowSuggestion();
  }, []);

  const checkCarrierAndShowSuggestion = async () => {
    try {
      // DEV MODE: Always show VPN modal for testing
      if (DEV_MODE) {
        console.log('🧪 DEV MODE: Force showing VPN modal for testing');

        // Get actual carrier for display
        const deviceCarrier = await DeviceInfo.getCarrier();
        setCarrier(deviceCarrier + ' (Dev Mode)');

        console.log('📱 Your carrier:', deviceCarrier);

        // Always show modal in dev mode
        setVisible(true);
        return;
      }

      // Check if suggestion was already shown
      const alreadyShown = await AsyncStorage.getItem(VPN_SUGGESTION_KEY);
      if (alreadyShown === 'true') {
        return;
      }

      // Get carrier information
      const deviceCarrier = await DeviceInfo.getCarrier();
      setCarrier(deviceCarrier);

      console.log('📱 Detected carrier:', deviceCarrier);

      // Check if carrier is in Myanmar carriers list
      const isMyanmarCarrier = MYANMAR_CARRIERS.some(
        (myanmarCarrier) =>
          deviceCarrier.toLowerCase().includes(myanmarCarrier.toLowerCase())
      );

      if (isMyanmarCarrier) {
        console.log('🔒 Myanmar carrier detected, showing VPN suggestion');
        setVisible(true);
      }
    } catch (error) {
      console.error('Error checking carrier:', error);
    }
  };

  const handleDismiss = async () => {
    // Mark as shown so it doesn't appear again
    await AsyncStorage.setItem(VPN_SUGGESTION_KEY, 'true');
    setVisible(false);
    onClose?.();
  };

  const handleOpenVPNStore = async () => {
    try {
      // Open Play Store/App Store to VPN apps
      const url = Platform.OS === 'ios'
        ? 'https://apps.apple.com/search?term=vpn'
        : 'https://play.google.com/store/search?q=vpn&c=apps';

      await Linking.openURL(url);
      handleDismiss();
    } catch (error) {
      console.error('Error opening VPN store:', error);
    }
  };

  const handleRemindLater = () => {
    // Just close without marking as shown, so it appears again next time
    setVisible(false);
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleRemindLater}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              style={styles.iconGradient}
            >
              <Icon icon={IconKey.privacyPolicy} size={IconsSize.picture} className={{ color: '#fff' }} />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>VPN အသုံးပြုရန် အကြံပြုပါသည်</Text>

          {/* Carrier Info */}
          {carrier && (
            <View style={styles.carrierBadge}>
              <Text style={styles.carrierText}>📱 {carrier}</Text>
            </View>
          )}

          {/* Message */}
          <Text style={styles.message}>
            သင့် Myanmar အင်တာနက်ဝန်ဆောင်မှုသည် ဤ app နှင့်{'\n'}
            Google Ads များကို ပံ့ပိုးမထားပါ။{'\n'}
            VPN ဖြင့် နိုင်ငံပြောင်းခြင်းဖြင့် အသုံးပြုနိုင်ပါသည်။
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>

            {/* Dismiss Button */}
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismiss}
            >
              <Text style={styles.dismissButtonText}>မပြတော့ပါ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  carrierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  carrierText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  dismissButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#999',
    fontSize: 14,
  },
});
