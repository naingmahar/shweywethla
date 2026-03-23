import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientColor } from '../../../res/color';

interface Props {
  themeBg: string;
  enabled: boolean;
}

export const ReaderLoadingScreen: React.FC<Props> = ({ themeBg, enabled }) => (
  <View style={[StyleSheet.absoluteFill, { backgroundColor: themeBg }]}>
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.flex}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <View style={styles.container}>
        <ActivityIndicator size="large" color={GradientColor[2]} />
        <Text style={[styles.text, { color: enabled ? '#aaa' : '#888' }]}>
          Loading book...
        </Text>
      </View>
    </SafeAreaView>
  </View>
);

const styles = StyleSheet.create({
  flex:      { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  text:      { fontSize: 15, fontWeight: '500' },
});
