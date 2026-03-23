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
import { READING_THEMES, ThemeOption, FontOption } from './PageOptionsModal';

const ACC = GradientColor[2];
const D = () => <View style={s.div} />;

const THEME_ICONS: Record<string, string> = {
  paper: '📄', day: '☀️', mint: '🌿', stone: '🪨',
  slate: '🌊', forest: '🌲', midnight: '🌙', carbon: '⚫',
};

export interface HtmlPageOptionsModalProps {
  modalRef: React.RefObject<IEsModelRefProps | null>;
  navigation: any;
  currentThemeKey: string;
  applyTheme: (theme: ThemeOption) => void;
  enabled: boolean; setDarkMode: (v: boolean) => void;
  brightness: number; handleBrightnessChange: (v: number) => void;
  fontSize: number; setFontSizeVal: (fn: (f: number | null) => number) => void;
  fonts: FontOption[]; fontId: string; setFontFamilyId: (id: string) => void;
  pageCount: number; setCurrentPage: (page: number) => void;
}

const ThemeChip = ({ t, active, onPress }: { t: ThemeOption; active: boolean; onPress: () => void }) => (
  <TouchableOpacity style={[s.themeChip, { backgroundColor: t.bg }, active && s.themeChipActive]} onPress={onPress} activeOpacity={0.8}>
    <Text style={s.themeIcon}>{THEME_ICONS[t.key]}</Text>
    <Text style={[s.themeLabel, { color: t.color }]}>{t.label}</Text>
    {active && <View style={[s.activeDot, { backgroundColor: GradientColor[1] }]} />}
  </TouchableOpacity>
);

const FontChip = ({ f, selected, onPress }: { f: FontOption; selected: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={[s.fontChip, selected && s.fontChipOn]} activeOpacity={0.75}>
    <Text style={[s.fontPrev, f.nativeFont ? { fontFamily: f.nativeFont } : {}, selected && s.fontTxtOn]}>{f.preview}</Text>
    <Text style={[s.fontName, selected && s.fontTxtOn]} numberOfLines={1}>{f.label}</Text>
  </TouchableOpacity>
);

const FontCounter = ({ fontSize, setFontSizeVal }: Pick<HtmlPageOptionsModalProps, 'fontSize' | 'setFontSizeVal'>) => (
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

const BrightnessDots = ({ brightness, handleBrightnessChange }: Pick<HtmlPageOptionsModalProps, 'brightness' | 'handleBrightnessChange'>) => (
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

export const HtmlPageOptionsModal: React.FC<HtmlPageOptionsModalProps> = (p) => {
  const [page, setPage] = React.useState('');
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <EsModel ref={p.modalRef} closeOnBackdropPress={false}>
      <SafeAreaView style={[s.container, { width: '100%', flex: 1 }]} edges={['top', 'bottom']}>
        <View style={s.handle} />

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Page Options</Text>
          <TouchableOpacity onPress={() => p.modalRef.current?.close()} style={s.closeBtn}>
            <Text style={s.closeTxt}>✕</Text>
          </TouchableOpacity>
        </View>
        <D />

        {/* Themes */}
        <View style={s.wrapSection}>
          <Text style={s.secLabel}>Theme</Text>
          <View style={s.wrapRow}>
            {READING_THEMES.map(t => (
              <ThemeChip
                key={t.key}
                t={t}
                active={t.key === p.currentThemeKey}
                onPress={() => { p.applyTheme(t); p.modalRef.current?.close(); }}
              />
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

        {/* Font Family */}
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

        {/* Navigation */}
        <View style={s.navRow}>
          <TextInput value={page} onChangeText={setPage} keyboardType="number-pad" placeholder="Page" placeholderTextColor="#bbb" style={s.pageInput} />
          <TouchableOpacity onPress={() => { const n = parseInt(page); if (n >= 1 && n <= p.pageCount) { p.setCurrentPage(n - 1); p.modalRef.current?.close(); } }} style={s.goBtn}>
            <Icon icon={IconKey.search} size={IconsSize.xs} className={{ color: 'white' }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => p.navigation.navigate(MainNav.HOME as never)} style={s.homeBtn}>
            <Icon icon={IconKey.home} size={IconsSize.xs} className={{ color: '#fff' }} />
            <Text style={s.homeTxt}>Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </EsModel>
  );
};

const s = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0', alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#222' },
  closeBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  closeTxt: { fontSize: 13, color: '#666', fontWeight: '700' },
  div: { height: 1, backgroundColor: '#f2f2f2', marginHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 44 },
  rowLabel: { fontSize: 14, fontWeight: '500', color: '#333' },
  wrapSection: { paddingHorizontal: 16, paddingVertical: 8 },
  secLabel: { fontSize: 11, fontWeight: '700', color: '#aaa', letterSpacing: 0.5, marginBottom: 8 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  themeChip: { width: 64, height: 70, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center', gap: 3 },
  themeChipActive: { borderColor: GradientColor[1] },
  themeIcon: { fontSize: 20 },
  themeLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  activeDot: { width: 6, height: 6, borderRadius: 3, marginTop: 1 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: ACC, alignItems: 'center', justifyContent: 'center' },
  cBtnOff: { backgroundColor: '#ddd' },
  cBtnTxt: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 20 },
  cVal: { fontSize: 16, fontWeight: '700', color: '#333', minWidth: 26, textAlign: 'center' },
  fontChip: { alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#f2f2f2', gap: 2, minWidth: 56 },
  fontChipOn: { backgroundColor: ACC },
  fontPrev: { fontSize: 16, color: '#444' },
  fontName: { fontSize: 9, color: '#777', fontWeight: '600', textAlign: 'center' },
  fontTxtOn: { color: '#fff' },
  bRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  bIcon: { fontSize: 13 },
  bPct: { fontSize: 11, fontWeight: '600', color: '#aaa', marginLeft: 4, minWidth: 30 },
  dotHit: { padding: 4 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  dotOn: { backgroundColor: ACC },
  dotOff: { backgroundColor: '#ddd' },
  sw: { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  pageInput: { flex: 1, height: 38, backgroundColor: '#fafafa', borderWidth: 1, borderColor: ACC, borderRadius: 10, paddingHorizontal: 10, fontSize: 14, color: '#333' },
  goBtn: { width: 38, height: 38, backgroundColor: ACC, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  homeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: ACC, paddingHorizontal: 12, height: 38, borderRadius: 10 },
  homeTxt: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
