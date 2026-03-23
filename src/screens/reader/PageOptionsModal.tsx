import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Switch, TextInput, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientColor } from '../../res/color';
import { Icon, IconKey, IconsSize } from '../../componet/atoms/icons';
import { EsModel } from '../../componet/atoms/container/ModalContainer';
import { IEsModelRefProps } from '../../componet/atoms/Types/IModal';
import { MIN_FONT_SIZE, MAX_FONT_SIZE, DEFAULT_FONT_SIZE } from '../../features/jotai/model/fontSize';
import { MainNav } from '../../nav/main.nav';

// ── Types ─────────────────────────────────────────────────────────────────────
export type FontOption = {
  id: string; label: string; css: string;
  googleFontUrl?: string; nativeFont?: string; preview: string;
};
export type ThemeOption = {
  key: string; label: string; dark: boolean;
  brightness: number; fontSize: number; bg: string; color: string;
};

export const READING_THEMES: ThemeOption[] = [
  // Light themes
  { key: 'paper',    label: 'Paper',    dark: false, brightness: 0.85, fontSize: 18, bg: '#FAF7F2', color: '#2C2416' },
  { key: 'day',      label: 'Day',      dark: false, brightness: 1.0,  fontSize: 18, bg: '#FFFFFF', color: '#1A1A1A' },
  { key: 'mint',     label: 'Mint',     dark: false, brightness: 0.9,  fontSize: 18, bg: '#C8E6D8', color: '#1A3028' },
  { key: 'stone',    label: 'Stone',    dark: false, brightness: 0.9,  fontSize: 18, bg: '#E8D8C0', color: '#3D2A14' },
  // Dark themes
  { key: 'slate',    label: 'Slate',    dark: true,  brightness: 0.7,  fontSize: 18, bg: '#1E2430', color: '#E8EDF5' },
  { key: 'forest',   label: 'Forest',   dark: true,  brightness: 0.6,  fontSize: 18, bg: '#1A2420', color: '#C8E6D8' },
  { key: 'midnight', label: 'Midnight', dark: true,  brightness: 0.5,  fontSize: 18, bg: '#121212', color: '#E8E0D0' },
  { key: 'carbon',   label: 'Carbon',   dark: true,  brightness: 0.8,  fontSize: 18, bg: '#1C1C1E', color: '#F5F5F5' },
];

const THEME_ICONS: Record<string, string> = {
  paper: '📄', day: '☀️', mint: '🌿', stone: '🪨',
  slate: '🌊', forest: '🌲', midnight: '🌙', carbon: '⚫',
};

// ── Props ─────────────────────────────────────────────────────────────────────
export interface PageOptionsModalProps {
  modalRef: React.RefObject<IEsModelRefProps | null>;
  winHeight: number;
  navigation: any;
  applyTheme: (theme: ThemeOption) => void;
  enabled: boolean; setDarkMode: (v: boolean) => void;
  landscape: boolean; setIsLandscape: (v: boolean) => void;
  brightness: number; handleBrightnessChange: (v: number) => void;
  fontSize: number; setFontSizeVal: (fn: (f: number | null) => number) => void;
  fonts: FontOption[]; fontId: string; setFontFamilyId: (id: string) => void;
  pageCount: number; setCurrentPage: (page: number) => void;
  currentThemeKey: string;
}

// ── Shared atoms ──────────────────────────────────────────────────────────────
const ACC = GradientColor[2];
const D = () => <View style={s.div} />;

// Theme chip (used in both layouts)
const ThemeChip = ({ t, active, onPress }: { t: ThemeOption; active: boolean; onPress: () => void }) => (
  <TouchableOpacity style={[s.themeChip, { backgroundColor: t.bg }, active && s.themeChipActive]} onPress={onPress} activeOpacity={0.8}>
    <Text style={s.themeIcon}>{THEME_ICONS[t.key]}</Text>
    <Text style={[s.themeLabel, { color: t.color }]}>{t.label}</Text>
    {active && <View style={[s.activeDot, { backgroundColor: GradientColor[1] }]} />}
  </TouchableOpacity>
);

