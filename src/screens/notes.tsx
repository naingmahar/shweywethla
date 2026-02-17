import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import firestore, { orderBy, query, where } from '@react-native-firebase/firestore';
import { IBook } from '../types/models/IBook';
import { Colors } from '../res/color';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNav, RootStackParamList } from '../nav/main.nav';
import AppUpdateChecker from '../componet/atoms/AppUpdateChecker';
import { ISearchKeyword } from '../features/jotai/model/books';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, IconKey, IconsSize } from '../componet/atoms/icons';
import EmptyState from '../componet/atoms/container/EmptyState';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import { useDashboardContext } from '../context/DashboardContext';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1353250294440692/4454358397';
const db = firestore();

type NotesScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.Notes>;

const Header = ({
  searchQuery,
  setSearchQuery,
  isSearch,
  setIsSearch,
}: {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isSearch: boolean;
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <LinearGradient
      colors={['#7B5EC9', '#4B71C8', '#22B4D3']}
      locations={[0.0, 0.5, 1.0]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[headerStyles.container, { flexDirection: 'row' }]}>
      {!isSearch && <Text style={[headerStyles.title, { flex: 1 }]}>မှတ်စုများ</Text>}
      {!isSearch && (
        <TouchableOpacity onPress={() => setIsSearch(true)}>
          <Icon icon={IconKey.search} size={IconsSize.lg} className={{ color: '#fff' }} />
        </TouchableOpacity>
      )}
      {isSearch && (
        <View style={[headerStyles.searchContainer, { flex: 1 }]}>
          <TextInput
            style={headerStyles.searchInput}
            placeholder="မှတ်စုရှာရန်..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}
    </LinearGradient>
  );
};

const fetchNotesByCategory = async (category: string) => {
  try {
    const notesRef = db.collection('Notes');
    const querySnapshot = await notesRef.where('genre', '==', category).get();

    const notes: IBook[] = [];
    querySnapshot.forEach(doc => {
      notes.push({ id: doc.id, ...doc.data() } as IBook);
    });

    notes.sort((a, b) => {
      if (!a.premium) return 1;
      if (!b.premium) return -1;
      if (!a.premium && !b.premium) return 0;
      return 0;
    });

    return notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

const fetchNotesByTitleAndAuthor = async (keyword: string, field: string) => {
  try {
    const notesRef = db.collection('Notes');
    const querySnapshot = await notesRef.where(field, '==', keyword).get();
    const notes: IBook[] = [];
    querySnapshot.forEach(doc => {
      notes.push({ id: doc.id, ...doc.data() } as IBook);
    });
    return notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

const { width } = Dimensions.get('window');
const GAP = 10;
const ITEM_WIDTH = (width - GAP * 5) / 4;

const NotesScreen = ({ navigation, route }: NotesScreenProps) => {
  // Use cached data from context
  const { notes: cachedNotes, categories: cachedCategories, keywords: cachedKeywords } = useDashboardContext();

  const [notes, setNotes] = useState<IBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [filteredNotes, setFilteredNotes] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<ISearchKeyword[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  const paramCategory = route.params ? route.params.category : null;

  useEffect(() => {
    if (selectedCategory !== 'Popular') {
      fetchNotesByCategory(selectedCategory).then(res => {
        setFilteredNotes(res);
      });
    } else {
      setFilteredNotes(notes);
    }

    let suggestionsList: ISearchKeyword[] = [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      suggestionsList = cachedKeywords.filter(keyword => keyword.id.toLowerCase().includes(q));
    }

    setSuggestions(suggestionsList);
  }, [searchQuery, selectedCategory, notes, cachedKeywords]);

  useEffect(() => {
    setNotes([]);
    setFilteredNotes([]);
    if (paramCategory) setSelectedCategory(paramCategory);

    const notesRef = db.collection('Notes');
    const whereQuery = paramCategory ? where('genre', '==', paramCategory) : where('premium_type', '==', 'html');
    const q = query(notesRef, whereQuery, orderBy('popularRating', 'desc'), orderBy('date', 'desc'));

    const subscriber = q.onSnapshot(
      querySnapshot => {
        const notesList: IBook[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          notesList.push({
            id: doc.id,
            ...data,
          } as IBook);
        });
        setNotes(notesList);
        setLoading(false);
      },
      error => {
        console.log('Error fetching notes: ', error);
        setLoading(false);
      },
    );

    return () => subscriber();
  }, [paramCategory]);

  const bannerRef = useRef<BannerAd>(null);

  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: IBook }) => {
    const isComingSoon = !item.premium;

    return (
      <TouchableOpacity
        style={[styles.noteItem, { width: ITEM_WIDTH }]}
        disabled={isComingSoon}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(MainNav.BookDeatils, { ...item, fromTab: 'Notes' })}>

        <Image
            style={[styles.noteCover, isComingSoon ? { opacity: 0.5, filter: [{grayscale: 1}] } as any : {}]}
            source={{ uri: item.coverImageUrl[0] }}
        />

        <View style={styles.noteInfo}>
          <Text style={[styles.noteTitle, isComingSoon && { color: '#999' }]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>

        {isComingSoon && (
          <View style={styles.comingSoonOverlay}>
             <LinearGradient
                colors={['#7B5EC9', '#22B4D3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.diagonalBanner}>
                <Text style={styles.diagonalText}>SOON</Text>
             </LinearGradient>

             <View style={styles.glassBadge}>
                <Icon icon={IconKey.clock} size={IconsSize.xs} className={{ color: '#333' }} />
                <Text style={styles.glassText}>Coming</Text>
             </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} isSearch={isSearch} setIsSearch={setIsSearch} />
      <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.LEADERBOARD} />

      {suggestions.length > 0 && searchQuery.length > 0 ? (
        <View style={styles.categoriesContainer}>
          <FlatList
            style={styles.suggestionsList}
            data={suggestions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  fetchNotesByTitleAndAuthor(item.id, item.type).then(res => {
                    setFilteredNotes(res);
                    setSuggestions([]);
                  });
                }}
                style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View style={styles.categoriesContainer}>
          <FlatList
            data={['Popular', ...cachedCategories]}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(item);
                  setIsSearch(false);
                }}>
                <LinearGradient
                  colors={selectedCategory === item ? ['#7B5EC9', '#4B71C8', '#22B4D3'] : ['#E0E0E0', '#E0E0E0', '#E0E0E0']}
                  locations={[0.0, 0.5, 1.0]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.categoryButton, selectedCategory === item && styles.selectedCategoryButton]}>
                  <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>{item}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {filteredNotes.length === 0 && <EmptyState />}

      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={4}
        onScroll={() => setIsSearch(false)}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.nav,
    padding: 16,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
  },
  suggestionsList: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 2,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    elevation: 1,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.nav,
  },
  categoryText: {
    color: '#333',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: 'white',
  },
  noteItem: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  noteCover: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  noteInfo: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  noteTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#222',
    lineHeight: 13,
    height: 26,
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    paddingHorizontal: GAP,
    gap: GAP,
    marginBottom: GAP,
  },
  comingSoonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  diagonalBanner: {
    position: 'absolute',
    top: 8,
    right: -20,
    width: 80,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    paddingVertical: 2,
    elevation: 3,
  },
  diagonalText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  glassBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    marginTop: 20,
  },
  glassText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#333',
    marginLeft: 4,
  },
});

export default NotesScreen;
