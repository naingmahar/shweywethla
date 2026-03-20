import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import Video, { type VideoRef, type OnLoadData, type OnProgressData } from 'react-native-video';
import { useAtom } from 'jotai';

import { darkModeAtom } from '../../features/jotai/model/darkMode';
import { Icon, IconKey, IconsSize } from '../../componet/atoms/icons';
import { IBook, IBookDownloaded } from '../../types/models/IBook';

type AudioPlayerRoute = RouteProp<{ AudioPlayer: IBook }, 'AudioPlayer'>;

const { width } = Dimensions.get('window');
const COVER_SIZE = width - 80;
const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const AudioPlayerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AudioPlayerRoute>();
  const book = route.params;

  const [isDark] = useAtom(darkModeAtom);
  const videoRef = useRef<VideoRef>(null);

  const localPaths = (book as IBookDownloaded).localAudioPaths;
  const audioUri = (localPaths && localPaths.length > 0)
    ? localPaths[0]
    : (Array.isArray(book.audioUrl) ? book.audioUrl[0] : book.audioUrl);

  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(!!audioUri);
  const [hasError, setHasError] = useState(!audioUri);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [barWidth, setBarWidth] = useState(0);

  const progressPercent = duration > 0 ? position / duration : 0;

  const handleLoad = (data: OnLoadData) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const handleProgress = (data: OnProgressData) => {
    setPosition(data.currentTime);
  };

  const handleEnd = () => setPaused(true);

  const skipBackward = () => {
    const next = Math.max(0, position - 10);
    videoRef.current?.seek(next);
    setPosition(next);
  };

  const skipForward = () => {
    const next = Math.min(position + 10, duration);
    videoRef.current?.seek(next);
    setPosition(next);
  };

  const handleSeek = (evt: any) => {
    if (duration > 0 && barWidth > 0) {
      const ratio = Math.max(0, Math.min(evt.nativeEvent.locationX / barWidth, 1));
      const next = ratio * duration;
      videoRef.current?.seek(next);
      setPosition(next);
    }
  };

  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
  };

  const bg = isDark ? '#0f0f1e' : '#f8f8fc';
  const textColor = isDark ? '#ffffff' : '#1a1a2e';
  const subtextColor = isDark ? '#9999bb' : '#777788';
  const trackBg = isDark ? '#2a2a4a' : '#e0e0f0';
  const controlBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(100,100,180,0.08)';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Hidden audio-only Video component */}
      {!!audioUri && (
        <Video
          ref={videoRef}
          source={{ uri: audioUri }}
          paused={paused}
          rate={speed}
          onLoad={handleLoad}
          onProgress={handleProgress}
          onEnd={handleEnd}
          onError={() => { setHasError(true); setIsLoading(false); }}
          style={styles.hiddenVideo}
          progressUpdateInterval={500}
          playInBackground
          ignoreSilentSwitch="ignore"
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon icon={IconKey.back} size={IconsSize.normal} className={{ color: textColor }} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Audio Book</Text>
        <View style={styles.headerBtn} />
      </View>

      {/* Cover Art */}
      <View style={[styles.coverWrapper, { shadowColor: isDark ? '#7B5EC9' : '#000' }]}>
        <Image
          source={{ uri: book.coverImageUrl?.[0] }}
          style={styles.cover}
          resizeMode="cover"
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#7B5EC9" />
          </View>
        )}
      </View>

      {/* Title & Author */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[styles.author, { color: subtextColor }]}>{book.author}</Text>
        {hasError && (
          <Text style={styles.errorText}>Failed to load audio.</Text>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleSeek}
          onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
          style={[styles.progressTrack, { backgroundColor: trackBg }]}
        >
          <LinearGradient
            colors={['#7B5EC9', '#4B71C8', '#22B4D3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progressPercent * 100}%` }]}
          />
          <View
            style={[styles.thumb, { left: `${Math.min(progressPercent * 100, 98)}%` as any }]}
          />
        </TouchableOpacity>
        <View style={styles.timeRow}>
          <Text style={[styles.timeText, { color: subtextColor }]}>{formatTime(position)}</Text>
          <Text style={[styles.timeText, { color: subtextColor }]}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={skipBackward}
          style={[styles.sideBtn, { backgroundColor: controlBg }]}
          activeOpacity={0.7}
        >
          <Icon icon={IconKey.skipBackward} size={IconsSize.lg} className={{ color: textColor }} />
          <Text style={[styles.skipLabel, { color: subtextColor }]}>10</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPaused(p => !p)} activeOpacity={0.85}>
          <LinearGradient
            colors={['#7B5EC9', '#4B71C8', '#22B4D3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playBtn}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Icon
                icon={paused ? IconKey.play : IconKey.pause}
                size={IconsSize.xl}
                className={{ color: 'white' }}
              />
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={skipForward}
          style={[styles.sideBtn, { backgroundColor: controlBg }]}
          activeOpacity={0.7}
        >
          <Icon icon={IconKey.skipForward} size={IconsSize.lg} className={{ color: textColor }} />
          <Text style={[styles.skipLabel, { color: subtextColor }]}>10</Text>
        </TouchableOpacity>
      </View>

      {/* Speed */}
      <View style={styles.speedRow}>
        <TouchableOpacity
          onPress={cycleSpeed}
          style={[styles.speedBtn, { borderColor: isDark ? '#3a3a6a' : '#d0d0e8' }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.speedText, { color: textColor }]}>
            {speed % 1 === 0 ? `${speed}.0x` : `${speed}x`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hiddenVideo: { width: 0, height: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  coverWrapper: {
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  cover: { width: COVER_SIZE, height: COVER_SIZE, borderRadius: 20 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { alignItems: 'center', paddingHorizontal: 24, marginTop: 20, gap: 4 },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center', lineHeight: 26 },
  author: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
  errorText: { color: '#f44336', fontSize: 13, marginTop: 6 },
  progressSection: { paddingHorizontal: 24, marginTop: 28, gap: 8 },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'visible', position: 'relative' },
  progressFill: { height: '100%', borderRadius: 3 },
  thumb: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7B5EC9',
    marginLeft: -8,
    shadowColor: '#7B5EC9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontSize: 12, fontWeight: '500' },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sideBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  skipLabel: { fontSize: 10, fontWeight: '700', marginTop: -4 },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B5EC9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  speedRow: { alignItems: 'center', marginTop: 28 },
  speedBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  speedText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
});
