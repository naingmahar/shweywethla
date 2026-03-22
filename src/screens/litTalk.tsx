import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { GradientColor } from '../res/color';
import { MainNav, RootStackParamList } from '../nav/main.nav';

// ── Types ──────────────────────────────────────────────────────────────────────
type Author = {
  id: string;
  name: string;
  bio: string;
  image: string[];
  createdAt: number;
};

type Album = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  coverImage: string[];
  createdAt: number;
};

type Episode = {
  id: string;
  albumId: string;
  authorId: string;
  title: string;
  description: string;
  duration: string;
  audioUrl: string[];
  youtubeId: string;
  youtubeUrl: string;
  createdAt: number;
};

type View3 = 'authors' | 'albums' | 'episodes';

// ── Author card ────────────────────────────────────────────────────────────────
const AuthorCard = ({ item, onPress }: { item: Author; onPress: () => void }) => {
  const thumb = item.image?.[0];
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      {thumb ? (
        <Image source={{ uri: thumb }} style={styles.roundThumb} />
      ) : (
        <View style={[styles.roundThumb, styles.placeholderCircle]}>
          <Text style={styles.placeholderText}>{item.name?.charAt(0) ?? '?'}</Text>
        </View>
      )}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub} numberOfLines={2}>{item.bio}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

