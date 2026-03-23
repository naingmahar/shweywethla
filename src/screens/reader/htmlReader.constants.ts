import type { FontOption } from './PageOptionsModal';

// ── Native module wrappers (null until linked) ──────────────────────────────
let Brightness: { getAppBrightness: () => Promise<number>; setAppBrightness: (level: number) => Promise<void> } | null = null;
try { const mod = require('react-native-brightness'); Brightness = mod.default || mod; } catch (_) {}

let Orientation: typeof import('react-native-orientation-locker').default | null = null;
try { Orientation = require('react-native-orientation-locker').default; } catch (_) {}

export { Brightness, Orientation };

// ── Fonts ───────────────────────────────────────────────────────────────────
export const MYANMAR_FONTS: FontOption[] = [
  { id: 'default',      label: 'Default',    css: 'Pyidaungsu, "Noto Sans Myanmar", sans-serif',                                                                     preview: 'က' },
  { id: 'pyidaungsu',   label: 'Pyidaungsu', css: 'Pyidaungsu, sans-serif',                      nativeFont: 'Pyidaungsu',                                            preview: 'က' },
  { id: 'myanmar3',     label: 'Myanmar3',   css: 'Myanmar3, Pyidaungsu, sans-serif',             nativeFont: 'Myanmar3',                                              preview: 'က' },
  { id: 'noto-myanmar', label: 'Noto Sans',  css: '"Noto Sans Myanmar", Pyidaungsu, sans-serif',  googleFontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;700&display=swap', preview: 'က' },
  { id: 'padauk',       label: 'Padauk',     css: 'Padauk, Pyidaungsu, sans-serif',               googleFontUrl: 'https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap',           preview: 'က' },
];

export const ENGLISH_FONTS: FontOption[] = [
  { id: 'default',      label: 'Default',     css: '-apple-system, Roboto, sans-serif',                                                                                preview: 'Aa' },
  { id: 'georgia',      label: 'Georgia',     css: 'Georgia, serif',                               nativeFont: 'Georgia',                                               preview: 'Aa' },
  { id: 'palatino',     label: 'Palatino',    css: '"Palatino Linotype", Palatino, serif',         nativeFont: 'Palatino',                                              preview: 'Aa' },
  { id: 'times',        label: 'Times New',   css: '"Times New Roman", Times, serif',              nativeFont: 'Times New Roman',                                       preview: 'Aa' },
  { id: 'merriweather', label: 'Merriweather',css: 'Merriweather, Georgia, serif',                 googleFontUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap', preview: 'Aa' },
  { id: 'lato',         label: 'Lato',        css: 'Lato, Roboto, sans-serif',                     googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700&display=swap',  preview: 'Aa' },
];

// ── Pre-compiled regexes ─────────────────────────────────────────────────────
export const RX_NEXT   = /--next--/g;
export const RX_3REM   = /font-size\s*:\s*3rem/gi;
export const RX_275REM = /font-size\s*:\s*2\.75rem/gi;
export const RX_25REM  = /font-size\s*:\s*2\.5rem/gi;

// ── Floating button geometry ─────────────────────────────────────────────────
export const BUTTON_SIZE = 44;
export const BTN_MARGIN  = 30;
