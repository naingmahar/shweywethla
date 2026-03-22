import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  StatusBar, ActivityIndicator, useWindowDimensions, ScrollView,
} from 'react-native';
import RNFS from 'react-native-fs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAtom } from 'jotai';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Icon, IconKey, IconsSize } from '../../componet/atoms/icons';
import { PageOptionsModal, READING_THEMES, ThemeOption } from './PageOptionsModal';
import { EsModel } from '../../componet/atoms/container/ModalContainer';
import { IEsModelRefProps } from '../../componet/atoms/Types/IModal';
import { darkModeAtom } from '../../features/jotai/model/darkMode';
import { fontSizeAtom, MIN_FONT_SIZE, MAX_FONT_SIZE, DEFAULT_FONT_SIZE } from '../../features/jotai/model/fontSize';
import { landscapeModeAtom } from '../../features/jotai/model/landscapeMode';
import { fontFamilyAtom, DEFAULT_FONT_FAMILY_ID } from '../../features/jotai/model/fontFamily';
import { GradientColor } from '../../res/color';

const BUTTON_SIZE = 44;
const BTN_MARGIN = 30;

let Brightness: { getAppBrightness: () => Promise<number>; setAppBrightness: (level: number) => Promise<void> } | null = null;
try { const mod = require('react-native-brightness'); Brightness = mod.default || mod; } catch (_) {}

let Orientation: typeof import('react-native-orientation-locker').default | null = null;
try { Orientation = require('react-native-orientation-locker').default; } catch (_) {}

// ── Font Options ───────────────────────────────────────────────────────────────
const MYANMAR_FONTS = [
  { id: 'default',  label: 'Default',  css: 'Pyidaungsu', nativeFont: 'Pyidaungsu', preview: 'က' },
  { id: 'myanmar3', label: 'Myanmar3', css: 'Myanmar3',   nativeFont: 'Myanmar3',   preview: 'က' },
];
const ENGLISH_FONTS = [
  { id: 'default',  label: 'Default',  css: 'System',              nativeFont: undefined,         preview: 'Aa' },
  { id: 'georgia',  label: 'Georgia',  css: 'Georgia',             nativeFont: 'Georgia',         preview: 'Aa' },
  { id: 'times',    label: 'Times New', css: 'Times New Roman',    nativeFont: 'Times New Roman', preview: 'Aa' },
];

function getFontList(language?: string) {
  const lang = language?.toLowerCase() ?? '';
  return lang.includes('myanmar') || lang.includes('burmese') || lang === 'mm' || lang === 'my'
    ? MYANMAR_FONTS
    : ENGLISH_FONTS;
}

const SYSTEM_FONTS = [...defaultSystemFonts, 'Pyidaungsu', 'Myanmar3'];
const THEME_STORAGE_KEY = 'native_reader_theme';
const BRIGHTNESS_STORAGE_KEY = 'native_reader_brightness';

