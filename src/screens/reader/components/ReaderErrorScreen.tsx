import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { GradientColor } from '../../../res/color';

interface Props {
  fileError: string;
  enabled: boolean;
  themeBg: string;
}

export const ReaderErrorScreen: React.FC<Props> = ({ fileError, enabled, themeBg }) => {
  const navigation = useNavigation();
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: themeBg }]}>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.flex}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <View style={styles.container}>
          <Text style={styles.icon}>📖</Text>
          <Text style={styles.title}>Unable to Open Book</Text>
          <View style={[styles.errorBox, { backgroundColor: enabled ? '#1e1e1e' : '#f5f5f5' }]}>
            <Text selectable style={[styles.errorText, { color: enabled ? '#ff8a80' : '#c62828' }]}>
              {fileError}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn, { backgroundColor: GradientColor[2] }]}>
            <Text style={styles.btnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex:      { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  icon:      { fontSize: 48 },
  title:     { fontSize: 16, fontWeight: '700', color: '#f44336' },
  errorBox:  { borderRadius: 8, padding: 12, marginHorizontal: 16, maxWidth: '100%' },
  errorText: { fontSize: 12, fontFamily: 'monospace', lineHeight: 18 },
  btn:       { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  btnText:   { color: '#fff', fontWeight: '700', fontSize: 14 },
});
