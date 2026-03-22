import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, useWindowDimensions, StatusBar } from "react-native";
// Safe wrapper — null until native module is linked (rebuild required)
let Brightness: { getAppBrightness: () => Promise<number>; setAppBrightness: (level: number) => Promise<void> } | null = null;
try { const mod = require('react-native-brightness'); Brightness = mod.default || mod; } catch (_) {}
import { WebView } from "react-native-webview";
import RNFS from "react-native-fs";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientColor } from "../../res/color";
import { FlexContainer, FlexRowContainer } from "../../componet/atoms/container/FlexContainer";
import { Icon, IconKey, IconsSize } from "../../componet/atoms/icons";
import { EsModel } from "../../componet/atoms/container/ModalContainer";
import { IEsModelRefProps } from "../../componet/atoms/Types/IModal";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MainNav } from "../../nav/main.nav";
import { BookPlayerView } from "./BookPlayerView";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";
import { LineBreak } from "../../componet/atoms/container/CardContainer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReaderGuideModal } from "../../componet/atoms/modal/ReaderGuideModal";
import { PageOptionsModal, READING_THEMES } from "./PageOptionsModal";
import { useAtom } from "jotai";
import { darkModeAtom } from "../../features/jotai/model/darkMode";
import { fontSizeAtom, MIN_FONT_SIZE, MAX_FONT_SIZE, DEFAULT_FONT_SIZE } from "../../features/jotai/model/fontSize";
import { landscapeModeAtom } from "../../features/jotai/model/landscapeMode";
import { fontFamilyAtom, DEFAULT_FONT_FAMILY_ID } from "../../features/jotai/model/fontFamily";
// Safe wrapper — module is null until native linking (pod install / rebuild)
let Orientation: typeof import("react-native-orientation-locker").default | null = null;
try { Orientation = require("react-native-orientation-locker").default; } catch (_) {}

// ── Font Options ──────────────────────────────────────────────────────────────
type FontOption = {
  id: string;
  label: string;
  css: string;            // CSS font-family value used in WebView HTML
  googleFontUrl?: string; // Google Fonts stylesheet URL (loaded in <head> if set)
  nativeFont?: string;    // React Native fontFamily for preview button (system fonts only)
  preview: string;        // Short preview text shown on the button
};