function getLineHeight(fontSize: number, language?: string): number {
  const lang = language?.toLowerCase() ?? '';
  const isMyanmar = lang.includes('myanmar') || lang.includes('burmese') || lang === 'mm' || lang === 'my';
  return isMyanmar ? fontSize * 2.4 : fontSize * 1.7;
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface NativeHtmlReaderProps {
  path: string;
  title: string;
  language?: string;
  localPageDir?: string;
  knownTotalPages?: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
const NativeHtmlReader: React.FC<NativeHtmlReaderProps> = ({
  path, title, language, localPageDir, knownTotalPages,
}) => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const pageOptionsRef = useRef<IEsModelRefProps>(null);
  const isMountedRef = useRef(true);

  const isPerPageMode = !!localPageDir;

  // ── Jotai atoms ───────────────────────────────────────────────────────────
  const [isDark, setDarkMode] = useAtom(darkModeAtom);
  const [fontSizeAtomVal, setFontSizeAtom] = useAtom(fontSizeAtom);
  const [landscape, setIsLandscape] = useAtom(landscapeModeAtom);
  const [fontFamilyId, setFontFamilyId] = useAtom(fontFamilyAtom);

  // ── State ─────────────────────────────────────────────────────────────────
  // Per-page mode: load one page at a time
  const [currentPageContent, setCurrentPageContent] = useState('');
  const [totalPageCount, setTotalPageCount] = useState(knownTotalPages ?? 0);
  const pageCache = useRef<Map<number, string>>(new Map());
  const prefetching = useRef<Set<number>>(new Set());

  // Legacy full-file mode: all pages loaded at once
  const [allPages, setAllPages] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [isPageRestored, setIsPageRestored] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);

  const [brightness, setBrightness] = useState(0.8);
  const [theme, setTheme] = useState<ThemeOption>(READING_THEMES[2]);

  const flatListRef = useRef<FlatList<string>>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fontSize = fontSizeAtomVal ?? DEFAULT_FONT_SIZE;
  const fonts = getFontList(language);
  const fontId = fontFamilyId ?? DEFAULT_FONT_FAMILY_ID;
  const currentFont = fonts.find(f => f.id === fontId) ?? fonts[0];
  const fontFamily = currentFont?.nativeFont ?? undefined;

  // Unified page count and content
  const pageCount = isPerPageMode ? totalPageCount : allPages.length;
  const pageContent = isPerPageMode ? currentPageContent : (allPages[currentPage] ?? '');

  // ── Load saved theme & brightness ─────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.multiGet([THEME_STORAGE_KEY, BRIGHTNESS_STORAGE_KEY]).then(pairs => {
      const savedThemeKey = pairs[0][1];
      const savedBrightness = pairs[1][1];
      if (savedThemeKey) {
        const found = READING_THEMES.find(t => t.key === savedThemeKey);
        if (found && isMountedRef.current) setTheme(found);
      }
      if (savedBrightness && isMountedRef.current) setBrightness(parseFloat(savedBrightness));
    });
    return () => { isMountedRef.current = false; };
  }, []);

  // ── Step 1: Restore last read page ────────────────────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(`@last_page_${title}`)
      .then(saved => {
        if (saved !== null && isMountedRef.current) setCurrentPage(parseInt(saved));
      })
      .catch(e => console.error('Failed to load page', e))
      .finally(() => { if (isMountedRef.current) setIsPageRestored(true); });
  }, [title]);

  // ── Step 2: Debounced page save ───────────────────────────────────────────
  useEffect(() => {
    if (!isPageRestored) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(`@last_page_${title}`, currentPage.toString())
        .catch(e => console.error('Failed to save page', e));
    }, 400);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [currentPage, isPageRestored, title]);

  // ── Prefetch helper (per-page mode) ───────────────────────────────────────
  const prefetchPage = useCallback((idx: number) => {
    if (!localPageDir) return;
    if (idx < 0 || idx >= totalPageCount) return;
    if (pageCache.current.has(idx) || prefetching.current.has(idx)) return;
    prefetching.current.add(idx);
    RNFS.readFile(`${localPageDir}/page_${idx}.txt`, 'utf8')
      .then(content => {
        pageCache.current.set(idx, content);
        for (const key of pageCache.current.keys()) {
          if (Math.abs(key - idx) > 5) pageCache.current.delete(key);
        }
      })
      .catch(() => {})
      .finally(() => prefetching.current.delete(idx));
  }, [localPageDir, totalPageCount]);

  // ── Step 3a: Per-page mode — load current page ────────────────────────────
  useEffect(() => {
    if (!isPerPageMode || !localPageDir) return;
    const load = async () => {
      setIsFileLoading(true);
      try {
        if (totalPageCount === 0) {
          const meta = JSON.parse(await RNFS.readFile(`${localPageDir}/meta.json`, 'utf8'));
          if (isMountedRef.current) setTotalPageCount(meta.totalPages);
        }
        let content = pageCache.current.get(currentPage);
        if (!content) {
          content = await RNFS.readFile(`${localPageDir}/page_${currentPage}.txt`, 'utf8');
          pageCache.current.set(currentPage, content);
        }
        if (isMountedRef.current) setCurrentPageContent(content);
        prefetchPage(currentPage + 1);
        prefetchPage(currentPage + 2);
        prefetchPage(currentPage - 1);
      } catch (err) {
        console.error('Per-page load failed:', err);
        if (isMountedRef.current) setFileError('Failed to load page. Storage may be full or file is corrupted.');
      } finally {
        if (isMountedRef.current) setIsFileLoading(false);
      }
    };
    load();
  }, [isPerPageMode, localPageDir, currentPage, totalPageCount, prefetchPage]);

  // ── Step 3b: Legacy full-file mode ────────────────────────────────────────
  useEffect(() => {
    if (isPerPageMode) return;
    setIsFileLoading(true);
    RNFS.readFile(path, 'utf8')
      .then(content => {
        const parsed = content
          .split('---')
          .map(p => p.trim())
          .filter(p => p.length > 0);
        if (isMountedRef.current) setAllPages(parsed);
      })
      .catch(err => {
        console.error(err);
        if (isMountedRef.current) setFileError('Failed to load book. The file may be missing or corrupted.');
      })
      .finally(() => { if (isMountedRef.current) setIsFileLoading(false); });
  }, [path, isPerPageMode]);

  // ── Brightness ────────────────────────────────────────────────────────────
  useFocusEffect(useCallback(() => {
    Brightness?.setAppBrightness(brightness);
    return () => { Brightness?.setAppBrightness(1.0); };
  }, [brightness]));

  // ── Orientation ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!Orientation) return;
    landscape ? Orientation.lockToLandscape() : Orientation.lockToPortrait();
    return () => Orientation?.unlockAllOrientations();
  }, [landscape]);

  // ── Theme & brightness handlers ───────────────────────────────────────────
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

  const bg = theme.bg;
  const textColor = theme.color;
  const isDarkTheme = theme.dark;
  const pageContentHeight = height - 48 - 44; // 48 header + 44 footer
  const lineHeight = getLineHeight(fontSize, language);

  // Eye care overlays — same as HTML reader
  const dimOpacity  = (1 - brightness) * 0.85;
  const warmOpacity = (1 - brightness) * 0.38;

  // ── Draggable floating button ──────────────────────────────────────────────
  const isLandscapeNow  = width > height;
  const activeMargin    = isLandscapeNow ? BTN_MARGIN * 1.5 : BTN_MARGIN;
  const containerWidth  = width  - insets.left - insets.right;
  const containerHeight = height - insets.bottom;
  const snapLeftX  = activeMargin;
  const snapRightX = containerWidth - BUTTON_SIZE - activeMargin;
  const btnMinY    = insets.top + activeMargin;
  const btnMaxY    = containerHeight - BUTTON_SIZE - activeMargin;

  const sidePreference = useSharedValue(1);
  const btnX = useSharedValue(snapRightX);
  const btnY = useSharedValue(containerHeight * 0.5);
  const btnContext = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    const targetX = sidePreference.value === 0 ? snapLeftX : snapRightX;
    btnX.value = withSpring(targetX);
    btnY.value = withSpring(Math.max(btnMinY, Math.min(btnY.value, btnMaxY)));
  }, [snapLeftX, snapRightX, btnMinY, btnMaxY]);

  const openSettingsModal = useCallback(() => { pageOptionsRef.current?.open(); }, []);

  const tapGesture = Gesture.Tap().onEnd(() => { runOnJS(openSettingsModal)(); });
  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onStart(() => { btnContext.value = { x: btnX.value, y: btnY.value }; })
    .onUpdate(e => {
      btnX.value = btnContext.value.x + e.translationX;
      btnY.value = btnContext.value.y + e.translationY;
    })
    .onEnd(() => {
      const snapToLeft = btnX.value < containerWidth / 2;
      sidePreference.value = snapToLeft ? 0 : 1;
      btnX.value = withSpring(snapToLeft ? snapLeftX : snapRightX);
      btnY.value = withSpring(Math.max(btnMinY, Math.min(btnMaxY, btnY.value)));
    });
  const dragGesture = Gesture.Race(tapGesture, panGesture);
  const floatingBtnAnimStyle = useAnimatedStyle(() => ({ left: btnX.value, top: btnY.value }));
  // ──────────────────────────────────────────────────────────────────────────

  // ── tagsStyles for HTML fragments (no html/head/body wrapper) ────────────
  const tagsStyles = {
    p:          { color: textColor, fontSize, lineHeight: lineHeight, marginBottom: 10, fontFamily },
    h1:         { color: textColor, fontSize: fontSize + 8, fontWeight: '700' as const, marginBottom: 8, fontFamily },
    h2:         { color: textColor, fontSize: fontSize + 6, fontWeight: '700' as const, marginBottom: 8, fontFamily },
    h3:         { color: textColor, fontSize: fontSize + 4, fontWeight: '700' as const, marginBottom: 6, fontFamily },
    h4:         { color: textColor, fontSize: fontSize + 2, fontWeight: '700' as const, marginBottom: 6, fontFamily },
    h5:         { color: textColor, fontSize: fontSize + 1, fontWeight: '600' as const, marginBottom: 4, fontFamily },
    h6:         { color: textColor, fontSize,               fontWeight: '600' as const, marginBottom: 4, fontFamily },
    blockquote: { borderLeftWidth: 4, borderLeftColor: '#7c3aed', paddingLeft: 12, marginLeft: 0, color: textColor, fontStyle: 'italic' as const, fontFamily },
    pre:        { color: textColor, backgroundColor: isDarkTheme ? '#1a1a1a' : '#f5f5f5', padding: 10, borderRadius: 6, fontFamily },
    code:       { color: textColor, backgroundColor: isDarkTheme ? '#1a1a1a' : '#f5f5f5', borderRadius: 4 },
    strong:     { color: textColor, fontWeight: '700' as const, fontFamily },
    b:          { color: textColor, fontWeight: '700' as const, fontFamily },
    em:         { color: textColor, fontStyle: 'italic' as const, fontFamily },
    i:          { color: textColor, fontStyle: 'italic' as const, fontFamily },
    span:       { color: textColor, fontFamily },
    a:          { color: '#7c3aed' },
    li:         { color: textColor, fontSize, lineHeight: lineHeight, fontFamily },
    td:         { color: textColor, padding: 6, borderWidth: 1, borderColor: isDarkTheme ? '#444' : '#ddd', fontFamily },
    th:         { color: textColor, padding: 6, fontWeight: '700' as const, borderWidth: 1, borderColor: isDarkTheme ? '#444' : '#ddd', backgroundColor: isDarkTheme ? '#222' : '#f0f0f0', fontFamily },
    div:        { color: textColor, fontFamily },
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const themeBg = bg;

  if (isFileLoading) {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: themeBg }]}>
        <SafeAreaView style={styles.fullFlex}>
          <StatusBar backgroundColor={themeBg} barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={GradientColor[2]} />
            <Text style={[styles.loadingText, { color: textColor }]}>Loading book...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (fileError) {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: themeBg }]}>
        <SafeAreaView style={styles.fullFlex}>
          <StatusBar backgroundColor={themeBg} barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />
          <View style={styles.loadingContainer}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📖</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#f44336', marginBottom: 8 }}>Unable to Open Book</Text>
            <Text style={{ fontSize: 13, color: textColor, textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 }}>{fileError}</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: GradientColor[2], borderRadius: 24 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Per-page mode: single page view with prev/next buttons
  if (isPerPageMode) {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: bg }]}>
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.fullFlex}>
          <StatusBar backgroundColor={bg} barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />
          <GestureHandlerRootView style={[styles.fullFlex, { backgroundColor: bg }]}>
            <View style={[styles.header, { backgroundColor: bg, borderBottomColor: isDarkTheme ? '#333' : '#ddd' }]}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                <Icon icon={IconKey.back} size={IconsSize.normal} className={{ color: textColor }} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>{title}</Text>
              <View style={styles.headerBtn} />
            </View>

            <ScrollView style={{ flex: 1, backgroundColor: bg }} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
              {!!pageContent && (
                <RenderHtml
                  contentWidth={width - 40}
                  source={{ html: pageContent }}
                  tagsStyles={tagsStyles as any}
                  baseStyle={{ color: textColor, fontSize, lineHeight: lineHeight, fontFamily }}
                  systemFonts={SYSTEM_FONTS}
                  enableExperimentalBRCollapsing
                  enableExperimentalGhostLinesPrevention
                />
              )}
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: bg, borderTopColor: isDarkTheme ? '#333' : '#ddd' }]}>
              <TouchableOpacity style={[styles.navBtn, currentPage === 0 && styles.navBtnDisabled]} onPress={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
                <Text style={[styles.navBtnText, currentPage === 0 && styles.navBtnTextDisabled]}>‹</Text>
              </TouchableOpacity>
              <Text style={[styles.pageNum, { color: textColor }]}>{currentPage + 1} / {pageCount || 1}</Text>
              <TouchableOpacity style={[styles.navBtn, currentPage >= pageCount - 1 && styles.navBtnDisabled]} onPress={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))} disabled={currentPage >= pageCount - 1}>
                <Text style={[styles.navBtnText, currentPage >= pageCount - 1 && styles.navBtnTextDisabled]}>›</Text>
              </TouchableOpacity>
            </View>

            {dimOpacity > 0.02 && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: dimOpacity, zIndex: 10 }]} />}
            {warmOpacity > 0.02 && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#FF8C00', opacity: warmOpacity, zIndex: 11 }]} />}

            <GestureDetector gesture={dragGesture}>
              <Animated.View style={[styles.floatingBtn, isDarkTheme ? styles.floatingBtnDark : styles.floatingBtnLight, floatingBtnAnimStyle]}>
                <Icon icon={IconKey.setting} size={IconsSize.normal} className={{ color: isDarkTheme ? '#e1e1e1' : '#555' }} />
              </Animated.View>
            </GestureDetector>

            <EsModel ref={pageOptionsRef}>
              <PageOptionsModal
                modalRef={pageOptionsRef} winHeight={height} navigation={navigation}
                applyTheme={applyTheme} enabled={isDark ?? false} setDarkMode={setDarkMode}
                landscape={landscape ?? false} setIsLandscape={setIsLandscape}
                brightness={brightness} handleBrightnessChange={handleBrightnessChange}
                fontSize={fontSize} setFontSizeVal={setFontSizeVal}
                fonts={fonts} fontId={fontId} setFontFamilyId={setFontFamilyId}
                pageCount={pageCount} setCurrentPage={setCurrentPage}
              />
            </EsModel>
          </GestureHandlerRootView>
        </SafeAreaView>
      </View>
    );
  }

  // Legacy full-file mode: horizontal FlatList paging
  const renderPage = ({ item }: { item: string }) => (
    <View style={{ width, height: pageContentHeight, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        {!!item && (
          <RenderHtml
            contentWidth={width - 40}
            source={{ html: item }}
            tagsStyles={tagsStyles as any}
            baseStyle={{ color: textColor, fontSize, lineHeight: lineHeight, fontFamily }}
            systemFonts={SYSTEM_FONTS}
            enableExperimentalBRCollapsing
            enableExperimentalGhostLinesPrevention
          />
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: bg }]}>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.fullFlex}>
        <StatusBar backgroundColor={bg} barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />
        <GestureHandlerRootView style={[styles.fullFlex, { backgroundColor: bg }]}>
          <View style={[styles.header, { backgroundColor: bg, borderBottomColor: isDarkTheme ? '#333' : '#ddd' }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
              <Icon icon={IconKey.back} size={IconsSize.normal} className={{ color: textColor }} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>{title}</Text>
            <View style={styles.headerBtn} />
          </View>

          <FlatList
            ref={flatListRef}
            data={allPages}
            renderItem={renderPage}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            initialScrollIndex={currentPage}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            onMomentumScrollEnd={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentPage(idx);
            }}
          />

          <View style={[styles.footer, { backgroundColor: bg, borderTopColor: isDarkTheme ? '#333' : '#ddd' }]}>
            <Text style={[styles.pageNum, { color: textColor }]}>{currentPage + 1} / {pageCount || 1}</Text>
          </View>

          {dimOpacity > 0.02 && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: dimOpacity, zIndex: 10 }]} />}
          {warmOpacity > 0.02 && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#FF8C00', opacity: warmOpacity, zIndex: 11 }]} />}

          <GestureDetector gesture={dragGesture}>
            <Animated.View style={[styles.floatingBtn, isDarkTheme ? styles.floatingBtnDark : styles.floatingBtnLight, floatingBtnAnimStyle]}>
              <Icon icon={IconKey.setting} size={IconsSize.normal} className={{ color: isDarkTheme ? '#e1e1e1' : '#555' }} />
            </Animated.View>
          </GestureDetector>

          <EsModel ref={pageOptionsRef}>
            <PageOptionsModal
              modalRef={pageOptionsRef} winHeight={height} navigation={navigation}
              applyTheme={applyTheme} enabled={isDark ?? false} setDarkMode={setDarkMode}
              landscape={landscape ?? false} setIsLandscape={setIsLandscape}
              brightness={brightness} handleBrightnessChange={handleBrightnessChange}
              fontSize={fontSize} setFontSizeVal={setFontSizeVal}
              fonts={fonts} fontId={fontId} setFontFamilyId={setFontFamilyId}
              pageCount={pageCount}
              setCurrentPage={page => { flatListRef.current?.scrollToIndex({ index: page - 1, animated: true }); }}
            />
          </EsModel>
        </GestureHandlerRootView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullFlex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, height: 48, borderBottomWidth: 1,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '600' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { fontSize: 15, fontWeight: '500' },
  pageContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  footer: {
    height: 44, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', borderTopWidth: 1, gap: 16,
  },
  pageNum: { fontSize: 13 },
  navBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#7c3aed22',
  },
  navBtnDisabled: { backgroundColor: 'transparent' },
  navBtnText: { fontSize: 24, fontWeight: '700', color: '#7c3aed', lineHeight: 28 },
  navBtnTextDisabled: { color: '#ccc' },
  floatingBtn: {
    position: 'absolute',
    width: BUTTON_SIZE, height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, zIndex: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 5,
  },
  floatingBtnLight: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  floatingBtnDark:  { backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#444' },
});

export default NativeHtmlReader;
