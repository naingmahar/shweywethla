import { useState, useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { darkModeAtom } from '../../../features/jotai/model/darkMode';
import { fontSizeAtom, DEFAULT_FONT_SIZE } from '../../../features/jotai/model/fontSize';
import { landscapeModeAtom } from '../../../features/jotai/model/landscapeMode';
import { fontFamilyAtom, DEFAULT_FONT_FAMILY_ID } from '../../../features/jotai/model/fontFamily';
import { READING_THEMES } from '../PageOptionsModal';
import type { ThemeOption, FontOption } from '../PageOptionsModal';
import { getFontList } from '../htmlReader.utils';
import { Brightness, Orientation } from '../htmlReader.constants';

export interface ReaderSettings {
  // Dark mode
  enabled: boolean;
  setDarkMode: (v: boolean | null) => void;
  // Font size
  fontSize: number;
  setFontSizeVal: (v: number | null) => void;
  // Landscape
  landscape: boolean;
  setIsLandscape: (v: boolean | null) => void;
  // Font family
  fontId: string;
  setFontFamilyId: (v: string | null) => void;
  fonts: FontOption[];
  currentFont: FontOption;
  // Theme
  htmlTheme: ThemeOption;
  applyTheme: (theme: ThemeOption) => void;
  // Brightness
  brightness: number;
  handleBrightnessChange: (val: number) => void;
  dimOpacity: number;
  warmOpacity: number;
}

export function useReaderSettings(language?: string): ReaderSettings {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [fontSizeVal, setFontSizeVal] = useAtom(fontSizeAtom);
  const [isLandscape, setIsLandscape] = useAtom(landscapeModeAtom);
  const [fontFamilyId, setFontFamilyId] = useAtom(fontFamilyAtom);

  const enabled   = darkMode ?? false;
  const fontSize  = fontSizeVal ?? DEFAULT_FONT_SIZE;
  const landscape = isLandscape ?? false;
  const fontId    = fontFamilyId ?? DEFAULT_FONT_FAMILY_ID;

  const fonts       = getFontList(language);
  const currentFont = fonts.find(f => f.id === fontId) ?? fonts[0];

  const [htmlTheme, setHtmlTheme] = useState<ThemeOption>(() =>
    READING_THEMES.find(t => t.dark === (darkMode ?? false)) ?? READING_THEMES[1]
  );

  const [brightness, setBrightnessState] = useState(0.5);

  useEffect(() => {
    Brightness?.getAppBrightness()
      .then(level => { if (level > 0) setBrightnessState(level); })
      .catch(() => {});
  }, []);

  // Lock orientation when landscape setting changes
  useEffect(() => {
    if (!Orientation) return;
    if (landscape) Orientation.lockToLandscape();
    else           Orientation.lockToPortrait();
    return () => Orientation?.lockToPortrait();
  }, [landscape]);

  const applyTheme = useCallback((theme: ThemeOption) => {
    setHtmlTheme(theme);
    setDarkMode(theme.dark);
    setFontSizeVal(theme.fontSize);
    setBrightnessState(theme.brightness);
    Brightness?.setAppBrightness(theme.brightness).catch(() => {});
  }, [setDarkMode, setFontSizeVal]);

  const handleBrightnessChange = useCallback((val: number) => {
    setBrightnessState(val);
    Brightness?.setAppBrightness(val).catch(() => {});
  }, []);

  const dimOpacity  = (1 - brightness) * 0.85;
  const warmOpacity = (1 - brightness) * 0.38;

  return {
    enabled, setDarkMode,
    fontSize, setFontSizeVal,
    landscape, setIsLandscape,
    fontId, setFontFamilyId,
    fonts, currentFont,
    htmlTheme, applyTheme,
    brightness, handleBrightnessChange,
    dimOpacity, warmOpacity,
  };
}
