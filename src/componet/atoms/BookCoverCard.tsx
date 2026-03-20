import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type BookType = 'original' | 'shortNote' | 'comingSoon';

type Palette = { cover: string; spine: string; accent: string };

// ─────────────────────────────────────────────────────────────────────────────
// Colour palettes
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_COLORS: Palette[] = [
  { cover: '#1565C0', spine: '#0D47A1', accent: '#90CAF9' },
  { cover: '#6A1B9A', spine: '#4A148C', accent: '#CE93D8' },
  { cover: '#2E7D32', spine: '#1B5E20', accent: '#A5D6A7' },
  { cover: '#C62828', spine: '#B71C1C', accent: '#EF9A9A' },
  { cover: '#00695C', spine: '#004D40', accent: '#80CBC4' },
  { cover: '#E65100', spine: '#BF360C', accent: '#FFCC80' },
  { cover: '#283593', spine: '#1A237E', accent: '#90CAF9' },
  { cover: '#AD1457', spine: '#880E4F', accent: '#F48FB1' },
  { cover: '#558B2F', spine: '#33691E', accent: '#C5E1A5' },
  { cover: '#4527A0', spine: '#311B92', accent: '#D1C4E9' },
  { cover: '#006064', spine: '#00363A', accent: '#80DEEA' },
  { cover: '#827717', spine: '#5D4037', accent: '#FFF176' },
];

const SHORT_NOTE_SPINE_COLORS = [
  '#0D47A1', '#4A148C', '#1B5E20', '#B71C1C',
  '#004D40', '#BF360C', '#880E4F', '#311B92',
];

const COMING_SOON_COLORS: Palette[] = [
  { cover: '#1a1a2e', spine: '#0f0f1e', accent: '#e94560' },
  { cover: '#16213e', spine: '#0d1b31', accent: '#f5a623' },
  { cover: '#1b1b2f', spine: '#13132a', accent: '#7c83fd' },
  { cover: '#0d0d0d', spine: '#050505', accent: '#e0e0e0' },
  { cover: '#2d1b3d', spine: '#1a0f26', accent: '#da9fff' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hash helpers
// ─────────────────────────────────────────────────────────────────────────────
function hashStr(seed: string, mul: number, add: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * mul + seed.charCodeAt(i) + add) >>> 0;
  return h;
}

function pickColor(seed: string, bookType: BookType): Palette {
  if (bookType === 'comingSoon') {
    return COMING_SOON_COLORS[hashStr(seed, 31, 0) % COMING_SOON_COLORS.length];
  }
  if (bookType === 'shortNote') {
    const spine = SHORT_NOTE_SPINE_COLORS[hashStr(seed, 31, 0) % SHORT_NOTE_SPINE_COLORS.length];
    return { cover: '#ffffff', spine, accent: spine };
  }
  return BOOK_COLORS[hashStr(seed, 31, 0) % BOOK_COLORS.length];
}

function pickDesign(seed: string, count: number): number {
  return hashStr(seed, 53, 11) % count;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const SPINE_RATIO      = 0.12;
const PAGE_EDGE_RATIO  = 0.09;
const PAGE_LINE_HEIGHT = 2.5;

// ─────────────────────────────────────────────────────────────────────────────
// Original Book — 6 designs
// ─────────────────────────────────────────────────────────────────────────────

const ObDesign0 = ({ p }: { p: Palette }) => (
  <>
    <View style={[d.topBand,    { backgroundColor: p.spine, opacity: 0.22 }]} />
    <View style={[d.bottomBand, { backgroundColor: p.spine, opacity: 0.22 }]} />
    <View style={{ position: 'absolute', top: 8, left: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: p.accent + '20' }} />
    <View style={{ position: 'absolute', top: 5, left: 5, width: 30, height: 30, borderRadius: 15, backgroundColor: p.accent + '0E' }} />
  </>
);

const ObDesign1 = ({ p }: { p: Palette }) => (
  <>
    <View style={[d.hRule, { top: '28%', backgroundColor: p.accent + '1A' }]} />
    <View style={[d.hRule, { top: '50%', backgroundColor: p.accent + '14' }]} />
    <View style={[d.hRule, { top: '72%', backgroundColor: p.accent + '0E' }]} />
    <View style={[d.bottomBand, { backgroundColor: p.spine, height: 18, opacity: 0.22 }]} />
  </>
);

const ObDesign2 = ({ p, fw, h }: { p: Palette; fw: number; h: number }) => {
  const r = Math.round(Math.min(fw, h) * 0.38);
  return (
    <>
      <View style={[d.topBand, { backgroundColor: p.spine, height: 20, opacity: 0.22 }]} />
      <View style={{ position: 'absolute', width: r * 2, height: r * 2, borderRadius: r, backgroundColor: p.accent + '08', borderWidth: 2, borderColor: p.accent + '1A', top: h / 2 - r, left: fw / 2 - r }} />
      <View style={{ position: 'absolute', width: r, height: r, borderRadius: r / 2, backgroundColor: p.accent + '10', top: h / 2 - r / 2, left: fw / 2 - r / 2 }} />
    </>
  );
};

const ObDesign3 = ({ p }: { p: Palette }) => (
  <>
    <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, backgroundColor: p.spine, opacity: 0.20 }} />
    <View style={{ position: 'absolute', left: 17, top: 0, bottom: 0, width: 3, backgroundColor: p.accent + '18' }} />
    <View style={[d.bottomBand, { backgroundColor: p.spine, height: 20, opacity: 0.20 }]} />
    <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, height: 1, backgroundColor: p.accent + '1A' }} />
  </>
);

