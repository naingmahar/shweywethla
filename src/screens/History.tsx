import { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { getDownloadedBooks, removeDownloadedBook } from '../services/downloadedBooksDB';
import { IBookDownloaded } from '../types/models/IBook';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNav, RootStackParamList } from '../nav/main.nav';
import { GradientColor } from '../res/color';
import { EsButton } from '../componet/atoms/container/EsButton';
import { GradientContainer } from '../componet/atoms/container/GradientContainer';
import EmptyLibraryScreen from '../componet/atoms/container/EmptyLibraryScreen';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1353250294440692/6466150932';

type Tab = 'Books' | 'Notes' | 'Audio';
type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.History>;

export const History: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [downloadedBooks, setDownloadedBooks] = useState<IBookDownloaded[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('Books');

  const fetchDownloadedBooks = async () => {
    try {
      const books = await getDownloadedBooks();
      setDownloadedBooks(books);
    } catch (error) {
      console.error('Failed to fetch downloaded books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloadedBooks();
  }, []);

  const bannerRef = useRef<BannerAd>(null);
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  const hasAudio = (item: IBookDownloaded) =>
    (item.localAudioPaths && item.localAudioPaths.length > 0) ||
    !!(item.audioUrl && (Array.isArray(item.audioUrl) ? item.audioUrl.length > 0 : item.audioUrl));

  const filteredBooks = downloadedBooks.filter(item => {
    if (activeTab === 'Audio') return hasAudio(item);
    if (activeTab === 'Notes')
      return item.downloadSource === 'Notes' || item.book_type === 'short_note';
    return item.downloadSource !== 'Notes' && item.book_type !== 'short_note';
  });

  const handleDelete = (id: string) => {
    removeDownloadedBook(id)
      .then(() => fetchDownloadedBooks())
      .catch(err => console.log(err));
  };

  const renderItem = ({ item }: { item: IBookDownloaded }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate(MainNav.ADS, item)}>
      <Image style={styles.bookCover} source={{ uri: item.coverImageUrl[0] }} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        {activeTab === 'Audio' && (
          <Text style={styles.audioLabel}>
            {item.localAudioPaths && item.localAudioPaths.length > 0 ? '📥 Offline' : '🌐 Online'}
          </Text>
        )}
      </View>
      <View style={{ justifyContent: 'center' }}>
        <EsButton
          style={{ paddingHorizontal: 20, paddingVertical: 5, backgroundColor: GradientColor[5] }}
          onPress={() => handleDelete(item.id)}
          title="Delete"
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  const TABS: Tab[] = ['Books', 'Notes', 'Audio'];

  return (
    <View style={styles.container}>
      <GradientContainer style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </GradientContainer>

      <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.LEADERBOARD} />

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredBooks.length === 0 ? (
        <EmptyLibraryScreen onBrowsePress={() => navigation.navigate(MainNav.Books, { category: 'Popular' })} />
      ) : (
        <FlatList
          refreshing={loading}
          onRefresh={() => fetchDownloadedBooks()}
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 5,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: GradientColor[1],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  tabTextActive: {
    color: GradientColor[1],
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  audioLabel: {
    fontSize: 12,
    color: GradientColor[1],
    marginTop: 6,
    fontWeight: '600',
  },
});
