import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  Modal, 
  Dimensions, 
  Image 
} from 'react-native';
import { ref, onValue, firebase } from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { 
  ZoomIn, 
  FadeOutDown, 
  FadeIn 
} from 'react-native-reanimated';import { GradientColor } from '../../../res/color';
;

const { width } = Dimensions.get('window');

interface AdConfig {
  active: boolean;
  image: string;
  title: string;
  message: string;
  actionUrl: string; 
  isExternal: boolean;
  id: string; 
}

const database = firebase
  .app()
  .database('https://shweywethla-49cb4-default-rtdb.asia-southeast1.firebasedatabase.app/');

const AdAlert = ({ navigation }: any) => {
  const [visible, setVisible] = useState(false);
  const [adData, setAdData] = useState<AdConfig | null>(null);

  useEffect(() => {
    const adRef = ref(database, 'app_ads');
    
    const unsubscribe = onValue(adRef, (snapshot) => {
      const data = snapshot.val();
      // Only show if active and we have data
      if (data && data.active) {
        setAdData(data);
        setVisible(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAction = () => {
    setVisible(false);
    if (!adData) return;

    if (adData.isExternal) {
      Linking.openURL(adData.actionUrl).catch(err => console.error("URL Error", err));
    } else {
      // Internal navigation (Make sure actionUrl matches your Stack screen name)
      navigation.navigate(adData.actionUrl); 
    }
  };

  if (!adData) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View entering={FadeIn} style={styles.overlay}>
        
        <Animated.View 
          entering={ZoomIn.duration(500).springify().damping(15)} 
          exiting={FadeOutDown} 
          style={styles.card}
        >
          {/* Close Button - Top Right Overlay */}
          <TouchableOpacity 
            activeOpacity={0.7}
            style={styles.closeCircle} 
            onPress={() => setVisible(false)}
          >
             <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Ad Image Container */}
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: adData.image }} 
              style={styles.adImage} 
              resizeMode="cover"
            />
          </View>

          {/* Text Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{adData.title}</Text>
            <Text style={styles.message}>{adData.message}</Text>

            {/* Gradient Call to Action */}
            <TouchableOpacity 
                activeOpacity={0.85} 
                onPress={handleAction}
                style={styles.buttonShadow}
            >
              <LinearGradient 
                colors={[GradientColor[1], GradientColor[3]]} 
                start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                style={styles.actionButton}
              >
                <Text style={styles.actionButtonText}>LEARN MORE</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 20, 0.85)', // Premium dark blue backdrop
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    overflow: 'visible', // Changed to visible so we can handle close button position
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
  },
  closeCircle: {
    position: 'absolute',
    top: -12,
    right: -12,
    zIndex: 99,
    backgroundColor: '#FFF',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for the close button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  closeText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0A1D37',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    color: '#556070',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  buttonShadow: {
    width: '100%',
    borderRadius: 18,
    // Blue glow effect
    shadowColor: GradientColor[1],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1.5,
  }
});

export default AdAlert;