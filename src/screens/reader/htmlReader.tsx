import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Pressable, Switch, TextInput, ScrollView, useWindowDimensions, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import RNFS from "react-native-fs";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientColor } from "../../res/color";
import { FlexContainer, FlexRowContainer } from "../../componet/atoms/container/FlexContainer";
import { Icon, IconKey } from "../../componet/atoms/icons";
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
// Safe wrapper — module is null until native linking (pod install / rebuild)
let Orientation: typeof import("react-native-orientation-locker").default | null = null;
try { Orientation = require("react-native-orientation-locker").default; } catch (_) {}

// Build the HTML for a single page from its raw paragraph content.
// This keeps only ONE page's HTML in memory at a time instead of all pages.
function buildPageHtml(content: string, title: string, pageIndex: number, totalPages: number, darkMode: boolean, fontSize: number): string {
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
      <style>
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body {
          font-family: -apple-system, Roboto, sans-serif;
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

const ReaderFlatListWebView = ({path, title}: {path: string; title: string}) => {
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
  const btnY = useSharedValue(containerHeight * 0.7);
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
      fontSize
    );
  }, [paragraphs, currentPage, title, enabled, fontSize]);

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
            <Icon icon={IconKey.setting} size={22} className={{ color: enabled ? '#e1e1e1' : '#555' }} />
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
                  /* ── LANDSCAPE: 2-column grid ─────────────────────── */
                  <>
                    {/* Row 1: Dark Mode | Landscape Mode */}
                    <View style={styles.twoColRow}>
                      <View style={styles.twoColCell}>
                        <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                          <Text style={styles.modalTextPrimary}>Dark Mode</Text>
                          <Switch value={enabled} onValueChange={(v) => setDarkMode(v)}
                            trackColor={{ false: '#ccc', true: GradientColor[2] }}
                            thumbColor={enabled ? '#fff' : '#f4f3f4'} />
                        </FlexRowContainer>
                      </View>
                      <View style={styles.twoColDivider} />
                      <View style={styles.twoColCell}>
                        <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                          <Text style={styles.modalTextPrimary}>Landscape</Text>
                          <Switch value={landscape} onValueChange={(v) => setIsLandscape(v)}
                            trackColor={{ false: '#ccc', true: GradientColor[2] }}
                            thumbColor={landscape ? '#fff' : '#f4f3f4'} />
                        </FlexRowContainer>
                      </View>
                    </View>

                    <LineBreak />

                    {/* Row 2: Font size — full width */}
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

                    {/* Row 3: Go to page | Back to Home */}
                    <View style={styles.twoColRow}>
                      <View style={styles.twoColCell}>
                        <FlexRowContainer noneBasicStyle centerAlign>
                          <TextInput
                            onChangeText={(val) => setGoToPage(parseInt(String(val)))}
                            keyboardType="number-pad"
                            placeholder="Page No."
                            style={[styles.goToInput, { width: '60%' }]}
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
                      </View>
                      <View style={styles.twoColDivider} />
                      <FlexRowContainer isTouchable onPress={() => navigation.navigate(MainNav.HOME as never)} noneBasicStyle style={[styles.twoColCell, styles.rowCenter]}>
                        <Icon icon={IconKey.home} size={24} className={{color: GradientColor[2], marginRight: 8}} />
                        <Text style={styles.modalTextPrimary}>Back to Home</Text>
                      </FlexRowContainer>
                    </View>
                  </>
                ) : (
                  /* ── PORTRAIT: single column ──────────────────────── */
                  <>
                    <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                      <FlexRowContainer noneBasicStyle centerAlign>
                        <Icon icon={IconKey.setting} size={24} className={{color: GradientColor[2], marginRight: 10}} />
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

                    <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                      <Icon icon={IconKey.book} size={28} className={{color: GradientColor[2]}} />
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
                      <Icon icon={IconKey.home} size={28} className={{color: GradientColor[2], marginRight: 10}} />
                      <FlexRowContainer noneBasicStyle fullFlex>
                        <Text style={styles.modalTextPrimary}>Back to Home</Text>
                      </FlexRowContainer>
                    </FlexRowContainer>
                    <LineBreak />

                    <FlexRowContainer noneBasicStyle style={styles.rowSpaceBetween}>
                      <FlexRowContainer noneBasicStyle centerAlign>
                        <Icon icon={IconKey.setting} size={24} className={{color: GradientColor[2], marginRight: 10}} />
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
});

export default ReaderFlatListWebView;