// Font chip (used in both layouts)
const FontChip = ({ f, selected, onPress }: { f: FontOption; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={[s.fontChip, selected && s.fontChipOn]} activeOpacity={0.75}>
    <Text style={[s.fontPrev, f.nativeFont ? { fontFamily: f.nativeFont } : {}, selected && s.fontTxtOn]}>{f.preview}</Text>
    <Text style={[s.fontName, selected && s.fontTxtOn]} numberOfLines={1}>{f.label}</Text>
  </TouchableOpacity>
);

// Font size counter (used in both layouts)
const FontCounter = ({ fontSize, setFontSizeVal }: Pick<PageOptionsModalProps, 'fontSize' | 'setFontSizeVal'>) => (
  <View style={s.counterRow}>
    <TouchableOpacity style={[s.cBtn, fontSize <= MIN_FONT_SIZE && s.cBtnOff]} onPress={() => setFontSizeVal(f => Math.max((f ?? DEFAULT_FONT_SIZE) - 1, MIN_FONT_SIZE))} disabled={fontSize <= MIN_FONT_SIZE}>
      <Text style={s.cBtnTxt}>−</Text>
    </TouchableOpacity>
    <Text style={s.cVal}>{fontSize}</Text>
    <TouchableOpacity style={[s.cBtn, fontSize >= MAX_FONT_SIZE && s.cBtnOff]} onPress={() => setFontSizeVal(f => Math.min((f ?? DEFAULT_FONT_SIZE) + 1, MAX_FONT_SIZE))} disabled={fontSize >= MAX_FONT_SIZE}>
      <Text style={s.cBtnTxt}>+</Text>
    </TouchableOpacity>
  </View>
);

// Brightness dots (used in both layouts)
const BrightnessDots = ({ brightness, handleBrightnessChange }: Pick<PageOptionsModalProps, 'brightness' | 'handleBrightnessChange'>) => (
  <View style={s.bRow}>
    <Text style={s.bIcon}>🌙</Text>
    {Array.from({ length: 10 }, (_, i) => (
      <TouchableOpacity key={i} onPress={() => handleBrightnessChange((i + 1) * 0.1)} style={s.dotHit}>
        <View style={[(i + 1) * 0.1 <= brightness + 0.05 ? s.dotOn : s.dotOff, s.dot]} />
      </TouchableOpacity>
    ))}
    <Text style={s.bIcon}>☀️</Text>
    <Text style={s.bPct}>{Math.round(brightness * 100)}%</Text>
  </View>
);

// Go-to-page + Home nav (stateless — page state owned by parent)
const NavButtons = ({ navigation, pageCount, setCurrentPage, modalRef, page, setPage }: Pick<PageOptionsModalProps, 'navigation' | 'pageCount' | 'setCurrentPage' | 'modalRef'> & { page: string; setPage: (v: string) => void }) => (
  <View style={s.navRow}>
    <TextInput value={page} onChangeText={setPage} keyboardType="number-pad" placeholder="Page" placeholderTextColor="#bbb" style={s.pageInput} />
    <TouchableOpacity onPress={() => { const n = parseInt(page); if (n >= 1 && n <= pageCount) { setCurrentPage(n - 1); modalRef.current?.close(); } }} style={s.goBtn}>
      <Icon icon={IconKey.search} size={IconsSize.xs} className={{ color: 'white' }} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate(MainNav.HOME as never)} style={s.homeBtn}>
      <Icon icon={IconKey.home} size={IconsSize.xs} className={{ color: '#fff' }} />
      <Text style={s.homeTxt}>Home</Text>
    </TouchableOpacity>
  </View>
);

// Extended props with hoisted page state
type LayoutProps = PageOptionsModalProps & { page: string; setPage: (v: string) => void };

