import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  StatusBar, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAtom } from 'jotai';
import RenderHtml from 'react-native-render-html';
import { Icon, IconKey, IconsSize } from '../../componet/atoms/icons';
import { PageOptionsModal, READING_THEMES, ThemeOption } from './PageOptionsModal';
import { EsModel } from '../../componet/atoms/container/ModalContainer';
import { IEsModelRefProps } from '../../componet/atoms/Types/IModal';
import { darkModeAtom } from '../../features/jotai/model/darkMode';
import { fontSizeAtom, MIN_FONT_SIZE, MAX_FONT_SIZE, DEFAULT_FONT_SIZE } from '../../features/jotai/model/fontSize';
import { landscapeModeAtom } from '../../features/jotai/model/landscapeMode';
import { fontFamilyAtom, DEFAULT_FONT_FAMILY_ID } from '../../features/jotai/model/fontFamily';
import AsyncStorage from '@react-native-async-storage/async-storage';

let Brightness: { getAppBrightness: () => Promise<number>; setAppBrightness: (level: number) => Promise<void> } | null = null;
try { const mod = require('react-native-brightness'); Brightness = mod.default || mod; } catch (_) {}

let Orientation: typeof import('react-native-orientation-locker').default | null = null;
try { Orientation = require('react-native-orientation-locker').default; } catch (_) {}

// ── Props ──────────────────────────────────────────────────────────────────────
interface NativeHtmlReaderProps {
  path: string;
  title: string;
  language?: string;
  localPageDir?: string;
  knownTotalPages?: number;
}

const THEME_STORAGE_KEY = 'native_reader_theme';
const BRIGHTNESS_STORAGE_KEY = 'native_reader_brightness';

const MYANMAR_FONTS = [
  { id: 'default',    label: 'Default',    css: 'Pyidaungsu', nativeFont: 'Pyidaungsu',  preview: 'က' },
  { id: 'myanmar3',   label: 'Myanmar3',   css: 'Myanmar3',   nativeFont: 'Myanmar3',    preview: 'က' },
];
const ENGLISH_FONTS = [
  { id: 'default',    label: 'Default',    css: 'System',     nativeFont: undefined,      preview: 'Aa' },
  { id: 'georgia',    label: 'Georgia',    css: 'Georgia',    nativeFont: 'Georgia',      preview: 'Aa' },
  { id: 'times',      label: 'Times New',  css: 'Times New Roman', nativeFont: 'Times New Roman', preview: 'Aa' },
];

function getFontList(language?: string) {
  const lang = language?.toLowerCase() ?? '';
  return lang.includes('myanmar') || lang.includes('burmese') || lang.includes('mm')
    ? MYANMAR_FONTS
    : ENGLISH_FONTS;
}

// Split raw HTML/text content into pages using '---' as separator
function splitIntoPages(raw: string): string[] {
  return raw
    .split(/\n\s*---\s*\n/)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0);
}

// Combine HTML files into pages by '---' separator across all files
async function loadPages(
  path: string,
  localPageDir?: string,
  isMountedRef?: { current: boolean },
): Promise<string[]> {
  if (localPageDir) {
    const dir = await RNFS.readDir(localPageDir);
    const htmlFiles = (dir ?? [])
      .filter(f => f.name?.endsWith('.html') || f.name?.endsWith('.htm'))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    const allChunks: string[] = [];
    for (const f of htmlFiles) {
      if (isMountedRef && !isMountedRef.current) return [];
      const html = await RNFS.readFile(f.path, 'utf8');
      allChunks.push(...splitIntoPages(html));
    }
    return allChunks;
  } else {
    const html = await RNFS.readFile(path, 'utf8');
    return splitIntoPages(html);
  }
}

