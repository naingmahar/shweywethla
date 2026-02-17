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

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1353250294440692/1557238259';
const db = firestore();

type BookListScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.Books>;

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
      {/* <StatusBar barStyle="dark-content" backgroundColor={Colors.nav} /> */}
      {!isSearch && <Text style={[headerStyles.title, { flex: 1 }]}>Shwe Ywet Hla</Text>}
      {!isSearch && (
        <TouchableOpacity onPress={() => setIsSearch(true)}>
          <Icon icon={IconKey.search} size={IconsSize.lg} className={{ color: '#fff' }} />
        </TouchableOpacity>
      )}
      {isSearch && (
        <View style={[headerStyles.searchContainer, { flex: 1 }]}>
          <TextInput
            style={headerStyles.searchInput}
            placeholder="Search books by title or author..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}
    </LinearGradient>
  );
};

const fetchBooksByCategory = async (category: string) => {
  try {
    const booksRef = db.collection('Books');
    const querySnapshot = await booksRef.where('genre', '==', category).get();

    const books: IBook[] = [];
    querySnapshot.forEach(doc => {
      books.push({ id: doc.id, ...doc.data() } as IBook);
    });

    books.sort((a, b) => {
      if(!a.premium) return 1;
      if(!b.premium) return -1
      if(!a.premium && !b.premium) return 0;

      return 0
    } );//sort by premiun

    return books;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

const fetchBooksByTitleAndAuthor = async (keyword: string, field: string) => {
  try {
    const booksRef = db.collection('Books');
    const querySnapshot = await booksRef.where(field, '==', keyword).get();
    const books: IBook[] = [];
    querySnapshot.forEach(doc => {
      books.push({ id: doc.id, ...doc.data() } as IBook);
    });
    return books;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};

const { width } = Dimensions.get('window');
const GAP = 10;
const ITEM_WIDTH = (width - GAP * 5) / 4;

const BookListScreen = ({ navigation, route }: BookListScreenProps) => {
  // Use cached data from context
  const { categories: cachedCategories, keywords: cachedKeywords } = useDashboardContext();

  const [books, setBooks] = useState<IBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<ISearchKeyword[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  const paramCategory = route.params ? route.params.category : null;

  useEffect(() => {
    if (selectedCategory !== 'Popular') {
      fetchBooksByCategory(selectedCategory).then(res => {
        setFilteredBooks(res);
      });
    } else {
      setFilteredBooks(books);
    }

    let suggestionsList: ISearchKeyword[] = [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      suggestionsList = cachedKeywords.filter(keyword => keyword.id.toLowerCase().includes(q));
    }

    setSuggestions(suggestionsList);
  }, [searchQuery, selectedCategory, books, cachedKeywords]);

  useEffect(() => {
    setBooks([]);
    setFilteredBooks([]);
    if (paramCategory) setSelectedCategory(paramCategory);
    const booksRef = db.collection('Books');
    const whereQuery = paramCategory ? where('genre', '==', paramCategory) : where("premium_type", "==", "html");
    const q = query(booksRef, whereQuery, orderBy('popularRating', 'desc'), orderBy('date', 'desc'));
    const subscriber = q.onSnapshot(
      querySnapshot => {
        const booksList: IBook[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          booksList.push({
            id: doc.id,
            ...data,
          } as IBook);
        });
        setBooks(booksList);
        setLoading(false);
      },
      error => {
        console.log('Error fetching documents: ', error);
        setLoading(false);
      },
    );

    return () => subscriber();
  }, [paramCategory]);

  const bannerRef = useRef<BannerAd>(null);
  
    // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
    // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
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
        style={[styles.bookItem, { width: ITEM_WIDTH }]}
        disabled={isComingSoon}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(MainNav.BookDeatils, { ...item, fromTab: 'Books' })}>
        
        {/* Book Cover */}
        <Image 
            style={[styles.bookCover, isComingSoon ? { opacity: 0.5, filter: [{grayscale: 1}] } as any : {}]} 
            source={{ uri: item.coverImageUrl[0] }} 
        />
        
        {/* Book Title */}
        <View style={styles.bookInfo}>
          <Text style={[styles.bookTitle, isComingSoon && { color: '#999' }]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>

        {/* MODERN Coming Soon Overlay */}
        {isComingSoon && (
          <View style={styles.comingSoonOverlay}>
             <LinearGradient
                colors={['#7B5EC9', '#22B4D3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.diagonalBanner}>
                <Text style={styles.diagonalText}>SOON</Text>
             </LinearGradient>
             
             {/* Subtle Glass Badge */}
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
                  fetchBooksByTitleAndAuthor(item.id, item.type).then(res => {
                    setFilteredBooks(res);
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

      {filteredBooks.length === 0 && <EmptyState />}

      <FlatList
        data={filteredBooks}
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
  bookItem: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 12, // Smoother corners
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  bookCover: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  bookInfo: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  bookTitle: {
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
  // --- Modernized UI Layer ---
  comingSoonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Frosted look
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
    marginTop: 20, // offset from center
  },
  glassText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#333',
    marginLeft: 4,
  },
});

export default BookListScreen;