// ── Portrait layout ───────────────────────────────────────────────────────────
const PortraitLayout = (p: LayoutProps) => (
  <View style={s.portraitContent}>
    {/* Handle */}
    <View style={s.handle} />

    {/* Header */}
    <View style={s.header}>
      <Text style={s.title}>Page Options</Text>
      <TouchableOpacity onPress={() => p.modalRef.current?.close()} style={s.closeBtn}>
        <Text style={s.closeTxt}>✕</Text>
      </TouchableOpacity>
    </View>
    <D />

    {/* Themes — wrap row, no horizontal scroll */}
    <View style={s.wrapSection}>
      <Text style={s.secLabel}>Theme</Text>
      <View style={s.wrapRow}>
        {READING_THEMES.map(t => (
          <ThemeChip key={t.key} t={t} active={t.key === p.currentThemeKey} onPress={() => p.applyTheme(t)} />
        ))}
      </View>
    </View>
    <D />

    {/* Font Size */}
    <View style={s.row}>
      <Text style={s.rowLabel}>Font Size</Text>
      <FontCounter fontSize={p.fontSize} setFontSizeVal={p.setFontSizeVal} />
    </View>
    <D />

    {/* Font Family — wrap row, no horizontal scroll */}
    <View style={s.wrapSection}>
      <Text style={s.secLabel}>Font</Text>
      <View style={s.wrapRow}>
        {p.fonts.map(f => (
          <FontChip key={f.id} f={f} selected={f.id === p.fontId} onPress={() => p.setFontFamilyId(f.id)} />
        ))}
      </View>
    </View>
    <D />

    {/* Brightness */}
    <View style={s.row}>
      <Text style={s.rowLabel}>Brightness</Text>
      <BrightnessDots brightness={p.brightness} handleBrightnessChange={p.handleBrightnessChange} />
    </View>
    <D />

    {/* Dark Mode */}
    <TouchableOpacity style={s.row} onPress={() => p.setDarkMode(!p.enabled)} activeOpacity={0.7}>
      <Text style={s.rowLabel}>🌙  Dark Mode</Text>
      <Switch value={p.enabled} onValueChange={p.setDarkMode} trackColor={{ false: '#e0e0e0', true: ACC }} thumbColor="#fff" style={s.sw} />
    </TouchableOpacity>
    <D />

    {/* Landscape */}
    <TouchableOpacity style={s.row} onPress={() => p.setIsLandscape(!p.landscape)} activeOpacity={0.7}>
      <Text style={s.rowLabel}>🔄  Landscape</Text>
      <Switch value={p.landscape} onValueChange={p.setIsLandscape} trackColor={{ false: '#e0e0e0', true: ACC }} thumbColor="#fff" style={s.sw} />
    </TouchableOpacity>
    <D />

    {/* Navigation */}
    <NavButtons navigation={p.navigation} pageCount={p.pageCount} setCurrentPage={p.setCurrentPage} modalRef={p.modalRef} page={p.page} setPage={p.setPage} />
  </View>
);

// ── Landscape layout ──────────────────────────────────────────────────────────
const LandscapeLayout = (p: LayoutProps) => (
  <View style={s.lsContent}>
    {/* Left column */}
    <View style={s.lsCol}>
      {/* Header */}
      <View style={s.lsHeader}>
        <Text style={s.title}>Page Options</Text>
        <TouchableOpacity onPress={() => p.modalRef.current?.close()} style={s.closeBtn}>
          <Text style={s.closeTxt}>✕</Text>
        </TouchableOpacity>
      </View>
      <D />

      {/* Themes — wrap */}
      <View style={s.wrapSection}>
        <Text style={s.secLabel}>Theme</Text>
        <View style={s.wrapRow}>
          {READING_THEMES.map(t => (
            <ThemeChip key={t.key} t={t} active={t.key === p.currentThemeKey} onPress={() => p.applyTheme(t)} />
          ))}
        </View>
      </View>
      <D />

      {/* Font Size */}
      <View style={s.row}>
        <Text style={s.rowLabel}>Font Size</Text>
        <FontCounter fontSize={p.fontSize} setFontSizeVal={p.setFontSizeVal} />
      </View>
      <D />

      {/* Brightness */}
      <View style={s.row}>
        <Text style={s.rowLabel}>Brightness</Text>
        <BrightnessDots brightness={p.brightness} handleBrightnessChange={p.handleBrightnessChange} />
      </View>
    </View>

    {/* Column divider */}
    <View style={s.colDivider} />

    {/* Right column */}
    <View style={s.lsCol}>
      {/* Font Family — wrap */}
      <View style={s.wrapSection}>
        <Text style={s.secLabel}>Font</Text>
        <View style={s.wrapRow}>
          {p.fonts.map(f => (
            <FontChip key={f.id} f={f} selected={f.id === p.fontId} onPress={() => p.setFontFamilyId(f.id)} />
          ))}
        </View>
      </View>
      <D />

      {/* Dark Mode */}
      <TouchableOpacity style={s.row} onPress={() => p.setDarkMode(!p.enabled)} activeOpacity={0.7}>
        <Text style={s.rowLabel}>🌙  Dark Mode</Text>
        <Switch value={p.enabled} onValueChange={p.setDarkMode} trackColor={{ false: '#e0e0e0', true: ACC }} thumbColor="#fff" style={s.sw} />
      </TouchableOpacity>
      <D />

      {/* Landscape */}
      <TouchableOpacity style={s.row} onPress={() => p.setIsLandscape(!p.landscape)} activeOpacity={0.7}>
        <Text style={s.rowLabel}>🔄  Landscape</Text>
        <Switch value={p.landscape} onValueChange={p.setIsLandscape} trackColor={{ false: '#e0e0e0', true: ACC }} thumbColor="#fff" style={s.sw} />
      </TouchableOpacity>
      <D />

      {/* Navigation */}
      <NavButtons navigation={p.navigation} pageCount={p.pageCount} setCurrentPage={p.setCurrentPage} modalRef={p.modalRef} page={p.page} setPage={p.setPage} />
    </View>
  </View>
);

