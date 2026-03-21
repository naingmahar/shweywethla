import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Pressable, Switch, TextInput, ScrollView, useWindowDimensions, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import RNFS from "react-native-fs";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientColor } from "../../res/color";
import { FlexContainer, FlexRowContainer } from "../../componet/atoms/container/FlexContainer";
import { Icon, IconKey, IconsSize } from "../../componet/atoms/icons";
import { EsModel } from "../../componet/atoms/container/ModalContainer";
import { IEsModelRefProps } from "../../componet/atoms/Types/IModal";
import { useNavigation } from "@react-navigation/native";
import { MainNav } from "../../nav/main.nav";
import { BookPlayerView } from "./BookPlayerView";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from "react-native-reanimated";
import { LineBreak } from "../../componet/atoms/container/CardContainer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReaderGuideModal } from "../../componet/atoms/modal/ReaderGuideModal";
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

// Build the HTML for a single page from its raw paragraph content.
// This keeps only ONE page's HTML in memory at a time instead of all pages.
function buildPageHtml(content: string, title: string, pageIndex: number, totalPages: number, darkMode: boolean, fontSize: number, fontCss: string, googleFontUrl?: string): string {
  let htmlText = content;
  htmlText = htmlText.replace(/--next--/g, "<br/>");
  // Normalize inline rem sizes so they scale with our font-size setting
  htmlText = htmlText.replace(/font-size\s*:\s*3rem/gi,    `font-size: ${fontSize + 3}px`);
  htmlText = htmlText.replace(/font-size\s*:\s*2\.75rem/gi, `font-size: ${fontSize + 1}px`);
  htmlText = htmlText.replace(/font-size\s*:\s*2\.5rem/gi,  `font-size: ${fontSize}px`);

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
        body {
          font-family: ${fontCss};
          font-size: ${fontSize}px;
          line-height: 1.85;
          color: ${textColor};
          margin: 0;
          padding: 16px 8px 80px 8px;
          background-color: ${bg};
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
          color: ${headerColor};
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
        h1 { font-size: 20px; font-weight: 700; color: ${h1Color}; margin: 20px 0 10px 0; line-height: 1.4; text-align: center; }
        h2 { font-size: 18px; font-weight: 700; color: ${darkMode ? '#e0e0e0' : '#222'}; margin: 18px 0 10px 0; line-height: 1.4; text-align: center; }
        h3 { font-size: 17px; font-weight: 700; color: ${darkMode ? '#d0d0d0' : '#333'}; margin: 16px 0 8px 0; line-height: 1.4; text-align: center; }
        h4 { font-size: 16px; font-weight: 600; color: ${darkMode ? '#c0c0c0' : '#444'}; margin: 14px 0 6px 0; line-height: 1.4; }
        h5 { font-size: 15px; font-weight: 600; color: ${darkMode ? '#aaa' : '#555'}; margin: 12px 0 6px 0; line-height: 1.4; }
        h6 { font-size: 14px; font-weight: 600; color: ${darkMode ? '#999' : '#666'}; margin: 10px 0 4px 0; line-height: 1.4; font-style: italic; }
        blockquote {
          margin: 16px 0; padding: 12px 16px;
          border-left: 4px solid ${bqBorder};
          background-color: ${bqBg};
          color: ${bqColor};
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

const ReaderFlatListWebView = ({path, title, language}: {path: string; title: string; language?: string}) => {
  // Raw paragraphs only — no HTML wrapping stored in state.
  // For a 500-page / 10MB book this stores ~10MB of plain strings.
  // Only the current page's HTML is ever built (via useMemo below).
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [goToPage, setGoToPage] = useState(0);
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

  // useRef (not createRef) — createRef makes a new object every render,
  // breaking the modal open/close ref entirely.
  const htmlModelRef = useRef<IEsModelRefProps>(null);
  const navigation = useNavigation();

  // Debounce timer ref — prevents hammering AsyncStorage on rapid page flips
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // ── Status bar: themed color, always visible ──────────────────────────
  // Android: setBackgroundColor + setBarStyle update imperatively when theme changes.
  // JSX <StatusBar> reinforces the same on every render.
  useEffect(() => {
    StatusBar.setBackgroundColor(enabled ? '#121212' : '#fcf7ea', true);
    StatusBar.setBarStyle(enabled ? 'light-content' : 'dark-content', true);
  }, [enabled]);

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

  // Step 3: Load file — runs once per path. No dark mode / fontSize dependency
  // so theme/font changes never trigger a re-read of the 10MB file.
  useEffect(() => {
    setIsFileLoading(true);
    RNFS.readFile(path, "utf8")
      .then((content) => {
        // Chain immediately so `content` string is not kept alive in a closure
        const parsed = content
          .split("---")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);
        setParagraphs(parsed);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsFileLoading(false));
  }, [path]);

  // Build HTML for ONLY the current page — O(1) memory instead of O(n pages).
  // Recomputes in <1ms on page/theme/font changes; no file re-read ever.
  const currentPageHtml = useMemo(() => {
    if (paragraphs.length === 0) return '';
    return buildPageHtml(
      paragraphs[currentPage] ?? '',
      title,
      currentPage,
      paragraphs.length,
      enabled,
      fontSize,
      currentFont.css,
      currentFont.googleFontUrl,
    );
  }, [paragraphs, currentPage, title, enabled, fontSize, currentFont]);

  // useCallback — stable reference so child components never re-render from this
  const sendCommand = useCallback((prompt: "next" | "previous") => {
    if (paragraphs.length <= 1) return;
    if (prompt === "next") setCurrentPage((c) => Math.min(c + 1, paragraphs.length - 1));
    else setCurrentPage((c) => Math.max(c - 1, 0));
  }, [paragraphs.length]);

  // useMemo — rebuilt only when page count changes, not on every render
  const INJECTED_JAVASCRIPT = useMemo(() => `
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';

    var totalPages = ${paragraphs.length};
    var touchStartX = 0;
    var touchStartY = 0;

    document.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
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
    true;
  `, [paragraphs.length]);

  const themeBg = enabled ? '#121212' : '#fcf7ea';

  // Show loading screen while the file is being read from disk
  if (isFileLoading) {
    return (
      // absoluteFill View sits behind SafeAreaView and covers every pixel —
      // including the rounded display corners — so no white bleeds through.
      <View style={[StyleSheet.absoluteFill, { backgroundColor: themeBg }]}>
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.fullFlex}>
          <StatusBar backgroundColor={themeBg} barStyle={enabled ? 'light-content' : 'dark-content'} />
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
      <StatusBar backgroundColor={themeBg} barStyle={enabled ? 'light-content' : 'dark-content'} />
      <GestureHandlerRootView style={[styles.gestureRoot, { backgroundColor: themeBg }]}>
        <BookPlayerView
          title={title}
          navigate={() => navigation.navigate(MainNav.HOME as never)}
          sendCommand={sendCommand}
          currentPage={currentPage}
          pages={paragraphs}
          htmlModelRef={htmlModelRef}
        >
          <WebView
            key={fontId}
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

        {/* closeOnBackdropPress=false: prevent accidental close on backdrop tap */}
        <EsModel ref={htmlModelRef} closeOnBackdropPress={false}>
          <FlexContainer noneBasicStyle fullWidth fullFlex>
            <View style={{ height: isLandscapeNow ? '3%' : '30%', opacity: 0 }} />
            {/* Pressable wrapper swallows taps so they don't reach the backdrop */}
            <Pressable
              onPress={() => {}}
              style={[
                modalStyle.container,
                { maxHeight: winHeight * 0.97 },
              ]}
            >
              <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={isLandscapeNow ? styles.modalPadLandscape : styles.modalPadPortrait}
              >
                {/* Header row: title + close button */}
                <FlexRowContainer noneBasicStyle style={styles.modalHeader}>
                  <Text style={modalStyle.title}>Page Options</Text>
                  <TouchableOpacity onPress={() => htmlModelRef.current?.close()} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </FlexRowContainer>

                {isLandscapeNow ? (
                  /* ── LANDSCAPE: ultra-compact single-screen layout ── */
                  <>
                    {/* Row 1: Search + Font size + Toggles — all in one line */}
                    <View style={lsStyles.row}>
                      {/* Page search */}
                      <View style={lsStyles.searchBlock}>
                        <TextInput
                          onChangeText={(val) => setGoToPage(parseInt(String(val)))}
                          keyboardType="number-pad"
                          placeholder="Page No."
                          placeholderTextColor="#aaa"
                          style={lsStyles.searchInput}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            if (goToPage >= 1 && goToPage <= paragraphs.length) setCurrentPage(goToPage - 1);
                            htmlModelRef.current?.close();
                          }}
                          style={lsStyles.searchBtn}>
                          <Icon icon={IconKey.search} size={IconsSize.xs} className={{color: '#fff'}} />
                        </TouchableOpacity>
                      </View>

                      <View style={lsStyles.dividerV} />

                      {/* Font size */}
                      <View style={lsStyles.fontSizeBlock}>
                        <Text style={lsStyles.fontSizeLabelSm}>A</Text>
                        <TouchableOpacity
                          style={[lsStyles.fsBtn, fontSize <= MIN_FONT_SIZE && lsStyles.fsBtnDisabled]}
                          onPress={() => setFontSizeVal((f) => Math.max((f ?? DEFAULT_FONT_SIZE) - 1, MIN_FONT_SIZE))}
                          disabled={fontSize <= MIN_FONT_SIZE}>
                          <Text style={lsStyles.fsBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={lsStyles.fsValue}>{fontSize}</Text>
                        <TouchableOpacity
                          style={[lsStyles.fsBtn, fontSize >= MAX_FONT_SIZE && lsStyles.fsBtnDisabled]}
                          onPress={() => setFontSizeVal((f) => Math.min((f ?? DEFAULT_FONT_SIZE) + 1, MAX_FONT_SIZE))}
                          disabled={fontSize >= MAX_FONT_SIZE}>
                          <Text style={lsStyles.fsBtnText}>+</Text>
                        </TouchableOpacity>
                        <Text style={lsStyles.fontSizeLabelLg}>A</Text>
                      </View>

                      <View style={lsStyles.dividerV} />

                      {/* Toggles */}
                      <View style={lsStyles.togglesBlock}>
                        <View style={lsStyles.toggleRow}>
                          <Text style={lsStyles.toggleLabel}>Dark</Text>
                          <Switch value={enabled} onValueChange={(v) => setDarkMode(v)}
                            trackColor={{ false: '#ccc', true: GradientColor[2] }}
                            thumbColor={enabled ? '#fff' : '#f4f3f4'}
                            style={lsStyles.switch} />
                        </View>
                        <View style={lsStyles.toggleRow}>
                          <Text style={lsStyles.toggleLabel}>Landscape</Text>
                          <Switch value={landscape} onValueChange={(v) => setIsLandscape(v)}
                            trackColor={{ false: '#ccc', true: GradientColor[2] }}
                            thumbColor={landscape ? '#fff' : '#f4f3f4'}
                            style={lsStyles.switch} />
                        </View>
                      </View>
                    </View>

                    {/* Row 2: Font picker */}
                    <View style={lsStyles.fontRow}>
                      <Text style={lsStyles.fontLabel}>Font</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={lsStyles.fontScroll}>
                        {fonts.map((f) => {
                          const selected = f.id === fontId;
                          return (
                            <TouchableOpacity
                              key={f.id}
                              onPress={() => setFontFamilyId(f.id)}
                              style={[lsStyles.fontBtn, selected && lsStyles.fontBtnSelected]}
                              activeOpacity={0.75}
                            >
                              <Text style={[lsStyles.fontBtnText, f.nativeFont ? { fontFamily: f.nativeFont } : {}, selected && lsStyles.fontBtnTextSelected]}>
                                {f.preview}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </>
                ) : (
                  /* ── PORTRAIT: single column ──────────────────────── */
                  <>
                    <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                      <FlexRowContainer noneBasicStyle centerAlign>
                        <Icon icon={IconKey.setting} size={IconsSize.normal} className={{color: GradientColor[2], marginRight: 10}} />
                        <Text style={styles.modalTextPrimary}>Dark Mode</Text>
                      </FlexRowContainer>
                      <Switch value={enabled} onValueChange={(v) => setDarkMode(v)}
                        trackColor={{ false: '#ccc', true: GradientColor[2] }}
                        thumbColor={enabled ? '#fff' : '#f4f3f4'} />
                    </FlexRowContainer>
                    <LineBreak />

                    <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                      <Text style={[styles.fontSizeLabel, {fontSize: 13}]}>A</Text>
                      <FlexRowContainer noneBasicStyle centerAlign style={styles.volumeBarRow}>
                        <TouchableOpacity
                          style={[styles.volumeBtn, fontSize <= MIN_FONT_SIZE && styles.volumeBtnDisabled]}
                          onPress={() => setFontSizeVal((f) => Math.max((f ?? DEFAULT_FONT_SIZE) - 1, MIN_FONT_SIZE))}
                          disabled={fontSize <= MIN_FONT_SIZE}>
                          <Text style={styles.volumeBtnText}>−</Text>
                        </TouchableOpacity>
                        <View style={styles.volumeDotsRow}>
                          {Array.from({ length: MAX_FONT_SIZE - MIN_FONT_SIZE + 1 }).map((_, i) => (
                            <View key={i} style={[styles.volumeDot, i < fontSize - MIN_FONT_SIZE ? styles.volumeDotFilled : styles.volumeDotEmpty]} />
                          ))}
                        </View>
                        <TouchableOpacity
                          style={[styles.volumeBtn, fontSize >= MAX_FONT_SIZE && styles.volumeBtnDisabled]}
                          onPress={() => setFontSizeVal((f) => Math.min((f ?? DEFAULT_FONT_SIZE) + 1, MAX_FONT_SIZE))}
                          disabled={fontSize >= MAX_FONT_SIZE}>
                          <Text style={styles.volumeBtnText}>+</Text>
                        </TouchableOpacity>
                      </FlexRowContainer>
                      <Text style={[styles.fontSizeLabel, {fontSize: 20}]}>A</Text>
                    </FlexRowContainer>
                    <LineBreak />

                    {/* Font picker */}
                    <View style={styles.fontPickerSection}>
                      <Text style={styles.fontPickerLabel}>Font</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.fontPickerRow}
                      >
                        {fonts.map((f) => {
                          const selected = f.id === fontId;
                          return (
                            <TouchableOpacity
                              key={f.id}
                              onPress={() => setFontFamilyId(f.id)}
                              style={[
                                styles.fontBtn,
                                selected && styles.fontBtnSelected,
                              ]}
                              activeOpacity={0.75}
                            >
                              <Text
                                style={[
                                  styles.fontBtnPreview,
                                  f.nativeFont ? { fontFamily: f.nativeFont } : {},
                                  selected && styles.fontBtnPreviewSelected,
                                ]}
                              >
                                {f.preview}
                              </Text>
                              <Text
                                style={[
                                  styles.fontBtnLabel,
                                  selected && styles.fontBtnLabelSelected,
                                ]}
                                numberOfLines={1}
                              >
                                {f.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                    <LineBreak />

                    <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                      <Icon icon={IconKey.book} size={IconsSize.lg} className={{color: GradientColor[2]}} />
                      <FlexRowContainer noneBasicStyle centerAlign>
                        <TextInput
                          onChangeText={(val) => setGoToPage(parseInt(String(val)))}
                          keyboardType="number-pad"
                          placeholder="Page Number"
                          style={styles.goToInput}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            if (goToPage >= 1 && goToPage <= paragraphs.length) setCurrentPage(goToPage - 1);
                            htmlModelRef.current?.close();
                          }}
                          style={styles.goToButton}>
                          <Icon icon={IconKey.search} size={15} className={{color: "white"}} />
                        </TouchableOpacity>
                      </FlexRowContainer>
                    </FlexRowContainer>
                    <LineBreak />

                    <FlexRowContainer isTouchable onPress={() => navigation.navigate(MainNav.HOME as never)} noneBasicStyle style={styles.rowSpaceBetween}>
                      <Icon icon={IconKey.home} size={IconsSize.lg} className={{color: GradientColor[2], marginRight: 10}} />
                      <FlexRowContainer noneBasicStyle fullFlex>
                        <Text style={styles.modalTextPrimary}>Back to Home</Text>
                      </FlexRowContainer>
                    </FlexRowContainer>
                    <LineBreak />

                    <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                      <FlexRowContainer noneBasicStyle centerAlign>
                        <Icon icon={IconKey.setting} size={IconsSize.normal} className={{color: GradientColor[2], marginRight: 10}} />
                        <Text style={styles.modalTextPrimary}>Landscape Mode</Text>
                      </FlexRowContainer>
                      <Switch value={landscape} onValueChange={(v) => setIsLandscape(v)}
                        trackColor={{ false: '#ccc', true: GradientColor[2] }}
                        thumbColor={landscape ? '#fff' : '#f4f3f4'} />
                    </FlexRowContainer>
                  </>
                )}
              </ScrollView>
            </Pressable>
          </FlexContainer>
        </EsModel>
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
  modalPadPortrait:  { padding: 20, paddingBottom: 28 },
  modalPadLandscape: { padding: 12, paddingBottom: 16 },
  modalHeader: { justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
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
});

export default ReaderFlatListWebView;
