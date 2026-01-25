import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

// --- Constants for Colors & Strings ---
const COLORS = {
  SECONDARY: '#A5B4FC', // Light purple for accents
  GRAY_TEXT: '#6B7280', // Gray for description
  DARK_TEXT: '#111827', // Dark for title
  BG_LIGHT: '#F3F4F6',  // Light gray background for the SVG circle
};

const STRINGS = {
  TITLE: "No Books in This Genre",
  DESCRIPTION: "We couldn't find any books in this category yet. Please explore other genres or check back later for new additions.",
};

const GenreEmptyState = () => {
  return (
    <View style={styles.container}>
      {/* --- 1. SVG Illustration (Empty Box) --- */}
      <View style={styles.illustrationContainer}>
        <Svg width="240" height="200" viewBox="0 0 240 200" fill="none">
          <Defs>
            <LinearGradient id="box_grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#E0E7FF" />
              <Stop offset="1" stopColor="#C7D2FE" />
            </LinearGradient>
          </Defs>

          {/* Background Circle */}
          <Circle cx="120" cy="100" r="90" fill={COLORS.BG_LIGHT} />
          
          {/* Shadow under the box */}
          <Ellipse cx="120" cy="160" rx="60" ry="10" fill="#D1D5DB" opacity="0.5" />

          {/* Open Empty Box */}
          <G transform="translate(60, 50)">
            {/* Back and Bottom sides */}
            <Path
              d="M20 40 L100 40 L100 110 L20 110 Z"
              fill="url(#box_grad)"
              stroke={COLORS.SECONDARY}
              strokeWidth="2"
            />
            <Path
              d="M20 110 L100 110 L80 130 L0 130 Z"
              fill="#A5B4FC"
              opacity="0.6"
            />
             <Path
              d="M100 40 L100 110 L120 90 L120 20 Z"
              fill="#818CF8"
              opacity="0.6"
            />

            {/* Front Flaps (Open) */}
            <Path
              d="M0 40 L20 40 L20 110 L0 130 Z"
              fill="url(#box_grad)"
              stroke={COLORS.SECONDARY}
              strokeWidth="2"
            />
             <Path
              d="M0 40 L20 40 L100 40 L120 20"
              fill="none"
              stroke={COLORS.SECONDARY}
              strokeWidth="2"
            />
          </G>
          
          {/* Decorative elements (Dust motes) */}
          <Circle cx="40" cy="60" r="4" fill={COLORS.SECONDARY} opacity="0.6"/>
          <Circle cx="200" cy="140" r="6" fill={COLORS.SECONDARY} opacity="0.4" />
          <Circle cx="180" cy="40" r="3" fill={COLORS.SECONDARY} opacity="0.7"/>
        </Svg>
      </View>

      {/* --- 2. Text Content --- */}
      <Text style={styles.title}>{STRINGS.TITLE}</Text>
      <Text style={styles.description}>{STRINGS.DESCRIPTION}</Text>

      {/* Button Removed as requested */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    // backgroundColor: '#FFFFFF', 
  },
  illustrationContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: COLORS.GRAY_TEXT,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '85%', // Limits width to make text easier to read
  },
});

export default GenreEmptyState;