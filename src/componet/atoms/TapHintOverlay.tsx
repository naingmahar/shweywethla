import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  withDelay,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { Icon, IconKey, IconsSize } from '../../componet/atoms/icons';
import { GradientColor } from '../../res/color';

export const TapHintOverlay = ({ onFinished }: { onFinished: () => void }) => {
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.5);
  const handTranslateY = useSharedValue(20);

  useEffect(() => {
    // 1. Hand slides up
    handTranslateY.value = withTiming(0, { duration: 500 });

    // 2. Pulse animation (The Shadow/Ripple)
    ringScale.value = withRepeat(
      withSequence(
        withDelay(500, withTiming(1.5, { duration: 400 })), // First Tap Shadow
        withTiming(1, { duration: 0 }),
        withDelay(100, withTiming(1.5, { duration: 400 })), // Second Tap Shadow
        withTiming(1, { duration: 0 }),
        withDelay(1000, withTiming(1, { duration: 0 }))
      ),
      -1,
      false
    );

    ringOpacity.value = withRepeat(
      withSequence(
        withDelay(500, withTiming(0, { duration: 400 })),
        withTiming(0.5, { duration: 0 }),
        withDelay(100, withTiming(0, { duration: 400 })),
        withTiming(0.5, { duration: 0 }),
        withDelay(1000, withTiming(0.5, { duration: 0 }))
      ),
      -1,
      false
    );

    // Auto-remove after 4 seconds
    const timer = setTimeout(onFinished, 5000);
    return () => clearTimeout(timer);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const handStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: handTranslateY.value }],
  }));

  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut} 
      style={styles.fullScreenOverlay}
      pointerEvents="none" // Important: allows user to tap through it
    >
      <View style={styles.container}>
        {/* The Ripple Shadow */}
        <Animated.View style={[styles.ripple, ringStyle]} />
        
        {/* The Hand Icon */}
        <Animated.View style={handStyle}>
          <Icon icon={IconKey.touch} size={80} className={{ color: 'white' }} />
        </Animated.View>

        <View style={styles.textBadge}>
          <Text style={styles.hintText}>နှစ်ချက်နှိပ်ပါ (Double Tap)</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)', // Very light dim
    zIndex: 9999,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 2,
    borderColor: 'white',
  },
  textBadge: {
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hintText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});