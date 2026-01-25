import React, { useState, useEffect, FC } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  Modal, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { ref, onValue, DatabaseReference, firebase } from '@react-native-firebase/database';
import { getVersion } from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence, 
  FadeInUp,
  FadeInDown
} from 'react-native-reanimated';
import { Icon, IconKey } from '../../componet/atoms/icons'; // Ensure this path is correct
import { GradientColor } from '../../res/color';

// 1. Interfaces
interface AppVersionConfig {
  currentVersion: string;
  forceUpdateVersion: string;
  noticMessage: string;
  noticMessageTitle: string;
  requestNoticMessage: boolean;
  requestUpdate: boolean;
  requiredVersion: string;
  updateMessage: string;
}

interface NoticeContent {
  title: string;
  message: string;
}

// 2. Constants
const { width } = Dimensions.get('window');
const database = firebase
  .app()
  .database('https://shweywethla-49cb4-default-rtdb.asia-southeast1.firebasedatabase.app/');

const CURRENT_APP_VERSION = getVersion();
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.shweywethla';

const AppUpdateChecker: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [updateRequired, setUpdateRequired] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const [noticeVisible, setNoticeVisible] = useState<boolean>(false);
  const [noticeContent, setNoticeContent] = useState<NoticeContent>({ title: '', message: '' });

  // Animation shared value
  const rocketY = useSharedValue(0);

  useEffect(() => {
    // Start floating animation
    rocketY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );

    const platform = 'android';
    const appRef: DatabaseReference = ref(database, `${platform}`);
    
    const unsubscribe = onValue(appRef, (snapshot) => {
      setLoading(false);
      const data: AppVersionConfig | null = snapshot.val();
      
      if (data) {
        const compareVersions = (current: string, required: string): boolean => {
          const currentParts = current.split('.').map(Number);
          const requiredParts = required.split('.').map(Number);
          for (let i = 0; i < requiredParts.length; i++) {
            if (currentParts[i] < requiredParts[i]) return true;
            if (currentParts[i] > requiredParts[i]) return false;
          }
          return false;
        };

        if (compareVersions(CURRENT_APP_VERSION, data.requiredVersion)) {
          setUpdateRequired(true);
          setForceUpdate(data.requestUpdate && data.forceUpdateVersion === data.requiredVersion);
        }

        if (data.requestNoticMessage) {
          setNoticeContent({
            title: data.noticMessageTitle,
            message: data.noticMessage,
          });
          setNoticeVisible(true);
        }
      }
    }, (error) => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const rocketStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rocketY.value }],
  }));

  const openAppStore = (): void => {
    Linking.openURL(PLAY_STORE_URL).catch(err => console.error("Store Error", err));
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      {/* UPDATE MODAL */}
      <Modal transparent visible={updateRequired} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInUp.duration(600)} style={styles.modalCard}>
            
            {/* Floating Icon Header */}
            <View style={styles.iconContainer}>
              <LinearGradient 
                colors={[GradientColor[1], GradientColor[3]]} 
                style={styles.iconCircle}
              >
                <Animated.View style={rocketStyle}>
                  <Icon icon={IconKey.rocket} size={50} className={{ color: 'white' }} />
                </Animated.View>
              </LinearGradient>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Update Available!</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>v{CURRENT_APP_VERSION} → Latest</Text>
              </View>
              
              <Text style={styles.message}>
                ကျွန်ုပ်တို့၏ App ကို ပိုမိုမြန်ဆန်ကောင်းမွန်စေရန်အတွက် ဗားရှင်းအသစ်သို့ အဆင့်မြှင့်တင်ပေးပါ။
              </Text>

              <TouchableOpacity activeOpacity={0.8} onPress={openAppStore} style={styles.buttonWrapper}>
                <LinearGradient 
                  colors={[GradientColor[1], GradientColor[3]]} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>UPDATE NOW</Text>
                </LinearGradient>
              </TouchableOpacity>

              {!forceUpdate && (
                <TouchableOpacity 
                  onPress={() => setUpdateRequired(false)} 
                  style={styles.laterButton}
                >
                  <Text style={styles.laterText}>Maybe Later</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* SERVER NOTICE MODAL */}
      <Modal transparent visible={noticeVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown} style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{noticeContent.title}</Text>
            <Text style={styles.noticeMessage}>{noticeContent.message}</Text>
            <TouchableOpacity 
              onPress={() => setNoticeVisible(false)}
              style={styles.noticeDismiss}
            >
              <Text style={styles.dismissText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 15, 30, 0.9)', // Dark Premium Blur
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  iconContainer: {
    position: 'absolute',
    top: -50,
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0A1D37',
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#E8F1FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 12,
  },
  badgeText: {
    color: GradientColor[1],
    fontSize: 12,
    fontWeight: '800',
  },
  message: {
    fontSize: 15,
    color: '#556070',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  buttonWrapper: {
    width: '100%',
  },
  gradientButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GradientColor[1],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.5,
  },
  laterButton: {
    marginTop: 20,
    padding: 10,
  },
  laterText: {
    color: '#A0AAB8',
    fontWeight: '700',
    fontSize: 14,
  },
  // Notice styles
  noticeCard: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noticeMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  noticeDismiss: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
  },
  dismissText: {
    color: GradientColor[1],
    fontWeight: 'bold',
  }
});

export default AppUpdateChecker;