const ObDesign4 = ({ p }: { p: Palette }) => (
  <>
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', backgroundColor: 'rgba(0,0,0,0.06)' }} />
    <View style={{ position: 'absolute', top: '43%', left: 0, right: 0, height: 3, backgroundColor: p.accent + '22' }} />
    <View style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: p.accent + '14' }} />
  </>
);


// ─────────────────────────────────────────────────────────────────────────────
// Short Note — 5 subtle designs (white cover, low opacity shapes)
// ─────────────────────────────────────────────────────────────────────────────

/** SN-0: Large soft circle watermark — bottom-right */
const SnDesign0 = ({ p, fw, h }: { p: Palette; fw: number; h: number }) => (
  <>
    <View style={{ position: 'absolute', width: fw * 1.3, height: fw * 1.3, borderRadius: fw * 0.65, backgroundColor: p.spine, opacity: 0.07, bottom: -fw * 0.4, right: -fw * 0.3 }} />
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: h * 0.18, backgroundColor: p.spine, opacity: 0.05 }} />
  </>
);

/** SN-1: Diagonal wedge in top-right corner */
const SnDesign1 = ({ p, fw, h }: { p: Palette; fw: number; h: number }) => (
  <>
    <View style={{ position: 'absolute', width: fw * 2, height: h * 0.7, backgroundColor: p.spine, opacity: 0.06, transform: [{ rotate: '40deg' }], top: -h * 0.5, right: -fw * 0.5 }} />
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: h * 0.08, backgroundColor: p.spine, opacity: 0.06 }} />
  </>
);

/** SN-2: Two concentric rings centered */
const SnDesign2 = ({ p, fw, h }: { p: Palette; fw: number; h: number }) => {
  const cx = fw / 2, cy = h * 0.38;
  const r1 = Math.round(Math.min(fw, h) * 0.32);
  const r2 = Math.round(Math.min(fw, h) * 0.18);
  return (
    <>
      <View style={{ position: 'absolute', width: r1 * 2, height: r1 * 2, borderRadius: r1, borderWidth: 1.5, borderColor: p.spine, opacity: 0.10, top: cy - r1, left: cx - r1 }} />
      <View style={{ position: 'absolute', width: r2 * 2, height: r2 * 2, borderRadius: r2, backgroundColor: p.spine, opacity: 0.07, top: cy - r2, left: cx - r2 }} />
    </>
  );
};

/** SN-3: Three horizontal thin accent lines */
const SnDesign3 = ({ p, fw, h }: { p: Palette; fw: number; h: number }) => (
  <>
    <View style={{ position: 'absolute', top: h * 0.20, left: 8, right: 8, height: 1.5, backgroundColor: p.spine, opacity: 0.12 }} />
    <View style={{ position: 'absolute', top: h * 0.35, left: 8, right: 8, height: 1.5, backgroundColor: p.spine, opacity: 0.09 }} />
    <View style={{ position: 'absolute', top: h * 0.50, left: 8, right: 8, height: 1.5, backgroundColor: p.spine, opacity: 0.06 }} />
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: h * 0.12, backgroundColor: p.spine, opacity: 0.06 }} />
  </>
);

