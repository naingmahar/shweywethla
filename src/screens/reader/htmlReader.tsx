import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, StatusBar, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Icon, IconKey, IconsSize } from '../../componet/atoms/icons';
import { ReaderGuideModal } from '../../componet/atoms/modal/ReaderGuideModal';
import { HtmlPageOptionsModal } from './HtmlPageOptionsModal';

import { useReaderSettings } from './hooks/useReaderSettings';
import { useReaderPageManager } from './hooks/useReaderPageManager';
import { useFloatingButton } from './hooks/useFloatingButton';
import { ReaderLoadingScreen } from './components/ReaderLoadingScreen';
import { ReaderErrorScreen } from './components/ReaderErrorScreen';
import { ReaderEyeCareOverlay } from './components/ReaderEyeCareOverlay';
import { BUTTON_SIZE, BTN_MARGIN } from './htmlReader.constants';
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../features/jotai/model/fontSize';
import { GradientColor } from '../../res/color';

// ─────────────────────────────────────────────────────────────────────────────

const ReaderFlatListWebView = ({
  path, title, language, localPageDir, knownTotalPages, onError,
}: {
  path: string;
  title: string;
  language?: string;
  localPageDir?: string;
  knownTotalPages?: number;
  onError?: () => void;
}) => {
  const navigation = useNavigation();
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // ── Settings (theme, brightness, font, dark mode) ───────────────────────
  const {
    enabled, setDarkMode,
    fontSize, setFontSizeVal,
    landscape, setIsLandscape,
    fontId, setFontFamilyId,
    fonts, currentFont,
    htmlTheme, applyTheme,
    brightness, handleBrightnessChange,
    dimOpacity, warmOpacity,
  } = useReaderSettings(language);

  // ── Page loading, navigation, WebView state ──────────────────────────────
  const {
    currentPage, setCurrentPage,
    pageCount,
    currentPageHtml,
    isFileLoading,
    isWebViewLoading, setIsWebViewLoading,
    fileError,
    showGuide, setShowGuide,
    sendCommand,
    INJECTED_JAVASCRIPT,
    webViewRef,
  } = useReaderPageManager({ path, title, localPageDir, knownTotalPages, htmlTheme, fontSize, currentFont });

  // ── Floating button geometry ─────────────────────────────────────────────
  const isLandscapeNow  = winWidth > winHeight;
  const activeMargin    = isLandscapeNow ? BTN_MARGIN * 1.5 : BTN_MARGIN;
  const containerWidth  = winWidth  - insets.left - insets.right;
  const containerHeight = winHeight - insets.bottom;
  const snapLeftX  = activeMargin;
  const snapRightX = containerWidth - BUTTON_SIZE - activeMargin;
  const btnMinY    = insets.top + activeMargin;
  const btnMaxY    = containerHeight - BUTTON_SIZE - activeMargin;

  const { htmlModelRef, dragGesture, floatingBtnAnimStyle } = useFloatingButton({
    snapLeftX, snapRightX, btnMinY, btnMaxY, containerWidth, containerHeight,
  });

  // ── Inject font into running WebView on font change ──────────────────────
  useEffect(() => {
    if (!webViewRef.current) return;
    const escaped = currentFont.css.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    webViewRef.current.injectJavaScript(`if(document.body){document.body.style.fontFamily='${escaped}';}true;`);
  }, [fontId]);

  // ── Status bar ───────────────────────────────────────────────────────────
  const applyStatusBar = useCallback(() => {
    StatusBar.setHidden(false);
    StatusBar.setBackgroundColor('#000000', false);
    StatusBar.setBarStyle('light-content', false);
  }, []);

  useFocusEffect(applyStatusBar);
  useEffect(() => { applyStatusBar(); }, [applyStatusBar]);

  // ── Navigator card background ────────────────────────────────────────────
  useEffect(() => {
    const bg = enabled ? '#121212' : '#fcf7ea';
    navigation.setOptions({
      contentStyle: { backgroundColor: bg },
      cardStyle:    { backgroundColor: bg },
    });
  }, [enabled, navigation]);

  // ── Font-size dot bar ────────────────────────────────────────────────────
  const fontSizeDots = useMemo(() =>
    Array.from({ length: MAX_FONT_SIZE - MIN_FONT_SIZE + 1 }, (_, i) => (
      <View key={i} style={[styles.volumeDot, i < fontSize - MIN_FONT_SIZE ? styles.volumeDotFilled : styles.volumeDotEmpty]} />
    )), [fontSize]);

  const themeBg = htmlTheme.bg;

  // ── Early returns ────────────────────────────────────────────────────────
  if (isFileLoading) {
    return <ReaderLoadingScreen themeBg={themeBg} enabled={enabled} />;
  }

  if (fileError) {
    if (onError) { onError(); return null; }
    return <ReaderErrorScreen fileError={fileError} enabled={enabled} themeBg={themeBg} />;
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: themeBg }]}>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.flex}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <GestureHandlerRootView style={[styles.flex, { backgroundColor: themeBg }]}>

          {/* WebView */}
          <View style={styles.flex}>
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ html: currentPageHtml }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              scalesPageToFit={false}
              androidLayerType="hardware"
              cacheEnabled={false}
              startInLoadingState={false}
              renderLoading={() => <></>}
              onLoadStart={() => setIsWebViewLoading(true)}
              onLoadEnd={() => setIsWebViewLoading(false)}
              onError={() => setIsWebViewLoading(false)}
              injectedJavaScript={INJECTED_JAVASCRIPT}
              onMessage={event => {
                const msg = event.nativeEvent.data;
                if (msg === 'next')     sendCommand('next');
                else if (msg === 'previous') sendCommand('previous');
              }}
            />
            {isWebViewLoading && (
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: themeBg, zIndex: 5 }]} />
            )}
          </View>

          {/* Eye care overlays */}
          <ReaderEyeCareOverlay dimOpacity={dimOpacity} warmOpacity={warmOpacity} />

          {/* Draggable floating settings button */}
          <GestureDetector gesture={dragGesture}>
            <Animated.View style={[styles.floatingBtn, enabled ? styles.floatingBtnDark : styles.floatingBtnLight, floatingBtnAnimStyle]}>
              <Icon icon={IconKey.setting} size={IconsSize.normal} className={{ color: enabled ? '#e1e1e1' : '#555' }} />
            </Animated.View>
          </GestureDetector>

          <ReaderGuideModal visible={showGuide} onClose={() => setShowGuide(false)} />

          <HtmlPageOptionsModal
            modalRef={htmlModelRef}
            navigation={navigation}
            currentThemeKey={htmlTheme.key}
            applyTheme={applyTheme}
            enabled={enabled}
            setDarkMode={setDarkMode}
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

const styles = StyleSheet.create({
  flex:            { flex: 1 },
  webview:         { flex: 1 },
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
  volumeDot:        { width: 6, height: 6, borderRadius: 3, marginHorizontal: 1.5 },
  volumeDotFilled:  { backgroundColor: GradientColor[2] },
  volumeDotEmpty:   { backgroundColor: '#ddd' },
});

export default ReaderFlatListWebView;
