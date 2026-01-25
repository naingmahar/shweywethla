import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// 1. Define Types for your colors
interface GradientColors {
  start: string;
  mid: string;
  end: string;
}

const GRADIENT_COLORS: GradientColors = {
  start: '#22B4D3',
  mid: '#4B71C8',
  end: '#7B5EC9',
};

// Simplified SVG path for the book
const BOOK_PATH: string = 
  "M40,20 C40,20 20,25 10,25 C10,25 10,85 10,85 C20,85 40,80 40,80 C40,80 80,85 90,85 C90,85 90,25 90,25 C80,25 40,20 40,20 Z M40,80 L40,20";

const FloatingBookAnimation: React.FC = () => {
  // 2. Explicitly type the SharedValue as a number
  const translateY = useSharedValue<number>(0);

  useEffect(() => {
    // Start the floating loop
    translateY.value = withRepeat(
      withTiming(-15, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite
      true // Reverse (Yoyo)
    );
  }, [translateY]);

  // 3. Define the animated style with TypeScript
  const animatedStyle = useAnimatedStyle((): ViewStyle => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.svgContainer, animatedStyle]}>
        <Svg height="120" width="120" viewBox="0 0 100 100">
          <Defs>
            {/* 3-Color Gradient Definition */}
            <LinearGradient id="bookGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={GRADIENT_COLORS.start} />
              <Stop offset="0.5" stopColor={GRADIENT_COLORS.mid} />
              <Stop offset="1" stopColor={GRADIENT_COLORS.end} />
            </LinearGradient>
          </Defs>
          
          <Path
            d={BOOK_PATH}
            fill="url(#bookGrad)"
            stroke={GRADIENT_COLORS.end}
            strokeWidth="0.5"
          />
          
          {/* Subtle spine detail */}
          <Path 
            d="M40,20 L40,80" 
            stroke="white" 
            strokeWidth="1.5" 
            opacity={0.4} 
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  svgContainer: {
    padding: 20,
  } as ViewStyle,
});

export default FloatingBookAnimation;