import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PdfReader } from './reader/pdfReader';
import { downloadFile } from '../utils/downloadFile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNav, RootStackParamList } from '../nav/main.nav';
import ReaderFlatListWebView from './reader/htmlReader';
import TextReaderPage from './reader/textReader';
import NativeHtmlReader from './reader/NativeHtmlReader';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ReaderScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.Reader>;

export type HtmlReaderMode = 'performance' | 'design';
export const HTML_MODE_KEY = 'html_reader_mode';

export const Reader: React.FC<ReaderScreenProps> = ({ route, navigation }) => {
  const [path, setPath] = useState<string | null>(null);
  const [localPageDir, setLocalPageDir] = useState<string | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const [htmlMode, setHtmlMode] = useState<HtmlReaderMode | null>(null);
  const [modeLoaded, setModeLoaded] = useState(false);
  const [htmlFallback, setHtmlFallback] = useState(false);

  const book = route.params;
  const bookType = route.params.premium_type;

  // Download book file
  useEffect(() => {
    let isMounted = true;
    downloadFile(route.params)
      .then(downloadedBook => {
        if (isMounted && downloadedBook) {
          setPath(downloadedBook.localFilePath);
          setLocalPageDir(downloadedBook.localPageDir);
          setTotalPages(downloadedBook.totalPages);
        }
      })
      .catch(err => console.error('Reader download error:', err));
    return () => { isMounted = false; };
  }, []);

  // Load saved html reader mode (default: 'design')
  useEffect(() => {
    if (bookType !== 'html') { setModeLoaded(true); return; }
    AsyncStorage.getItem(HTML_MODE_KEY).then(saved => {
      setHtmlMode(saved === 'performance' ? 'performance' : 'design');
      setModeLoaded(true);
    });
  }, [bookType]);

  // Non-html types — render directly
  if (bookType !== 'html') {
    return (
      <>
        {path != null && bookType === 'text' && <TextReaderPage path={path} />}
        {path != null && bookType === 'pdf' && <PdfReader path={path} />}
      </>
    );
  }

  // HTML type — wait for mode to load
  if (!modeLoaded) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#7B5EC9" />
      </SafeAreaView>
    );
  }

  // HTML type — render chosen reader
  if (path == null) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#7B5EC9" />
        <Text style={styles.loadingText}>Loading book…</Text>
      </SafeAreaView>
    );
  }

  if (htmlMode === 'performance' || htmlFallback) {
    return (
      <NativeHtmlReader
        path={path}
        title={book.title}
        language={book.language}
        localPageDir={localPageDir}
        knownTotalPages={totalPages}
      />
    );
  }

  return (
    <ReaderFlatListWebView
      path={path}
      title={book.title}
      language={book.language}
      localPageDir={localPageDir}
      knownTotalPages={totalPages}
      onError={() => setHtmlFallback(true)}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#888' },

  picker: {
    flex: 1,
    backgroundColor: '#f8f8fc',
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 24, fontWeight: '800', color: '#1a1a2e', marginBottom: 8,
  },
  pickerSub: {
    fontSize: 13, color: '#888', marginBottom: 40,
  },
  modeCard: {
    width: '100%', borderRadius: 20, padding: 24, marginBottom: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 5,
  },
  perfCard: { backgroundColor: '#7B5EC9', shadowColor: '#7B5EC9' },
  designCard: { backgroundColor: '#fff', shadowColor: '#000' },
  modeIcon: { fontSize: 40, marginBottom: 10 },
  modeTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8, color: '#1a1a2e' },
  modeDesc: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 20 },
  backBtn: { marginTop: 24 },
  backBtnText: { fontSize: 15, color: '#7B5EC9', fontWeight: '600' },
});