/** SN-4: Small circle cluster in top-left + bottom accent */
const SnDesign4 = ({ p, fw, h }: { p: Palette; fw: number; h: number }) => (
  <>
    <View style={{ position: 'absolute', top: 10, left: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: p.spine, opacity: 0.09 }} />
    <View style={{ position: 'absolute', top: 20, left: 22, width: 18, height: 18, borderRadius: 9, backgroundColor: p.spine, opacity: 0.06 }} />
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: h * 0.14, backgroundColor: p.spine, opacity: 0.07 }} />
    <View style={{ position: 'absolute', bottom: h * 0.14, left: 0, right: 0, height: 1.5, backgroundColor: p.spine, opacity: 0.10 }} />
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
// Coming Soon — 3 designs
// ─────────────────────────────────────────────────────────────────────────────

const CsDesign0 = ({ p, fw, h }: { p: Palette; fw: number; h: number }) => {
  const cx = fw / 2, cy = h * 0.42;
  return (
    <>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.12)' }} />
      {[0.38, 0.25, 0.13].map((ratio, i) => {
        const r = Math.round(Math.min(fw, h) * ratio);
        return (
          <View key={i} style={{ position: 'absolute', width: r * 2, height: r * 2, borderRadius: r, borderWidth: i === 0 ? 2 : 1, borderColor: p.accent + (i === 0 ? '22' : i === 1 ? '18' : '0E'), top: cy - r, left: cx - r }} />
        );
      })}
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: cx - 0.5, width: 1, backgroundColor: p.accent + '0E' }} />
      <View style={{ position: 'absolute', left: 0, right: 0, top: cy - 0.5, height: 1, backgroundColor: p.accent + '0E' }} />
    </>
  );
};


const CsDesign2 = ({ p, fw, h }: { p: Palette; fw: number; h: number }) => {
  const barH = 10, gap = 8, total = barH + gap;
  const barCount = Math.floor(h / total) + 1;
  const bars: React.ReactElement[] = [];
  for (let i = 0; i < barCount; i++) {
    bars.push(
      <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * total, height: barH, backgroundColor: 'rgba(0,0,0,0.10)' }} />,
    );
  }
  return (
    <>
      {bars}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.05)' }} />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: p.accent + '28' }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: p.accent + '28' }} />
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface BookCoverCardProps {
  title?: string;
  author?: string;
  bookType?: BookType;
  width?: number;
  height?: number;
  style?: ViewStyle;
  seed?: string;
  showComingSoonLabel?: boolean;
  showShortNoteLabel?: boolean;
}