// ── Album card ─────────────────────────────────────────────────────────────────
const AlbumCard = ({ item, onPress }: { item: Album; onPress: () => void }) => {
  const cover = item.coverImage?.[0];
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      {cover ? (
        <Image source={{ uri: cover }} style={styles.squareThumb} />
      ) : (
        <View style={[styles.squareThumb, styles.placeholderSquare]}>
          <Text style={styles.thumbIcon}>🎙️</Text>
        </View>
      )}
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {!!item.description && (
          <Text style={styles.cardSub} numberOfLines={2}>{item.description}</Text>
        )}
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

// ── Episode card ───────────────────────────────────────────────────────────────
const EpisodeCard = ({
  item,
  index,
  episodes,
  album,
  author,
}: {
  item: Episode;
  index: number;
  episodes: Episode[];
  album: Album | null;
  author: Author | null;
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const hasAudio = item.audioUrl?.length > 0;

  const toBookParams = (ep: Episode) => ({
    id: ep.id,
    title: ep.title,
    author: author?.name ?? '',
    audioUrl: ep.audioUrl,
    coverImageUrl: album?.coverImage ?? [],
    price: '',
    language: '',
    genre: '',
    description: ep.description ?? '',
    publishedDate: '',
    numberOfPages: '',
  });

  const handlePress = () => {
    if (!hasAudio) return;
    navigation.navigate(MainNav.ADS, {
      ...toBookParams(item),
      _adDestination: 'AudioPlayer',
      _episodeList: episodes.map(toBookParams),
      _episodeIndex: index,
    } as any);
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handlePress}>
      <View style={[styles.squareThumb, styles.placeholderSquare]}>
        <Text style={styles.thumbIcon}>{hasAudio ? '▶️' : '🎙️'}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        {!!item.description && (
          <Text style={styles.cardSub} numberOfLines={1}>{item.description}</Text>
        )}
        {!!item.duration && (
          <Text style={styles.durationText}>⏱ {item.duration}</Text>
        )}
        {!hasAudio && (
          <Text style={styles.comingSoon}>မကြာမီ တင်မည်</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ── Main screen ────────────────────────────────────────────────────────────────
const LitTalkScreen = () => {
  const [view, setView] = useState<View3>('authors');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch authors once
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    firestore()
      .collection('lite_talk_authors')
      .orderBy('createdAt', 'asc')
      .get()
      .then(snap => { if (isMounted) setAuthors(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Author, 'id'>) }))); })
      .catch(err => console.error('LitTalk authors error:', err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  // Fetch albums when author selected
  const openAuthor = (author: Author) => {
    setSelectedAuthor(author);
    setView('albums');
    setLoading(true);
    firestore()
      .collection('lite_talk_albums')
      .where('authorId', '==', author.id)
      .get()
      .then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Album, 'id'>) }));
        data.sort((a, b) => a.createdAt - b.createdAt);
        setAlbums(data);
      })
      .catch(err => console.error('LitTalk albums error:', err))
      .finally(() => setLoading(false));
  };

  // Fetch episodes when album selected
  const openAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setView('episodes');
    setLoading(true);
    firestore()
      .collection('lite_talk_episodes')
      .where('albumId', '==', album.id)
      .get()
      .then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Episode, 'id'>) }));
        data.sort((a, b) => a.createdAt - b.createdAt);
        setEpisodes(data);
      })
      .catch(err => console.error('LitTalk episodes error:', err))
      .finally(() => setLoading(false));
  };

  const goBack = () => {
    if (view === 'episodes') setView('albums');
    else if (view === 'albums') setView('authors');
  };

  // Header title
  const headerTitle = view === 'authors' ? 'Lit Talk'
    : view === 'albums' ? selectedAuthor?.name ?? 'Albums'
    : selectedAlbum?.title ?? 'Episodes';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7B5EC9', '#4B71C8', '#22B4D3']}
        locations={[0.0, 0.5, 1.0]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        {view !== 'authors' ? (
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backBtn} onPress={goBack}>
              <Text style={styles.backBtnText}>‹ Back</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle} numberOfLines={1}>{headerTitle}</Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitle}>Lit Talk</Text>
            <Text style={styles.headerSub}>မြန်မာစာပေ ဆွေးနွေးခန်း</Text>
          </>
        )}
      </LinearGradient>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={GradientColor[1]} />
        </View>
      ) : view === 'authors' ? (
        <FlatList
          data={authors}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <AuthorCard item={item} onPress={() => openAuthor(item)} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<Text style={styles.sectionLabel}>Authors</Text>}
          ListEmptyComponent={<Text style={styles.emptyText}>မရှိသေးပါ</Text>}
        />
      ) : view === 'albums' ? (
        <FlatList
          data={albums}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <AlbumCard item={item} onPress={() => openAlbum(item)} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<Text style={styles.sectionLabel}>Albums</Text>}
          ListEmptyComponent={<Text style={styles.emptyText}>မရှိသေးပါ</Text>}
        />
      ) : (
        <FlatList
          data={episodes}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <EpisodeCard item={item} index={index} episodes={episodes} album={selectedAlbum} author={selectedAuthor} />
          )}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              {selectedAlbum?.coverImage?.[0] && (
                <Image source={{ uri: selectedAlbum.coverImage[0] }} style={styles.albumBanner} />
              )}
              {!!selectedAlbum?.description && (
                <Text style={styles.albumDesc}>{selectedAlbum.description}</Text>
              )}
              <Text style={styles.sectionLabel}>Episodes</Text>
            </>
          }
          ListEmptyComponent={<Text style={styles.emptyText}>မကြာမီ ထပ်မံတင်ဆက်မည်</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  // Header
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  backBtn: { paddingRight: 12 },
  backBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // List
  list: { padding: 16 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10, marginTop: 4 },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 30, fontSize: 14 },

  // Shared card
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#222' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 3, lineHeight: 17 },
  arrow: { fontSize: 28, color: '#ccc', fontWeight: '300' },
  durationText: { fontSize: 11, color: GradientColor[2], marginTop: 4, fontWeight: '600' },
  comingSoon: { fontSize: 11, color: '#bbb', marginTop: 4, fontStyle: 'italic' },

  // Thumbnails
  roundThumb: { width: 60, height: 60, borderRadius: 30, marginRight: 14 },
  squareThumb: { width: 70, height: 70, borderRadius: 10, marginRight: 14 },
  placeholderCircle: {
    backgroundColor: GradientColor[1] + '33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderSquare: {
    backgroundColor: GradientColor[2] + '22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: 22, fontWeight: '700', color: GradientColor[1] },
  thumbIcon: { fontSize: 24 },

  // Album detail banner
  albumBanner: { width: '100%', height: 180, borderRadius: 14, marginBottom: 12 },
  albumDesc: { fontSize: 13, color: '#555', lineHeight: 20, marginBottom: 12 },
});

export default LitTalkScreen;
