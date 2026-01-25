import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EmptyLibraryProps {
  onBrowsePress: () => void;
}

const EmptyLibraryScreen: React.FC<EmptyLibraryProps> = ({ onBrowsePress }) => {
  // Animation refs with explicit types
  const floatAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
  const fadeAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance Fade
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // 2. Floating Loop
    const startFloating = (): void => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -15,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startFloating();
  }, [fadeAnim, floatAnim]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" /> */}
      
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        
        {/* CSS-Art Icon using only Views */}
        <Animated.View 
          style={[
            styles.iconContainer, 
            { transform: [{ translateY: floatAnim }] }
          ]}
        >
          {/* Bottom Book */}
          <View style={[styles.book, styles.bookBottom]} />
          {/* Middle Book */}
          <View style={[styles.book, styles.bookMiddle]} />
          {/* Top Book with Spine Detail */}
          <View style={[styles.book, styles.bookTop]}>
             <View style={styles.bookSpine} />
          </View>
          {/* Decorative Shadow */}
          <View style={styles.shadow} />
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>No books downloaded</Text>
          <Text style={styles.subtitle}>
            Your offline library is empty. Download books while online to read them anywhere.
          </Text>
        </View>

        {/* <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8} 
          onPress={onBrowsePress}
        >
          <Text style={styles.buttonText}>Browse Catalog</Text>
        </TouchableOpacity> */}

      </Animated.View>
    </SafeAreaView>
  );
};

// Explicit typing for the Stylesheet
interface Styles {
  container: ViewStyle;
  contentContainer: ViewStyle;
  iconContainer: ViewStyle;
  book: ViewStyle;
  bookBottom: ViewStyle;
  bookMiddle: ViewStyle;
  bookTop: ViewStyle;
  bookSpine: ViewStyle;
  shadow: ViewStyle;
  textContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  iconContainer: {
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  book: {
    height: 14,
    width: 90,
    borderRadius: 4,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bookBottom: {
    backgroundColor: '#CBD5E1',
    bottom: 10,
    transform: [{ rotate: '-3deg' }],
    zIndex: 1,
  },
  bookMiddle: {
    backgroundColor: '#94A3B8',
    bottom: 24,
    width: 85,
    transform: [{ rotate: '2deg' }],
    zIndex: 2,
  },
  bookTop: {
    backgroundColor: '#6366F1',
    bottom: 38,
    width: 80,
    height: 16,
    transform: [{ rotate: '-4deg' }],
    zIndex: 3,
    overflow: 'hidden',
  },
  bookSpine: {
    height: '100%',
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    position: 'absolute',
    left: 8,
  },
  shadow: {
    width: 70,
    height: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
    position: 'absolute',
    bottom: -15,
  },
  textContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1E293B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyLibraryScreen;