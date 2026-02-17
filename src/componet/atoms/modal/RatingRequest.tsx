import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, IconKey, IconsSize } from '../icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage Keys
const RATING_KEYS = {
  SESSIONS_COUNT: '@app_sessions_count',
  BOOKS_READ_COUNT: '@books_read_count',
  RATING_REQUESTED_COUNT: '@rating_requested_count',
  LAST_RATING_REQUEST: '@last_rating_request_date',
  NEVER_SHOW_RATING: '@never_show_rating',
};

// Configuration - Adjust these to control when to show rating
const RATING_CONFIG = {
  MIN_SESSIONS: 5,           // Show after 5 app sessions
  MIN_BOOKS_READ: 3,          // Or after reading 3 books
  MAX_REQUESTS: 3,            // Maximum 3 times in app lifetime
  DAYS_BETWEEN_REQUESTS: 90,  // Wait 90 days between requests
  DAYS_AFTER_INSTALL: 7,      // Wait 7 days after first install
};

interface RatingRequestProps {
  onClose?: () => void;
}

export const RatingRequest: React.FC<RatingRequestProps> = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkAndShowRatingRequest();
  }, []);

  const checkAndShowRatingRequest = async () => {
    try {
      // Check if user opted to never show rating
      const neverShow = await AsyncStorage.getItem(RATING_KEYS.NEVER_SHOW_RATING);
      if (neverShow === 'true') {
        console.log('⭐ User opted out of rating requests');
        return;
      }

      // Check how many times we've requested
      const requestCountStr = await AsyncStorage.getItem(RATING_KEYS.RATING_REQUESTED_COUNT);
      const requestCount = parseInt(requestCountStr || '0');

      if (requestCount >= RATING_CONFIG.MAX_REQUESTS) {
        console.log('⭐ Maximum rating requests reached');
        return;
      }

      // Check last request date
      const lastRequestStr = await AsyncStorage.getItem(RATING_KEYS.LAST_RATING_REQUEST);
      if (lastRequestStr) {
        const lastRequestDate = new Date(lastRequestStr);
        const daysSinceLastRequest = Math.floor(
          (Date.now() - lastRequestDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastRequest < RATING_CONFIG.DAYS_BETWEEN_REQUESTS) {
          console.log(`⭐ Too soon since last request (${daysSinceLastRequest} days)`);
          return;
        }
      }

      // Get session count and books read
      const sessionsStr = await AsyncStorage.getItem(RATING_KEYS.SESSIONS_COUNT);
      const booksReadStr = await AsyncStorage.getItem(RATING_KEYS.BOOKS_READ_COUNT);

      const sessions = parseInt(sessionsStr || '0');
      const booksRead = parseInt(booksReadStr || '0');

      console.log(`⭐ Stats - Sessions: ${sessions}, Books: ${booksRead}`);

      // Check if user meets criteria
      const meetsSessionsCriteria = sessions >= RATING_CONFIG.MIN_SESSIONS;
      const meetsBooksCriteria = booksRead >= RATING_CONFIG.MIN_BOOKS_READ;

      if (meetsSessionsCriteria || meetsBooksCriteria) {
        console.log('⭐ User meets criteria, showing rating request');
        setVisible(true);

        // Update request tracking
        await AsyncStorage.setItem(
          RATING_KEYS.RATING_REQUESTED_COUNT,
          (requestCount + 1).toString()
        );
        await AsyncStorage.setItem(
          RATING_KEYS.LAST_RATING_REQUEST,
          new Date().toISOString()
        );
      }
    } catch (error) {
      console.error('Error checking rating criteria:', error);
    }
  };

  const handleRateNow = async () => {
    try {
      // Open Play Store or App Store
      const packageName = 'com.shweywethla'; // TODO: Update with your exact Play Store package name

      const url = Platform.OS === 'ios'
        ? `https://apps.apple.com/app/id${packageName}`
        : `https://play.google.com/store/apps/details?id=${packageName}`;

      await Linking.openURL(url);

      // Mark as never show again (user rated)
      await AsyncStorage.setItem(RATING_KEYS.NEVER_SHOW_RATING, 'true');

      setVisible(false);
      onClose?.();
    } catch (error) {
      console.error('Error opening store:', error);
    }
  };

  const handleRemindLater = () => {
    // Just close - will show again after configured days
    setVisible(false);
    onClose?.();
  };

  const handleNeverShow = async () => {
    // Mark as never show again
    await AsyncStorage.setItem(RATING_KEYS.NEVER_SHOW_RATING, 'true');
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
              colors={['#FFD700', '#FFA500']}
              style={styles.iconGradient}
            >
              <Text style={styles.starEmoji}>⭐</Text>
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>သင့်အတွက် အဖိုးတန်ပါသလား?</Text>

          {/* Message */}
          <Text style={styles.message}>
            ကျွန်ုပ်တို့၏ app ကို သင် နှစ်သက်ပါက{'\n'}
            Play Store တွင် ⭐⭐⭐⭐⭐ ပေးပြီး{'\n'}
            အခြားသူများကို ကူညီပေးပါ။
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Rate Now Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleRateNow}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.buttonGradient}
              >
                <Icon icon={IconKey.love} size={IconsSize.sm} className={{ color: '#fff' }} />
                <Text style={styles.primaryButtonText}>⭐ အခုပဲ Rating ပေးမည်</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Remind Later Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleRemindLater}
            >
              <Icon icon={IconKey.clock} size={IconsSize.sm} className={{ color: '#666' }} />
              <Text style={styles.secondaryButtonText}>နောက်မှပေးမည်</Text>
            </TouchableOpacity>

            {/* Never Show Button */}
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleNeverShow}
            >
              <Text style={styles.dismissButtonText}>မပြတော့ပါ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Utility functions to track user activity (call these from your app)

export const trackAppSession = async () => {
  try {
    const sessionsStr = await AsyncStorage.getItem(RATING_KEYS.SESSIONS_COUNT);
    const sessions = parseInt(sessionsStr || '0');
    await AsyncStorage.setItem(RATING_KEYS.SESSIONS_COUNT, (sessions + 1).toString());
    console.log(`📊 App session tracked: ${sessions + 1}`);
  } catch (error) {
    console.error('Error tracking session:', error);
  }
};

export const trackBookRead = async () => {
  try {
    const booksStr = await AsyncStorage.getItem(RATING_KEYS.BOOKS_READ_COUNT);
    const books = parseInt(booksStr || '0');
    await AsyncStorage.setItem(RATING_KEYS.BOOKS_READ_COUNT, (books + 1).toString());
    console.log(`📚 Book read tracked: ${books + 1}`);
  } catch (error) {
    console.error('Error tracking book:', error);
  }
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
  starEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
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