const MYANMAR_FONTS: FontOption[] = [
  { id: 'default',      label: 'Default',      css: 'Pyidaungsu, "Noto Sans Myanmar", sans-serif',                                                                     preview: 'က', },
  { id: 'pyidaungsu',   label: 'Pyidaungsu',   css: 'Pyidaungsu, sans-serif',                      nativeFont: 'Pyidaungsu',                                            preview: 'က', },
  { id: 'myanmar3',     label: 'Myanmar3',     css: 'Myanmar3, Pyidaungsu, sans-serif',             nativeFont: 'Myanmar3',                                              preview: 'က', },
  { id: 'noto-myanmar', label: 'Noto Sans',    css: '"Noto Sans Myanmar", Pyidaungsu, sans-serif',  googleFontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;700&display=swap', preview: 'က', },
  { id: 'padauk',       label: 'Padauk',       css: 'Padauk, Pyidaungsu, sans-serif',               googleFontUrl: 'https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap',           preview: 'က', },
];

const ENGLISH_FONTS: FontOption[] = [
  { id: 'default',      label: 'Default',      css: '-apple-system, Roboto, sans-serif',                                                                                preview: 'Aa', },
  { id: 'georgia',      label: 'Georgia',      css: 'Georgia, serif',                               nativeFont: 'Georgia',                                               preview: 'Aa', },
  { id: 'palatino',     label: 'Palatino',     css: '"Palatino Linotype", Palatino, serif',         nativeFont: 'Palatino',                                              preview: 'Aa', },
  { id: 'times',        label: 'Times New',    css: '"Times New Roman", Times, serif',              nativeFont: 'Times New Roman',                                       preview: 'Aa', },
  { id: 'merriweather', label: 'Merriweather', css: 'Merriweather, Georgia, serif',                 googleFontUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap', preview: 'Aa', },
  { id: 'lato',         label: 'Lato',         css: 'Lato, Roboto, sans-serif',                     googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700&display=swap',  preview: 'Aa', },
];

function getFontList(language?: string): FontOption[] {
  const lang = language?.toLowerCase() ?? '';
  return lang.includes('myanmar') || lang.includes('burmese') || lang === 'mm' || lang === 'my'
    ? MYANMAR_FONTS
    : ENGLISH_FONTS;
}
// ──────────────────────────────────────────────────────────────────────────────

// Pre-compiled regexes — avoids recompiling on every page build
const RX_NEXT    = /--next--/g;
const RX_3REM    = /font-size\s*:\s*3rem/gi;
const RX_275REM  = /font-size\s*:\s*2\.75rem/gi;
const RX_25REM   = /font-size\s*:\s*2\.5rem/gi;

// Build the HTML for a single page from its raw paragraph content.
// This keeps only ONE page's HTML in memory at a time instead of all pages.
function buildPageHtml(content: string, title: string, pageIndex: number, totalPages: number, darkMode: boolean, fontSize: number, fontCss: string, googleFontUrl?: string): string {
  let htmlText = content;
  htmlText = htmlText.replace(RX_NEXT, "<br/>");
  // Normalize inline rem sizes so they scale with our font-size setting
  htmlText = htmlText.replace(RX_3REM,   `font-size: ${fontSize + 3}px`);
  htmlText = htmlText.replace(RX_275REM, `font-size: ${fontSize + 1}px`);
  htmlText = htmlText.replace(RX_25REM,  `font-size: ${fontSize}px`);

  // Strip inline color / font-family / background from style attributes so
  // dark-mode and light-mode theme colours are never overridden by book HTML.
  const stripInlineStyles = (raw: string) =>
    raw
      .replace(/\bbackground(-color)?\s*:[^;]+;?\s*/gi, '')
      .replace(/\bcolor\s*:[^;]+;?\s*/gi, '')
      .replace(/\bfont-family\s*:[^;]+;?\s*/gi, '')
      .trim();

  htmlText = htmlText.replace(/style\s*=\s*"([^"]*)"/gi, (_, s) => {
    const cleaned = stripInlineStyles(s);
    return cleaned ? `style="${cleaned}"` : '';
  });
  htmlText = htmlText.replace(/style\s*=\s*'([^']*)'/gi, (_, s) => {
    const cleaned = stripInlineStyles(s);
    return cleaned ? `style='${cleaned}'` : '';
  });
  // Remove leftover <font> tags that carry color/face attributes
  htmlText = htmlText.replace(/<font[^>]*>/gi, '').replace(/<\/font>/gi, '');

  const bg        = darkMode ? '#121212' : '#fcf7ea';
  const textColor = darkMode ? '#e1e1e1' : '#2c2c2c';
  const headerColor = darkMode ? '#aaa' : '#999';
  const h1Color   = darkMode ? '#f0f0f0' : '#1a1a1a';
  const bqBorder  = darkMode ? '#555'    : '#c8b99a';
  const bqBg      = darkMode ? '#1e1e1e' : '#f3ede0';
  const bqColor   = darkMode ? '#ddd'    : '#555';

  return `<html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      ${googleFontUrl ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="${googleFontUrl}">` : ''}
      <style>
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        /* Force all inline colors/backgrounds to use theme — !important overrides any inline style attribute */
        * { color: ${textColor} !important; background-color: transparent !important; font-family: inherit !important; }
        body {
          font-family: ${fontCss};
          font-size: ${fontSize}px;
          line-height: 1.85;
          color: ${textColor} !important;
          margin: 0;
          padding: 16px 8px 80px 8px;
          background-color: ${bg} !important;
          word-break: break-word;
          text-align: justify;
          -webkit-hyphens: auto;
          hyphens: auto;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          margin-bottom: 20px;
          border-bottom: 1px solid ${darkMode ? '#333' : '#d0c9b5'};
          font-size: 14px;
          color: ${headerColor} !important;
        }
        .page-header .book-title {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-style: italic;
          margin-right: 12px;
          font-weight: 700;
        }
        .page-header .page-num { font-weight: 700; white-space: nowrap; }
        p { margin: 0 0 16px 0; text-align: justify; }
        h1 { font-size: 20px; font-weight: 700; color: ${h1Color} !important; margin: 20px 0 10px 0; line-height: 1.4; text-align: center; }
        h2 { font-size: 18px; font-weight: 700; color: ${darkMode ? '#e0e0e0' : '#222'} !important; margin: 18px 0 10px 0; line-height: 1.4; text-align: center; }
        h3 { font-size: 17px; font-weight: 700; color: ${darkMode ? '#d0d0d0' : '#333'} !important; margin: 16px 0 8px 0; line-height: 1.4; text-align: center; }
        h4 { font-size: 16px; font-weight: 600; color: ${darkMode ? '#c0c0c0' : '#444'} !important; margin: 14px 0 6px 0; line-height: 1.4; }
        h5 { font-size: 15px; font-weight: 600; color: ${darkMode ? '#aaa' : '#555'} !important; margin: 12px 0 6px 0; line-height: 1.4; }
        h6 { font-size: 14px; font-weight: 600; color: ${darkMode ? '#999' : '#666'} !important; margin: 10px 0 4px 0; line-height: 1.4; font-style: italic; }
        blockquote {
          margin: 16px 0; padding: 12px 16px;
          border-left: 4px solid ${bqBorder};
          background-color: ${bqBg} !important;
          color: ${bqColor} !important;
          font-style: italic;
          border-radius: 0 8px 8px 0;
        }
        pre {
          background-color: #2b3440; color: #f0f0f0;
          padding: 16px; border-radius: 10px;
          font-family: "Courier New", Courier, monospace;
          font-size: 14px; margin: 16px 0;
          white-space: pre-wrap; word-wrap: break-word;
        }
        img { max-width: 100%; height: auto; margin: 16px 0; border-radius: 10px; display: block; }
        bi { font-weight: bold; font-style: italic; }
        bic { display: block; font-weight: bold; font-style: italic; text-align: center; }
        c { display: block; text-align: center; }
        .txt-center { text-align: center; }
        .full-width { width: 100%; }
      </style>
    </head>
    <body>
      <div class="page-header">
        <span class="book-title">${title}</span>
        <span class="page-num">${pageIndex + 1} / ${totalPages}</span>
      </div>
      ${htmlText}
    </body>
  </html>`;
}

const BUTTON_SIZE = 44;
const BTN_MARGIN = 30; // Increased margin to prevent button from "hiding" in corners

const ReaderFlatListWebView = ({path, title, language, localPageDir, knownTotalPages}: {path: string; title: string; language?: string; localPageDir?: string; knownTotalPages?: number}) => {
  // Per-page mode: pages loaded on demand from localPageDir (new downloads)
  // Full-file mode: entire file loaded into paragraphs array (legacy downloads)
  const isPerPageMode = !!localPageDir;

  // Legacy full-file mode state
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  // Per-page mode state
  const [currentPageContent, setCurrentPageContent] = useState('');
  const [totalPageCount, setTotalPageCount] = useState(knownTotalPages ?? 0);
  const pageCache = useRef<Map<number, string>>(new Map());
  const prefetching = useRef<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [isPageRestored, setIsPageRestored] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  // Reactive dimensions — updates automatically on orientation change
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  // Safe area insets — non-zero in landscape (notch on left/right) and at bottom
  const insets = useSafeAreaInsets();

  // Persistent dark mode — survives app restarts and navigation
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const enabled = darkMode ?? false;

  // Persistent font size
  const [fontSizeVal, setFontSizeVal] = useAtom(fontSizeAtom);
  const fontSize = fontSizeVal ?? DEFAULT_FONT_SIZE;

  // Persistent landscape mode
  const [isLandscape, setIsLandscape] = useAtom(landscapeModeAtom);
  const landscape = isLandscape ?? false;

  // Persistent font family (per-app, remembers last chosen font)
  const [fontFamilyId, setFontFamilyId] = useAtom(fontFamilyAtom);
  const fontId = fontFamilyId ?? DEFAULT_FONT_FAMILY_ID;
  const fonts = getFontList(language);
  const currentFont = fonts.find(f => f.id === fontId) ?? fonts[0];

  const applyTheme = useCallback((theme: typeof READING_THEMES[number]) => {
    setDarkMode(theme.dark);
    setFontSizeVal(theme.fontSize);
    setBrightnessState(theme.brightness);
    Brightness?.setAppBrightness(theme.brightness).catch(() => {});
  }, [setDarkMode, setFontSizeVal]);

  // Hardware brightness (0.05–1.0)
  const [brightness, setBrightnessState] = useState(0.5);

  useEffect(() => {
    Brightness?.getAppBrightness()
      .then(level => { if (level > 0) setBrightnessState(level); })
      .catch(() => {});
  }, []);

  // Combined eye care: one value (0.1–1.0) controls both brightness + warmth
  // dim overlay: fully transparent at 1.0, dark at 0.1
  const dimOpacity   = (1 - brightness) * 0.85;
  // warm overlay: no tint at 1.0, strong amber at 0.1
  const warmOpacity  = (1 - brightness) * 0.38;

  const handleBrightnessChange = useCallback((val: number) => {
    setBrightnessState(val);
    Brightness?.setAppBrightness(val).catch(() => {});
  }, []);

  // useRef (not createRef) — createRef makes a new object every render,
  // breaking the modal open/close ref entirely.
  const htmlModelRef = useRef<IEsModelRefProps>(null);
  const webViewRef = useRef<InstanceType<typeof WebView>>(null);
  const navigation = useNavigation();

  // Debounce timer ref — prevents hammering AsyncStorage on rapid page flips
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inject font change into running WebView without a full remount
  useEffect(() => {
    if (!webViewRef.current) return;
    const escaped = currentFont.css.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    webViewRef.current.injectJavaScript(`document.body.style.fontFamily='${escaped}';true;`);
  }, [fontId]);

  // ── Draggable floating button ──────────────────────────────────────────
  // The button lives inside GestureHandlerRootView which is inside SafeAreaView
  // (edges left/right/bottom). Its coordinate space width is therefore:
  //   containerWidth = winWidth - insets.left - insets.right
  // Using winWidth directly was the bug — the button went ~insets.left px off-screen.
  const isLandscapeNow = winWidth > winHeight;
  const activeMargin = isLandscapeNow ? BTN_MARGIN * 1.5 : BTN_MARGIN;

  const containerWidth  = winWidth  - insets.left - insets.right;
  const containerHeight = winHeight - insets.bottom; // SafeAreaView edges only bottom for height

  // Horizontal snap targets
  const snapLeftX = activeMargin;
  const snapRightX = containerWidth - BUTTON_SIZE - activeMargin;

  const btnMinY  = insets.top + activeMargin;
  const btnMaxY  = containerHeight - BUTTON_SIZE - activeMargin;

  // sidePreference: 0 for left, 1 for right. Default to right (1).
  const sidePreference = useSharedValue(1); 
  const btnX = useSharedValue(snapRightX);
  const btnY = useSharedValue(containerHeight * 0.5);
  const btnContext = useSharedValue({ x: 0, y: 0 });

  // Re-clamp when orientation flips or safe-area insets change
  useEffect(() => {
    const targetX = sidePreference.value === 0 ? snapLeftX : snapRightX;
    btnX.value = withSpring(targetX);
    btnY.value = withSpring(Math.max(btnMinY, Math.min(btnY.value, btnMaxY)));
  }, [snapLeftX, snapRightX, btnMinY, btnMaxY, sidePreference]);

  const openSettingsModal = useCallback(() => {
    htmlModelRef.current?.open();
  }, []);

  // Tap gesture — opens modal
  const tapGesture = Gesture.Tap()
    .onEnd(() => { runOnJS(openSettingsModal)(); });

  // Pan gesture — drag freely, snaps to NEAREST horizontal edge on release
  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      btnContext.value = { x: btnX.value, y: btnY.value };
    })
    .onUpdate((e) => {
      btnX.value = btnContext.value.x + e.translationX;
      btnY.value = btnContext.value.y + e.translationY;
    })
    .onEnd(() => {
      // Snap to the nearest edge
      const snapToLeft = btnX.value < containerWidth / 2;
      sidePreference.value = snapToLeft ? 0 : 1;
      
      const targetX = snapToLeft ? snapLeftX : snapRightX;
      btnX.value = withSpring(targetX);

      // Clamp Y within safe vertical bounds
      btnY.value = withSpring(Math.max(btnMinY, Math.min(btnMaxY, btnY.value)));
    });

  // Race: whichever gesture activates first wins.
  // Tap fires on quick press; Pan fires once movement exceeds minDistance.
  const dragGesture = Gesture.Race(tapGesture, panGesture);

  const floatingBtnAnimStyle = useAnimatedStyle(() => ({
    left: btnX.value,
    top: btnY.value,
  }));
  // ──────────────────────────────────────────────────────────────────────

  // ── Status bar: re-apply on focus AND on theme change ────────────────
  // useFocusEffect re-runs whenever this screen gains focus (e.g. returning
  // from the options modal or page-jump input), preventing other screens
  // from leaving a white status bar behind.
  const applyStatusBar = useCallback(() => {
    StatusBar.setHidden(false);
    StatusBar.setBackgroundColor('#000000', false);
    StatusBar.setBarStyle('light-content', false);
  }, []);

  useFocusEffect(applyStatusBar);

  useEffect(() => {
    applyStatusBar();
  }, [applyStatusBar]);

  // ── Paint the React Navigation screen card to match the theme ────────────
  // The navigator's card/container sits behind our component; if it stays white
  // it bleeds through at rounded display corners. setOptions paints it dark/light.
  useEffect(() => {
    const bg = enabled ? '#121212' : '#fcf7ea';
    navigation.setOptions({
      contentStyle: { backgroundColor: bg },
      cardStyle:    { backgroundColor: bg }, // Stack v6 compat
    });
  }, [enabled, navigation]);
  // ──────────────────────────────────────────────────────────────────────

  // ── Orientation locking ───────────────────────────────────────────────
  useEffect(() => {
    if (!Orientation) return; // native module not yet linked — skip safely
    if (landscape) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
    return () => Orientation?.lockToPortrait();
  }, [landscape]);
  // ──────────────────────────────────────────────────────────────────────

  // Step 1: Restore last read page first (before file loads)
  useEffect(() => {
    AsyncStorage.getItem(`@last_page_${title}`)
      .then((savedPage) => {
        if (savedPage !== null) {
          setCurrentPage(parseInt(savedPage));
        } else {
          setShowGuide(true);
        }
      })
      .catch((e) => console.error("Failed to load page", e))
      .finally(() => setIsPageRestored(true));
  }, [title]);

  // Step 2: Debounced page save — waits 400ms of inactivity before writing.
  // Avoids dozens of AsyncStorage writes when flipping pages quickly.
  useEffect(() => {
    if (!isPageRestored) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(`@last_page_${title}`, currentPage.toString()).catch((e) =>
        console.error("Failed to save page", e)
      );
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [currentPage, isPageRestored, title]);

  // ── Per-page mode helpers ─────────────────────────────────────────────
  const prefetchPage = useCallback((idx: number) => {
    if (!localPageDir) return;
    if (idx < 0 || idx >= totalPageCount) return;
    if (pageCache.current.has(idx) || prefetching.current.has(idx)) return;
    prefetching.current.add(idx);
    RNFS.readFile(`${localPageDir}/page_${idx}.txt`, 'utf8')
      .then((content) => {
        pageCache.current.set(idx, content);
        // Keep cache lean: evict pages far from recently loaded
        for (const key of pageCache.current.keys()) {
          if (Math.abs(key - idx) > 5) pageCache.current.delete(key);
        }
      })
      .catch(() => {})
      .finally(() => prefetching.current.delete(idx));
  }, [localPageDir, totalPageCount]);

  // Step 3a: Per-page mode — load current page, preload neighbors
  useEffect(() => {
    if (!isPerPageMode || !localPageDir) return;
    const load = async () => {
      setIsFileLoading(true);
      try {
        // Read meta if totalPageCount not yet known
        if (totalPageCount === 0) {
          const meta = JSON.parse(await RNFS.readFile(`${localPageDir}/meta.json`, 'utf8'));
          setTotalPageCount(meta.totalPages);
        }
        // Serve from cache or disk
        let content = pageCache.current.get(currentPage);
        if (!content) {
          content = await RNFS.readFile(`${localPageDir}/page_${currentPage}.txt`, 'utf8');
          pageCache.current.set(currentPage, content);
        }
        setCurrentPageContent(content);
        // Preload neighbors
        prefetchPage(currentPage + 1);
        prefetchPage(currentPage + 2);
        prefetchPage(currentPage - 1);
      } catch (err) {
        console.error('Per-page load failed:', err);
      } finally {
        setIsFileLoading(false);
      }
    };
    load();
  }, [isPerPageMode, localPageDir, currentPage, totalPageCount, prefetchPage]);

  // Step 3b: Legacy full-file mode — runs once per path
  useEffect(() => {
    if (isPerPageMode) return;
    setIsFileLoading(true);
    RNFS.readFile(path, "utf8")
      .then((content) => {
        const parsed = content
          .split("---")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);
        setParagraphs(parsed);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsFileLoading(false));
  }, [path, isPerPageMode]);

  // Unified page count and content for downstream logic
  const pageCount = isPerPageMode ? totalPageCount : paragraphs.length;
  const pageContent = isPerPageMode ? currentPageContent : (paragraphs[currentPage] ?? '');

  // Build HTML for ONLY the current page — O(1) memory.
  const currentPageHtml = useMemo(() => {
    if (pageCount === 0 || !pageContent) return '';
    return buildPageHtml(
      pageContent,
      title,
      currentPage,
      pageCount,
      enabled,
      fontSize,
      currentFont.css,
      currentFont.googleFontUrl,
    );
  }, [pageContent, pageCount, currentPage, title, enabled, fontSize, currentFont]);

  // useCallback — stable reference so child components never re-render from this
  const sendCommand = useCallback((prompt: "next" | "previous") => {
    if (pageCount <= 1) return;
    if (prompt === "next") setCurrentPage((c) => Math.min(c + 1, pageCount - 1));
    else setCurrentPage((c) => Math.max(c - 1, 0));
  }, [pageCount]);

  // useMemo — rebuilt only when page count changes, not on every render
  const INJECTED_JAVASCRIPT = useMemo(() => `
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';

    if (!window.__swipeListenersAdded) {
      window.__swipeListenersAdded = true;
      var touchStartX = 0;
      var touchStartY = 0;

      document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      document.addEventListener('touchend', function(e) {
        var totalPages = window.__totalPages || 1;
        if (totalPages <= 1) return;
        var touchEndX = e.changedTouches[0].clientX;
        var touchEndY = e.changedTouches[0].clientY;
        var diffX = Math.abs(touchEndX - touchStartX);
        var diffY = Math.abs(touchEndY - touchStartY);
        if (diffX < 10 && diffY < 10) {
          if (touchStartX < window.innerWidth / 2) {
            window.ReactNativeWebView.postMessage('previous');
          } else {
            window.ReactNativeWebView.postMessage('next');
          }
        }
      }, { passive: true });
    }
    window.__totalPages = ${pageCount};
    true;
  `, [pageCount]);

  const themeBg = enabled ? '#121212' : '#fcf7ea';

  // Memoize font-size dot bar — avoids Array.from allocation on every render
  const fontSizeDots = useMemo(() =>
    Array.from({ length: MAX_FONT_SIZE - MIN_FONT_SIZE + 1 }, (_, i) => (
      <View key={i} style={[styles.volumeDot, i < fontSize - MIN_FONT_SIZE ? styles.volumeDotFilled : styles.volumeDotEmpty]} />
    )),
    [fontSize]
  );

  // Show loading screen while the file is being read from disk
  if (isFileLoading) {
    return (
      // absoluteFill View sits behind SafeAreaView and covers every pixel —
      // including the rounded display corners — so no white bleeds through.
      <View style={[StyleSheet.absoluteFill, { backgroundColor: themeBg }]}>
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.fullFlex}>
          <StatusBar backgroundColor="#000000" barStyle="light-content" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={GradientColor[2]} />
            <Text style={[styles.loadingText, { color: enabled ? '#aaa' : '#888' }]}>
              Loading book...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    // absoluteFill covers the entire screen (incl. rounded corners & notch area).
    // SafeAreaView inside handles bottom/side insets only.
    <View style={[StyleSheet.absoluteFill, { backgroundColor: themeBg }]}>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.fullFlex}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      <GestureHandlerRootView style={[styles.gestureRoot, { backgroundColor: themeBg }]}>
        <BookPlayerView
          title={title}
          navigate={() => navigation.navigate(MainNav.HOME as never)}
          sendCommand={sendCommand}
          currentPage={currentPage}
          pages={isPerPageMode ? Array(pageCount).fill('') : paragraphs}
          htmlModelRef={htmlModelRef}
        >
          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: currentPageHtml }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            scalesPageToFit={false}
            androidLayerType="hardware"
            cacheEnabled={false}
            renderLoading={() => <></>}
            injectedJavaScript={INJECTED_JAVASCRIPT}
            onMessage={(event) => {
              const msg = event.nativeEvent.data;
              if (msg === 'next') sendCommand('next');
              else if (msg === 'previous') sendCommand('previous');
            }}
          />
        </BookPlayerView>

        {/* Eye care overlays — dim + warm tint, both driven by one brightness value */}
        {dimOpacity > 0.02 && (
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: dimOpacity, zIndex: 10 }]} />
        )}
        {warmOpacity > 0.02 && (
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#FF8C00', opacity: warmOpacity, zIndex: 11 }]} />
        )}

        {/* Draggable floating settings button — drag anywhere, tap to open options */}
        <GestureDetector gesture={dragGesture}>
          <Animated.View
            style={[
              styles.floatingBtn,
              enabled ? styles.floatingBtnDark : styles.floatingBtnLight,
              floatingBtnAnimStyle,
            ]}
          >
            <Icon icon={IconKey.setting} size={IconsSize.normal} className={{ color: enabled ? '#e1e1e1' : '#555' }} />
          </Animated.View>
        </GestureDetector>

        <ReaderGuideModal
          visible={showGuide}
          onClose={() => setShowGuide(false)}
        />

        <PageOptionsModal
          modalRef={htmlModelRef}
          winHeight={winHeight}
          navigation={navigation}
          applyTheme={applyTheme}
          enabled={enabled}
          setDarkMode={setDarkMode}
          landscape={landscape}
          setIsLandscape={setIsLandscape}
          brightness={brightness}
          handleBrightnessChange={handleBrightnessChange}
          fontSize={fontSize}
          setFontSizeVal={setFontSizeVal}
          fonts={fonts}
          fontId={fontId}
          setFontFamilyId={setFontFamilyId}
          pageCount={pageCount}
          setCurrentPage={setCurrentPage}
        />
      </GestureHandlerRootView>
      </SafeAreaView>
    </View>
  );
};

// Landscape modal styles
const lsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  dividerV: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#e0e0e0',
    marginVertical: 2,
  },
  // Page search
  searchBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    height: 34,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  searchBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: GradientColor[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Font size
  fontSizeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1.3,
    justifyContent: 'center',
  },
  fontSizeLabelSm: { fontSize: 11, color: '#555', fontWeight: '600' },
  fontSizeLabelLg: { fontSize: 17, color: '#555', fontWeight: '600' },
  fsBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: GradientColor[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fsBtnDisabled: { backgroundColor: '#ccc' },
  fsBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', lineHeight: 18 },
  fsValue: { fontSize: 13, fontWeight: '700', color: GradientColor[2], minWidth: 22, textAlign: 'center' },
  // Toggles
  togglesBlock: {
    flex: 1.2,
    gap: 4,
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: { fontSize: 12, color: '#444', fontWeight: '500' },
  switch: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
  // Font picker
  fontRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  fontLabel: { fontSize: 12, color: '#888', fontWeight: '600' },
  fontScroll: { gap: 6, paddingVertical: 2 },
  fontBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f2f2f2',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  fontBtnSelected: { backgroundColor: GradientColor[2] + '18', borderColor: GradientColor[2] },
  fontBtnText: { fontSize: 13, color: '#555' },
  fontBtnTextSelected: { color: GradientColor[2], fontWeight: '700' },
  // Brightness (landscape)
  brightnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 6,
  },
  brightnessDotsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  brightnessIcon: { fontSize: 13 },
});

const modalStyle = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  container: {
    borderRadius: 10,
    backgroundColor: "white",
  },
  gotopageCOntainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
});

const styles = StyleSheet.create({
  // fullFlex: used on SafeAreaView inside the absoluteFill wrapper.
  // No background needed — the wrapper View behind it covers all corners.
  fullFlex: { flex: 1 },
  gestureRoot: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 15, fontWeight: '500' },
  floatingBtn: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  floatingBtnLight: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  floatingBtnDark:  { backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#444' },
  // flex: 1 fills its parent container automatically.
  // Avoids overflow caused by SafeAreaView insets vs fixed winWidth/winHeight.
  // Also adapts on orientation change without needing useWindowDimensions.
  webview: { flex: 1 },
  modalPadPortrait:  { padding: 12, paddingBottom: 16 },
  modalPadLandscape: { padding: 12, paddingBottom: 16 },
  dragHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#ddd', alignSelf: 'center', marginBottom: 6 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#222' },

  // Theme scroll
  themeScrollView: { marginBottom: 2 },
  themeScrollContent: { gap: 8, paddingHorizontal: 2, alignItems: 'center' },
  themeMockLine: { height: 3, borderRadius: 2, marginBottom: 3 },
  themeActiveDot: { width: 6, height: 6, borderRadius: 3, marginTop: 3 },

  // Flat option rows
  optRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 36 },
  optLabel: { fontSize: 15, fontWeight: '500', color: '#333' },
  optDivider: { height: 1, backgroundColor: '#f0f0f0' },

  // Font size counter
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counterBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: GradientColor[2], alignItems: 'center', justifyContent: 'center' },
  counterBtnDisabled: { backgroundColor: '#ddd' },
  counterBtnText: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 20 },
  counterValue: { fontSize: 17, fontWeight: '700', color: '#333', minWidth: 26, textAlign: 'center' },

  // Font chips
  fontChipScroll: { marginVertical: 2 },
  fontChipRow: { gap: 8, alignItems: 'center', paddingHorizontal: 2 },
  fontChip: { alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#efefef', gap: 2, minWidth: 58 },
  fontChipSelected: { backgroundColor: GradientColor[2] },
  fontChipPreview: { fontSize: 16, color: '#444' },
  fontChipLabel: { fontSize: 9, color: '#666', fontWeight: '600', textAlign: 'center' },

  // Brightness
  brightnessPercent: { fontSize: 13, fontWeight: '600', color: '#aaa' },
  brightnessDotHit: { padding: 5 },
  brightnessDot: { width: 8, height: 8, borderRadius: 4 },
  brightnessDotFilled: { backgroundColor: GradientColor[2] },
  brightnessDotEmpty: { backgroundColor: '#ddd' },

  // Nav row
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  themeCard: {
    width: 72,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  themeCardActive: { borderColor: GradientColor[1] },
  themeCardLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center', marginTop: 3 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { fontSize: 16, color: '#555', fontWeight: '700', lineHeight: 18 },
  // 2-column grid for landscape
  twoColRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  twoColCell: { flex: 1 },
  twoColDivider: { width: 1, height: '80%', backgroundColor: '#e0e0e0', marginHorizontal: 8 },
  rowCenter: { alignItems: 'center' },
  goToInput: {
    width: "80%",
    height: 40,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: GradientColor[2],
    marginRight: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  goToButton: { backgroundColor: GradientColor[2], padding: 10, borderRadius: 20 },
  rowSpaceBetween: { justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  modalTextPrimary: { fontSize: 16, fontWeight: "400", color: "#333" },

  // Font size volume bar
  volumeBarRow: { flex: 1, alignItems: 'center', marginHorizontal: 8 },
  volumeDotsRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
  volumeDot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 1.5 },
  volumeDotFilled: { backgroundColor: GradientColor[2] },
  volumeDotEmpty: { backgroundColor: '#ddd' },
  volumeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: GradientColor[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeBtnDisabled: { backgroundColor: '#ccc' },
  volumeBtnText: { color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 22 },
  fontSizeLabel: { fontWeight: '700', color: '#555', minWidth: 20, textAlign: 'center' },

  // Font picker
  fontPickerSection: { marginVertical: 6 },
  fontPickerLabel: { fontSize: 13, fontWeight: '600', color: '#888', marginBottom: 8 },
  fontPickerRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  fontBtn: {
    width: 72,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    alignItems: 'center',
    gap: 4,
  },
  fontBtnSelected: {
    borderColor: GradientColor[2],
    backgroundColor: '#f0f8ff',
  },
  fontBtnPreview: {
    fontSize: 18,
    color: '#444',
  },
  fontBtnPreviewSelected: {
    color: GradientColor[2],
  },
  fontBtnLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  fontBtnLabelSelected: {
    color: GradientColor[2],
  },

  // Toggle cards (Dark + Landscape side by side)
  toggleCardRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  toggleCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
    gap: 4,
  },
  toggleCardActive: { borderColor: GradientColor[2], backgroundColor: GradientColor[2] + '12' },
  toggleCardIcon: { fontSize: 18 },
  toggleCardLabel: { fontSize: 12, fontWeight: '600', color: '#555' },
  toggleCardLabelActive: { color: GradientColor[2] },
  toggleCardSwitch: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },

  // Bottom action row
  bottomActionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  goToPageCompact: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  goToInputCompact: {
    flex: 1,
    height: 40,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: GradientColor[2],
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GradientColor[2],
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  homeBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Brightness
  brightnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  brightnessDotsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  brightnessIcon: { fontSize: 16, marginHorizontal: 6 },
});

export default ReaderFlatListWebView;