// ── Component ──────────────────────────────────────────────────────────────────
const NativeHtmlReader: React.FC<NativeHtmlReaderProps> = ({
  path, title, language, localPageDir, knownTotalPages,
}) => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const pageOptionsRef = useRef<IEsModelRefProps>(null);

  const [isDark, setDarkMode] = useAtom(darkModeAtom);
  const [fontSizeAtomVal, setFontSizeAtom] = useAtom(fontSizeAtom);
  const [landscape, setIsLandscape] = useAtom(landscapeModeAtom);
  const [fontFamilyId, setFontFamilyId] = useAtom(fontFamilyAtom);

  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [brightness, setBrightness] = useState(0.8);
  const [theme, setTheme] = useState<ThemeOption>(READING_THEMES[2]); // Day default

  const flatListRef = useRef<FlatList<string>>(null);
  const isMountedRef = useRef(true);
  const fontSize = fontSizeAtomVal ?? DEFAULT_FONT_SIZE;
  const fonts = getFontList(language);
  const currentFont = fonts.find(f => f.id === fontFamilyId);

  // Load saved theme & brightness
  useEffect(() => {
    AsyncStorage.multiGet([THEME_STORAGE_KEY, BRIGHTNESS_STORAGE_KEY]).then(pairs => {
      const savedThemeKey = pairs[0][1];
      const savedBrightness = pairs[1][1];
      if (savedThemeKey) {
        const found = READING_THEMES.find(t => t.key === savedThemeKey);
        if (found) setTheme(found);
      }
      if (savedBrightness) setBrightness(parseFloat(savedBrightness));
    });
  }, []);

  // Load & split HTML files into pages
  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);
    loadPages(path, localPageDir, isMountedRef)
      .then(chunks => {
        if (isMountedRef.current) setPages(chunks);
      })
      .catch(err => console.error('NativeHtmlReader load error:', err))
      .finally(() => {
        if (isMountedRef.current) setLoading(false);
      });
    return () => { isMountedRef.current = false; };
  }, [path, localPageDir]);

  // Restore brightness on focus, reset on blur
  useFocusEffect(useCallback(() => {
    Brightness?.setAppBrightness(brightness);
    return () => { Brightness?.setAppBrightness(1.0); };
  }, [brightness]));

  // Orientation lock
  useEffect(() => {
    if (!Orientation) return;
    landscape ? Orientation.lockToLandscape() : Orientation.lockToPortrait();
    return () => Orientation?.unlockAllOrientations();
  }, [landscape]);

  const applyTheme = (t: ThemeOption) => {
    setTheme(t);
    setDarkMode(t.dark);
    handleBrightnessChange(t.brightness);
    AsyncStorage.setItem(THEME_STORAGE_KEY, t.key);
  };

  const handleBrightnessChange = (v: number) => {
    setBrightness(v);
    Brightness?.setAppBrightness(v);
    AsyncStorage.setItem(BRIGHTNESS_STORAGE_KEY, String(v));
  };

  const setFontSizeVal = (fn: (f: number | null) => number) => {
    setFontSizeAtom((prev: number | null) => {
      const next = fn(prev);
      return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, next));
    });
  };

  const totalPages = pages.length;
  const bg = theme.bg;
  const textColor = theme.color;
  const isDarkTheme = theme.dark;

  // tagsStyles and baseStyle for RenderHtml
  const tagsStyles = {
    body: { color: textColor, fontFamily: currentFont?.css },
    p: { color: textColor, fontSize, lineHeight: fontSize * 1.7, marginBottom: 10 },
    h1: { color: textColor, fontSize: fontSize + 8, fontWeight: '700' as const, marginBottom: 8 },
    h2: { color: textColor, fontSize: fontSize + 6, fontWeight: '700' as const, marginBottom: 8 },
    h3: { color: textColor, fontSize: fontSize + 4, fontWeight: '700' as const, marginBottom: 6 },
    h4: { color: textColor, fontSize: fontSize + 2, fontWeight: '700' as const, marginBottom: 6 },
    blockquote: {
      borderLeftWidth: 4, borderLeftColor: '#7c3aed',
      paddingLeft: 12, marginLeft: 0,
      color: textColor, fontStyle: 'italic' as const,
    },
    pre: { color: textColor, backgroundColor: isDarkTheme ? '#1a1a1a' : '#f5f5f5', padding: 10, borderRadius: 6 },
    code: { color: textColor, backgroundColor: isDarkTheme ? '#1a1a1a' : '#f5f5f5', borderRadius: 4 },
    strong: { color: textColor, fontWeight: '700' as const },
    em: { color: textColor, fontStyle: 'italic' as const },
    a: { color: '#7c3aed' },
    li: { color: textColor, fontSize, lineHeight: fontSize * 1.7 },
    td: { color: textColor, padding: 6, borderWidth: 1, borderColor: isDarkTheme ? '#444' : '#ddd' },
    th: { color: textColor, padding: 6, fontWeight: '700' as const, borderWidth: 1, borderColor: isDarkTheme ? '#444' : '#ddd', backgroundColor: isDarkTheme ? '#222' : '#f0f0f0' },
    div: { color: textColor },
  };

  const renderPage = ({ item, index }: { item: string; index: number }) => (
    <View style={[styles.page, { width, backgroundColor: bg }]}>
      <RenderHtml
        contentWidth={width - 40}
        source={{ html: item }}
        tagsStyles={tagsStyles as any}
        baseStyle={{ color: textColor, fontSize, lineHeight: fontSize * 1.7, fontFamily: currentFont?.css }}
        enableExperimentalBRCollapsing
        enableExperimentalGhostLinesPrevention
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar backgroundColor={bg} barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: bg, borderBottomColor: isDarkTheme ? '#333' : '#ddd' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon icon={IconKey.back} size={IconsSize.normal} className={{ color: textColor }} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>{title}</Text>
        <TouchableOpacity onPress={() => pageOptionsRef.current?.open()} style={styles.headerBtn}>
          <Icon icon={IconKey.setting} size={IconsSize.normal} className={{ color: textColor }} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={textColor} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={pages}
          renderItem={renderPage}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentPage(idx);
          }}
        />
      )}

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: bg, borderTopColor: isDarkTheme ? '#333' : '#ddd' }]}>
        <Text style={[styles.pageNum, { color: textColor }]}>
          {currentPage + 1} / {totalPages || 1}
        </Text>
      </View>

      {/* Page Options */}
      <EsModel ref={pageOptionsRef}>
        <PageOptionsModal
          modalRef={pageOptionsRef}
          winHeight={height}
          navigation={navigation}
          applyTheme={applyTheme}
          enabled={isDark ?? false}
          setDarkMode={setDarkMode}
          landscape={landscape ?? false}
          setIsLandscape={setIsLandscape}
          brightness={brightness}
          handleBrightnessChange={handleBrightnessChange}
          fontSize={fontSize}
          setFontSizeVal={setFontSizeVal}
          fonts={fonts}
          fontId={fontFamilyId ?? DEFAULT_FONT_FAMILY_ID}
          setFontFamilyId={setFontFamilyId}
          pageCount={totalPages}
          setCurrentPage={page => {
            flatListRef.current?.scrollToIndex({ index: page - 1, animated: true });
          }}
        />
      </EsModel>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, height: 48, borderBottomWidth: 1,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '600' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  page: { paddingHorizontal: 20, paddingTop: 16 },
  footer: {
    height: 36, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1,
  },
  pageNum: { fontSize: 13 },
});

export default NativeHtmlReader;