// ── Main component ────────────────────────────────────────────────────────────
export const PageOptionsModal: React.FC<PageOptionsModalProps> = (p) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [page, setPage] = React.useState('');
  const layoutProps: LayoutProps = { ...p, page, setPage };

  return (
    <EsModel ref={p.modalRef} closeOnBackdropPress={false}>
      <SafeAreaView style={[s.container, { width: '100%', flex: 1 }]} edges={['top', 'bottom']}>
        {isLandscape ? <LandscapeLayout {...layoutProps} /> : <PortraitLayout {...layoutProps} />}
      </SafeAreaView>
    </EsModel>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { borderRadius: 10, backgroundColor: '#fff' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0', alignSelf: 'center', marginTop: 10, marginBottom: 4 },

  // Portrait
  portraitContent: { flex: 1, paddingBottom: 12 },

  // Landscape
  lsContent: { flex: 1, flexDirection: 'row' },
  lsCol: { flex: 1, paddingBottom: 10 },
  lsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  colDivider: { width: 1, backgroundColor: '#f0f0f0', marginVertical: 8 },

  // Shared header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#222' },
  closeBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  closeTxt: { fontSize: 13, color: '#666', fontWeight: '700' },

  div: { height: 1, backgroundColor: '#f2f2f2', marginHorizontal: 16 },

  // Row
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 44 },
  rowLabel: { fontSize: 14, fontWeight: '500', color: '#333' },

  // Wrap section (no scroll)
  wrapSection: { paddingHorizontal: 16, paddingVertical: 8 },
  secLabel: { fontSize: 11, fontWeight: '700', color: '#aaa', letterSpacing: 0.5, marginBottom: 8 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  // Theme chip
  themeChip: { width: 64, height: 70, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center', gap: 3 },
  themeChipActive: { borderColor: GradientColor[1] },
  themeIcon: { fontSize: 20 },
  themeLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  activeDot: { width: 6, height: 6, borderRadius: 3, marginTop: 1 },

  // Font size counter
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: ACC, alignItems: 'center', justifyContent: 'center' },
  cBtnOff: { backgroundColor: '#ddd' },
  cBtnTxt: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 20 },
  cVal: { fontSize: 16, fontWeight: '700', color: '#333', minWidth: 26, textAlign: 'center' },

  // Font chip
  fontChip: { alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#f2f2f2', gap: 2, minWidth: 56 },
  fontChipOn: { backgroundColor: ACC },
  fontPrev: { fontSize: 16, color: '#444' },
  fontName: { fontSize: 9, color: '#777', fontWeight: '600', textAlign: 'center' },
  fontTxtOn: { color: '#fff' },

  // Brightness
  bRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  bIcon: { fontSize: 13 },
  bPct: { fontSize: 11, fontWeight: '600', color: '#aaa', marginLeft: 4, minWidth: 30 },
  dotHit: { padding: 4 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  dotOn: { backgroundColor: ACC },
  dotOff: { backgroundColor: '#ddd' },

  // Switch
  sw: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },

  // Navigation
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  pageInput: { flex: 1, height: 38, backgroundColor: '#fafafa', borderWidth: 1, borderColor: ACC, borderRadius: 10, paddingHorizontal: 10, fontSize: 14, color: '#333' },
  goBtn: { width: 38, height: 38, backgroundColor: ACC, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  homeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: ACC, paddingHorizontal: 12, height: 38, borderRadius: 10 },
  homeTxt: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
