import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import firestore, { addDoc, collection, or, orderBy, query } from '@react-native-firebase/firestore';
import { IBook } from '../types/models/IBook';
import { Colors } from '../res/color';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNav, RootStackParamList } from '../nav/main.nav';
import { useRecoilState } from 'recoil';
// import { ISearchKeyword, keywordsState } from '../features/recoilState';
import AppUpdateChecker from '../componet/atoms/AppUpdateChecker';
import { useAtom } from 'jotai';
import { ISearchKeyword, keywordsState } from '../features/jotai/model/books';

const db = firestore();


type BookDetailsScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.Books>;

  const Header = ({searchQuery,setSearchQuery}:{searchQuery:string,setSearchQuery: React.Dispatch<React.SetStateAction<string>>}) => {
    return (
      <View style={headerStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.nav} />
        <Text style={headerStyles.title}>Shwe Ywet Hla</Text>
        <View style={headerStyles.searchContainer}>
          <TextInput
            style={headerStyles.searchInput}
            placeholder="Search books by title or author..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
    );
  };

const BookListScreen = ({ navigation }:BookDetailsScreenProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [keyWords, setKeyWords] = useRecoilState(keywordsState);
  const [keyWords, setKeyWords] = useAtom(keywordsState);
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<ISearchKeyword[]>([]);


const fetchBooksByCategory = async (category:string) => {
  try {
    const booksRef = db.collection('Books');
    const querySnapshot = await booksRef.where('genre', '==', category).get();

    const books:IBook[] = [];
    querySnapshot.forEach(doc => {
      books.push({ id: doc.id, ...doc.data() } as IBook);
    });
    return books;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

  const fetchBooksByTitleAndAuthor = async (keyword:string,field:string) => {
  try {
    const booksRef = db.collection('Books');
    const querySnapshot = await booksRef.where(field, '==', keyword).get();

    console.log('fetchBooksByTitleAndAuthor',keyword,field,querySnapshot.size);
    const books:IBook[] = [];
    querySnapshot.forEach(doc => {
      books.push({ id: doc.id, ...doc.data() } as IBook);
    });
    return books;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

  useEffect(() => {
    const keywordsRef = db.collection('Keywords');
    if(keyWords.length > 0) return;

    // Fetch the data and set up a real-time listener
    const subscriber = keywordsRef.onSnapshot(querySnapshot => {    
      const keywordsList:ISearchKeyword[] = [];
      // console.log("Total keywords: ", querySnapshot.size);
      querySnapshot.forEach(doc => {
        const data = doc.data();
        keywordsList.push({
          id: doc.id,
         ...data
        } as ISearchKeyword);
      });
      setKeyWords(keywordsList);
    }, error => {
      console.error("Error fetching documents: ", error);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => subscriber();
  }, [])

  useEffect(() => {
    let filtered = books;
    
    // Filter by category
    if (selectedCategory !== 'Popular') {
      fetchBooksByCategory(selectedCategory) .then((res)=>{
        setFilteredBooks(res)
      })
    }else{
      setFilteredBooks(books);
    }

    let suggestions:ISearchKeyword[] = [];
    // Filter by search query (title or author)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      suggestions = keyWords.filter(keyword =>
        keyword.id.toLowerCase().includes(query)
      );
      console.log('Search Query ',searchQuery,suggestions);
    }

    setSuggestions(suggestions)

  }, [searchQuery, selectedCategory, books]);


  useEffect(() => {
     const booksRef = db.collection('Books') 
     const q = query(booksRef, orderBy("popularRating","desc"), orderBy("date","desc") ); 
      const subscriber = q.onSnapshot(querySnapshot => {  
      const booksList:IBook[] = [];
      console.log("Total books: ", querySnapshot.size);
      querySnapshot.forEach(doc => {
        const data = doc.data();
        booksList.push({
          id: doc.id,
         ...data
        } as IBook);
      });
      setBooks(booksList);
      setLoading(false);
    }, error => {
      console.error("Error fetching documents: ", error);
      setLoading(false);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => subscriber();
  }, [])
  // useEffect(() => {
  //   // Get a reference to the 'books' collection
  //   const booksRef = db.collection('Books') 
  //                       .orderBy("popularRating","desc")
  //                       .orderBy("createdAt","desc")
  //                       .limit(30);  
  //   // Fetch the data and set up a real-time listener
  //   const subscriber = booksRef.onSnapshot(querySnapshot => {
  //     const booksList:IBook[] = [];
  //     console.log("Total books: ", querySnapshot.size);
  //     querySnapshot.forEach(doc => {
  //       const data = doc.data();
  //       booksList.push({
  //         id: doc.id,
  //        ...data
  //       } as IBook);
  //     });
  //     setBooks(booksList);
  //     setLoading(false);
  //   }, error => {
  //     console.error("Error fetching documents: ", error);
  //     setLoading(false);
  //   });

  //   // Unsubscribe from the listener when the component unmounts
  //   return () => subscriber();
  // }, []);


  useEffect(() => {
    // Get a reference to the 'books' collection
    const booksRef = db.collection('categories').orderBy("label","asc");

    // Fetch the data and set up a real-time listener
    const subscriber = booksRef.onSnapshot(querySnapshot => {
      const categories:{id:string,label:string,key:string}[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        categories.push({
          id: doc.id,
         ...data
        } as {id:string,label:string,key:string});
      });
      setCategories(categories.map(cat=>cat.key));
      setLoading(false);
    }, error => {
      console.error("Error fetching documents: ", error);
      setLoading(false);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => subscriber();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }:{item:IBook}) => (
    <TouchableOpacity style={styles.bookItem} onPress={() => navigation.navigate(MainNav.BookDeatils, item)}>
      <Image
        style={styles.bookCover}
        source={{ uri: item.coverImageUrl[0] }}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        {/* <Text style={styles.bookAuthor}>{item.genre}</Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppUpdateChecker />
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery}  />
      {suggestions.length > 0 && searchQuery.length > 0 ? (
        <View style={styles.categoriesContainer}>
          <FlatList
            style={styles.suggestionsList}
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                fetchBooksByTitleAndAuthor(item.id,item.type).then((res)=>{
                  console.log('fetchBooksByTitleAndAuthor Result ',res);
                  setFilteredBooks(res)
                  // setSearchQuery(item.id)
                  setSuggestions([])
                })
              }} style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
      <View style={styles.categoriesContainer}>
        <FlatList
          data={['Popular', ...categories]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton
              ]}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.selectedCategoryText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
        </View>)}
      
      <FlatList
        data={filteredBooks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};


const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.nav,
    padding: 16,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
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
  suggestionsContainer: {
    position: 'absolute',
    top: 100,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    zIndex: 1,
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
  searchBarContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    lineHeight:40,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#777',
    lineHeight:30,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007BFF',
    marginTop: 8,
  },
});

export default BookListScreen;