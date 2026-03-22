import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  StatusBar, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAtom } from 'jotai';
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

// ── HTML → plain paragraphs ────────────────────────────────────────────────────
function stripHtml(html: string): string[] {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
}

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

  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [brightness, setBrightness] = useState(0.8);
  const [theme, setTheme] = useState<ThemeOption>(READING_THEMES[2]); // Day default

  const flatListRef = useRef<FlatList<string>>(null);
  const fontSize = fontSizeAtomVal ?? DEFAULT_FONT_SIZE;
  const fonts = getFontList(language);

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

  // Load & parse HTML file
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const loadContent = async () => {
      try {
        if (localPageDir) {
          const dir = await RNFS.readDir(localPageDir);
          const htmlFiles = (dir ?? [])
            .filter(f => f.name?.endsWith('.html') || f.name?.endsWith('.htm'))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
          const allParas: string[] = [];
          for (const f of htmlFiles) {
            if (!isMounted) return;
            const html = await RNFS.readFile(f.path, 'utf8');
            allParas.push(...stripHtml(html));
          }
          if (isMounted) setParagraphs(allParas);
        } else {
          const html = await RNFS.readFile(path, 'utf8');
          if (isMounted) setParagraphs(stripHtml(html));
        }
      } catch (err) {
        console.error('NativeHtmlReader load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadContent();
    return () => { isMounted = false; };
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
    setFontSizeAtom(prev => {
      const next = fn(prev);
      return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, next));
    });
  };

  const PARAS_PER_PAGE = 20;
  const totalPages = Math.ceil(paragraphs.length / PARAS_PER_PAGE);
  const pages: string[][] = [];
  for (let i = 0; i < paragraphs.length; i += PARAS_PER_PAGE) {
    pages.push(paragraphs.slice(i, i + PARAS_PER_PAGE));
  }

  const renderPage = ({ item, index }: { item: string[]; index: number }) => (
    <View style={[styles.page, { width, backgroundColor: theme.bg }]}>
      {item.map((para, pi) => (
        <Text
          key={pi}
          style={[
            styles.paragraph,
            {
              fontSize,
              color: theme.color,
              fontFamily: fonts.find(f => f.id === fontFamilyId)?.nativeFont ?? undefined,
            },
          ]}
        >
          {para}
        </Text>
      ))}
    </View>
  );

  const bg = theme.bg;
  const textColor = theme.color;
  const isDarkTheme = theme.dark;

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
  paragraph: { lineHeight: 28, marginBottom: 12 },
  footer: {
    height: 36, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1,
  },
  pageNum: { fontSize: 13 },
});

export default NativeHtmlReader;
