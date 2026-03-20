import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useAtom } from 'jotai';

import { darkModeAtom } from '../../features/jotai/model/darkMode';
import { Icon, IconKey, IconsSize } from '../../componet/atoms/icons';
import { IBook, IBookDownloaded } from '../../types/models/IBook';
import { MainNav } from '../../nav/main.nav';

type AudioAlbumRoute = RouteProp<{ AudioAlbum: IBook }, 'AudioAlbum'>;

export const AudioAlbumScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<AudioAlbumRoute>();
  const book = route.params;

  const [isDark] = useAtom(darkModeAtom);

  // Use local audio paths if downloaded, otherwise use remote audioUrl
  const localPaths = (book as IBookDownloaded).localAudioPaths;
  const parts: string[] = (localPaths && localPaths.length > 0)
    ? localPaths
    : Array.isArray(book.audioUrl)
    ? book.audioUrl
    : book.audioUrl
    ? [book.audioUrl]
    : [];

  const bg = isDark ? '#0f0f1e' : '#f8f8fc';
  const cardBg = isDark ? '#1a1a2e' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a2e';
  const subtextColor = isDark ? '#9999bb' : '#777788';
  const separatorColor = isDark ? '#2a2a4a' : '#e8e8f0';

  const handlePlayPart = (partUrl: string) => {
    // Navigate through ADS screen before playing each individual part
    navigation.navigate(MainNav.ADS, {
      ...book,
      audioUrl: partUrl,
      _adDestination: 'AudioPlayer',
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon icon={IconKey.back} size={IconsSize.normal} className={{ color: textColor }} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Audio Book</Text>
        <View style={styles.headerBtn} />
      </View>

      {/* Book Info Card */}
      <View style={[styles.bookCard, { backgroundColor: cardBg }]}>
        <Image
          source={{ uri: book.coverImageUrl?.[0] }}
          style={styles.cover}
          resizeMode="cover"
        />
        <View style={styles.bookInfo}>
          <Text style={[styles.bookTitle, { color: textColor }]} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={[styles.bookAuthor, { color: subtextColor }]} numberOfLines={1}>
            {book.author}
          </Text>
          <View style={styles.partBadge}>
            <Text style={styles.partBadgeText}>{parts.length} Parts</Text>
          </View>
        </View>
      </View>

      {/* Parts List */}
      <FlatList
        data={parts}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
        )}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.partRow}
            onPress={() => handlePlayPart(item)}
            activeOpacity={0.7}
          >
            {/* Part number circle */}
            <LinearGradient colors={['#7B5EC9', '#4B71C8']} style={styles.partIndex}>
              <Text style={styles.partIndexText}>{index + 1}</Text>
            </LinearGradient>

            {/* Part title & subtitle */}
            <View style={styles.partMeta}>
              <Text style={[styles.partTitle, { color: textColor }]}>
                Part {index + 1}
              </Text>
              <Text style={[styles.partSubtitle, { color: subtextColor }]} numberOfLines={1}>
                {book.title}
              </Text>
            </View>

            {/* Play button */}
            <TouchableOpacity
              onPress={() => handlePlayPart(item)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#7B5EC9', '#22B4D3']} style={styles.playGradient}>
                <Icon icon={IconKey.play} size={IconsSize.sm} className={{ color: '#fff' }} />
              </LinearGradient>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
  bookCard: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cover: { width: 80, height: 110, borderRadius: 10 },
  bookInfo: { flex: 1, justifyContent: 'center', gap: 6 },
  bookTitle: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  bookAuthor: { fontSize: 13, fontWeight: '500' },
  partBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#7B5EC9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  partBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  separator: { height: 1, marginHorizontal: 0 },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  partIndex: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partIndexText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  partMeta: { flex: 1, gap: 3 },
  partTitle: { fontSize: 15, fontWeight: '700' },
  partSubtitle: { fontSize: 12 },
  playGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B5EC9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
});
