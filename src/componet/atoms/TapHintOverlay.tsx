import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
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

const { width, height } = Dimensions.get('window');

export const TapHintOverlay = ({ onFinished }: { onFinished: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = double tap, 1 = left/right navigation

  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.5);
  const handTranslateY = useSharedValue(20);

  // Left/Right animation values
  const leftHandOpacity = useSharedValue(0);
  const rightHandOpacity = useSharedValue(0);
  const leftHandTranslateX = useSharedValue(-20);
  const rightHandTranslateX = useSharedValue(20);

  useEffect(() => {
    if (currentStep === 0) {
      // Step 1: Double Tap Tutorial
      handTranslateY.value = withTiming(0, { duration: 500 });

      ringScale.value = withRepeat(
        withSequence(
          withDelay(500, withTiming(1.5, { duration: 400 })),
          withTiming(1, { duration: 0 }),
          withDelay(100, withTiming(1.5, { duration: 400 })),
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

      // Move to next step after 4 seconds
      const timer = setTimeout(() => setCurrentStep(1), 4000);
      return () => clearTimeout(timer);
    } else if (currentStep === 1) {
      // Step 2: Left/Right Navigation Tutorial
      leftHandOpacity.value = withTiming(1, { duration: 300 });
      rightHandOpacity.value = withTiming(1, { duration: 300 });
      leftHandTranslateX.value = withTiming(0, { duration: 500 });
      rightHandTranslateX.value = withTiming(0, { duration: 500 });

      // Animate tapping effect on left and right
      leftHandOpacity.value = withRepeat(
        withSequence(
          withDelay(1000, withTiming(0.3, { duration: 200 })),
          withTiming(1, { duration: 200 }),
          withDelay(1000, withTiming(1, { duration: 0 }))
        ),
        -1,
        false
      );

      rightHandOpacity.value = withRepeat(
        withSequence(
          withDelay(1200, withTiming(0.3, { duration: 200 })),
          withTiming(1, { duration: 200 }),
          withDelay(1000, withTiming(1, { duration: 0 }))
        ),
        -1,
        false
      );

      // Auto-remove after 4 seconds
      const timer = setTimeout(onFinished, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const handStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: handTranslateY.value }],
  }));

  const leftHandStyle = useAnimatedStyle(() => ({
    opacity: leftHandOpacity.value,
    transform: [{ translateX: leftHandTranslateX.value }],
  }));

  const rightHandStyle = useAnimatedStyle(() => ({
    opacity: rightHandOpacity.value,
    transform: [{ translateX: rightHandTranslateX.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.fullScreenOverlay}
      pointerEvents="none"
    >
      {currentStep === 0 ? (
        // Step 1: Double Tap Guide
        <View style={styles.container}>
          <Animated.View style={[styles.ripple, ringStyle]} />
          <Animated.View style={handStyle}>
            <Icon icon={IconKey.touch} size={80} className={{ color: 'white' }} />
          </Animated.View>
          <View style={styles.textBadge}>
            <Text style={styles.hintText}>နှစ်ချက်နှိပ်ပါ (Double Tap)</Text>
            <Text style={styles.subHintText}>Hide/Show controls</Text>
          </View>
        </View>
      ) : (
        // Step 2: Left/Right Navigation Guide
        <View style={styles.fullContainer}>
          {/* Left Side */}
          <View style={styles.leftZone}>
            <Animated.View style={leftHandStyle}>
              <Icon icon={IconKey.touch} size={60} className={{ color: 'white' }} />
            </Animated.View>
            <View style={styles.textBadge}>
              <Text style={styles.hintText}>← Previous</Text>
              <Text style={styles.subHintText}>ယခင်စာမျက်နှာ</Text>
            </View>
          </View>

          {/* Right Side */}
          <View style={styles.rightZone}>
            <Animated.View style={rightHandStyle}>
              <Icon icon={IconKey.touch} size={60} className={{ color: 'white' }} />
            </Animated.View>
            <View style={styles.textBadge}>
              <Text style={styles.hintText}>Next →</Text>
              <Text style={styles.subHintText}>နောက်စာမျက်နှာ</Text>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', // Dimmed background
    zIndex: 9999,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullContainer: {
    flex: 1,
    flexDirection: 'row',
    width: width,
    height: height,
  },
  leftZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 2,
    borderRightColor: 'rgba(255,255,255,0.3)',
  },
  rightZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255,255,255,0.3)',
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  hintText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHintText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 3,
  },
});