export const BookCoverCard: React.FC<BookCoverCardProps> = ({
  title,
  author,
  bookType = 'original',
  width = 110,
  height = 160,
  style,
  seed = '',
  showComingSoonLabel,
  showShortNoteLabel,
}) => {
  const effectiveSeed = seed || title || 'default';
  const palette = pickColor(effectiveSeed, bookType);

  const designCount = bookType === 'comingSoon' ? 2 : 5;
  const designId    = pickDesign(effectiveSeed, designCount);

  const spineWidth    = Math.round(width * SPINE_RATIO);
  const pageEdgeWidth = 0;
  const frontWidth    = width - spineWidth - pageEdgeWidth;

  const lineCount = useMemo(() => Math.ceil(height / PAGE_LINE_HEIGHT), [height]);

  const pageLineEven = bookType === 'comingSoon' ? '#555' : '#f2f2f2';
  const pageLineOdd  = bookType === 'comingSoon' ? '#444' : '#e4e4e4';

  return (
    <View style={[{ width, height }, styles.shadowBox, style]}>
      <View style={[{ width, height, flexDirection: 'row' }, styles.bookTransform]}>

        {/* ── Spine ─────────────────────────────────────────────────── */}
        <View style={[styles.spine, { width: spineWidth, height, backgroundColor: palette.spine }]}>
          <View style={styles.spineLeftGlow} />
          <View style={styles.spineSheen} />
        </View>

        {/* ── Front cover ───────────────────────────────────────────── */}
        <View style={[styles.front, { width: frontWidth, height, backgroundColor: palette.cover }]}>

          {/* Original Book designs */}
          {bookType === 'original' && designId === 0 && <ObDesign0 p={palette} />}
          {bookType === 'original' && designId === 1 && <ObDesign1 p={palette} />}
          {bookType === 'original' && designId === 2 && <ObDesign2 p={palette} fw={frontWidth} h={height} />}
          {bookType === 'original' && designId === 3 && <ObDesign3 p={palette} />}
          {bookType === 'original' && designId === 4 && <ObDesign4 p={palette} />}

          {/* Short Note designs */}
          {bookType === 'shortNote' && designId === 0 && <SnDesign0 p={palette} fw={frontWidth} h={height} />}
          {bookType === 'shortNote' && designId === 1 && <SnDesign1 p={palette} fw={frontWidth} h={height} />}
          {bookType === 'shortNote' && designId === 2 && <SnDesign2 p={palette} fw={frontWidth} h={height} />}
          {bookType === 'shortNote' && designId === 3 && <SnDesign3 p={palette} fw={frontWidth} h={height} />}
          {bookType === 'shortNote' && designId === 4 && <SnDesign4 p={palette} fw={frontWidth} h={height} />}

          {/* Coming Soon designs */}
          {bookType === 'comingSoon' && designId === 0 && <CsDesign0 p={palette} fw={frontWidth} h={height} />}
          {bookType === 'comingSoon' && designId === 1 && <CsDesign2 p={palette} fw={frontWidth} h={height} />}

          {/* Coming Soon label */}
          {(showComingSoonLabel ?? bookType === 'comingSoon') && (
            <View style={styles.csLabelWrap} pointerEvents="none">
              <View style={[styles.csLabelBadge, { backgroundColor: palette.accent }]}>
                <Text style={[styles.csLabelText, { color: palette.cover }]}>COMING SOON</Text>
              </View>
            </View>
          )}

          {/* Short Note label */}
          {(showShortNoteLabel ?? bookType === 'shortNote') && (
            <View style={styles.csLabelWrap} pointerEvents="none">
              <View style={[styles.csLabelBadge, { backgroundColor: '#1a1a1a' }]}>
                <Text style={[styles.csLabelText, { color: '#ffffff' }]}>⏱ 30 mins</Text>
              </View>
            </View>
          )}

          {/* Right-edge shadow */}
          <View style={styles.frontRightEdge} />

          {/* Title / Author */}
          {(title || author) && (
            <View style={[
              styles.textArea,
              bookType === 'shortNote' && styles.textAreaShortNote,
            ]}>
              {title ? (
                <Text
                  style={[
                    styles.titleText,
                    bookType === 'shortNote' && styles.titleTextShortNote,
                  ]}
                  numberOfLines={4}
                >
                  {title}
                </Text>
              ) : null}
              {author ? (
                <Text
                  style={[
                    styles.authorText,
                    { color: bookType === 'shortNote' ? palette.spine : palette.accent },
                  ]}
                  numberOfLines={1}
                >
                  {author}
                </Text>
              ) : null}
            </View>
          )}
        </View>

        {/* ── Page edge ─────────────────────────────────────────────── */}
        <View style={[styles.pageEdge, { width: pageEdgeWidth, height }]}>
          {Array.from({ length: lineCount }).map((_, i) => (
            <View
              key={i}
              style={[styles.pageLine, { backgroundColor: i % 2 === 0 ? pageLineEven : pageLineOdd }]}
            />
          ))}
          <View style={styles.pageEdgeShadow} />
        </View>

      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared decoration helpers
// ─────────────────────────────────────────────────────────────────────────────
const d = StyleSheet.create({
  topBand:    { position: 'absolute', top: 0,    left: 0, right: 0, height: 28, opacity: 0.85 },
  bottomBand: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 22, opacity: 0.75 },
  hRule:      { position: 'absolute', left: 12, right: 12, height: 2 },
});

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 20,
  },
  bookTransform: {
    transform: [{ perspective: 700 }, { rotateY: '18deg' }],
    borderRadius: 4,
    overflow: 'hidden',
  },
  spine: {
    overflow: 'hidden',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  spineLeftGlow: {
    position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  spineSheen: {
    position: 'absolute', top: 0, left: 0, bottom: 0, width: '55%',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  front: {
    overflow: 'hidden',
  },
  frontRightEdge: {
    position: 'absolute', top: 0, right: 0, bottom: 0, width: 5,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  textArea: {
    position: 'absolute',
    left: 8, right: 8, bottom: 12, top: 30,
    justifyContent: 'flex-end',
  },
  textAreaShortNote: {
    top: 10,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  titleTextShortNote: {
    color: '#1a1a1a',
    textAlign: 'center',
    textShadowColor: 'transparent',
    textShadowRadius: 0,
    marginBottom: 0,
  },
  authorText: {
    fontSize: 8,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pageEdge: {
    overflow: 'hidden',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  pageLine: {
    height: PAGE_LINE_HEIGHT,
    width: '100%',
  },
  pageEdgeShadow: {
    position: 'absolute', top: 0, right: 0, bottom: 0, width: 4,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  csLabelWrap: {
    position: 'absolute',
    top: 12, left: 6, right: 6,
    alignItems: 'center',
  },
  csLabelBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  csLabelText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});
