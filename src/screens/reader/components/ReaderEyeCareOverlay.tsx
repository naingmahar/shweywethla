import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  dimOpacity: number;
  warmOpacity: number;
}

export const ReaderEyeCareOverlay: React.FC<Props> = ({ dimOpacity, warmOpacity }) => (
  <>
    {dimOpacity > 0.02 && (
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.dim, { opacity: dimOpacity }]} />
    )}
    {warmOpacity > 0.02 && (
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.warm, { opacity: warmOpacity }]} />
    )}
  </>
);

const styles = StyleSheet.create({
  dim:  { backgroundColor: '#000000', zIndex: 10 },
  warm: { backgroundColor: '#FF8C00', zIndex: 11 },
});
