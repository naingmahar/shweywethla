// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, TextInput, StatusBar, Dimensions } from 'react-native';
// import firestore, { addDoc, collection, or, orderBy, query, where } from '@react-native-firebase/firestore';
// import { IBook } from '../types/models/IBook';
// import { Colors } from '../res/color';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { MainNav, RootStackParamList } from '../nav/main.nav';
// import { useRecoilState } from 'recoil';
// // import { ISearchKeyword, keywordsState } from '../features/recoilState';
// import AppUpdateChecker from '../componet/atoms/AppUpdateChecker';
// import { useAtom } from 'jotai';
// import { ISearchKeyword, keywordsState } from '../features/jotai/model/books';
// import { RenderCategory } from './dashboard';
// import LinearGradient from 'react-native-linear-gradient';
// import { Icon, IconKey, IconsSize } from '../componet/atoms/icons';

// const db = firestore();


// type BookDetailsScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.Books>;

  

// const BookListScreen = ({ navigation }:BookDetailsScreenProps) => {
//   const [categories, setCategories] = useState<string[]>([]);
//   const [books, setBooks] = useState<IBook[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   // const [keyWords, setKeyWords] = useRecoilState(keywordsState);
//   const [keyWords, setKeyWords] = useAtom(keywordsState);
//   const [selectedCategory, setSelectedCategory] = useState('Popular');
//   const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [suggestions, setSuggestions] = useState<ISearchKeyword[]>([]);
//   const [isSearch,setIsSearch] = useState(false);


//   const Header = ({searchQuery,setSearchQuery}:{searchQuery:string,setSearchQuery: React.Dispatch<React.SetStateAction<string>>}) => {
//     return (
//       <LinearGradient
//         colors={['#7B5EC9', '#4B71C8','#22B4D3' ]} 
//         locations={[0.0, 0.5, 1.0]}
//         start={{ x: 0, y: 0 }} // Gradient start position
//         end={{ x: 1, y: 1 }}  
//         style={[headerStyles.container,{flexDirection:"row"}]}>
//         <StatusBar barStyle="dark-content" backgroundColor={Colors.nav} />
//         {!isSearch && <Text style={[headerStyles.title,{flex:1}]}>Shwe Ywet Hla</Text>}
//         {!isSearch && <TouchableOpacity onPress={()=>setIsSearch(true)}><Icon icon={IconKey.search} size={IconsSize.lg} className={{color:"#fff"}} /></TouchableOpacity>}
//         {isSearch &&<View style={[headerStyles.searchContainer,{flex:1}]}>
//           <TextInput
//             style={headerStyles.searchInput}
//             placeholder="Search books by title or author..."
//             placeholderTextColor="#A0A0A0"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>}
//       </LinearGradient>
//     );
//   };


// const fetchBooksByCategory = async (category:string) => {
//   try {
//     const booksRef = db.collection('Books');
//     const querySnapshot = await booksRef.where('genre', '==', category).get();

//     const books:IBook[] = [];
//     querySnapshot.forEach(doc => {
//       books.push({ id: doc.id, ...doc.data() } as IBook);
//     });
//     return books;
//   } catch (error) {
//     console.error("Error fetching documents:", error);
//     return [];
//   }
// };

//   const fetchBooksByTitleAndAuthor = async (keyword:string,field:string) => {
//   try {
//     const booksRef = db.collection('Books');
//     const querySnapshot = await booksRef.where(field, '==', keyword).get();

//     console.log('fetchBooksByTitleAndAuthor',keyword,field,querySnapshot.size);
//     const books:IBook[] = [];
//     querySnapshot.forEach(doc => {
//       books.push({ id: doc.id, ...doc.data() } as IBook);
//     });
//     return books;
//   } catch (error) {
//     console.error("Error fetching documents:", error);
//     return [];
//   }
// };

//   useEffect(() => {
//     const keywordsRef = db.collection('Keywords');
//     if(keyWords.length > 0) return;

//     // Fetch the data and set up a real-time listener
//     const subscriber = keywordsRef.onSnapshot(querySnapshot => {    
//       const keywordsList:ISearchKeyword[] = [];
//       // console.log("Total keywords: ", querySnapshot.size);
//       querySnapshot.forEach(doc => {
//         const data = doc.data();
//         keywordsList.push({
//           id: doc.id,
//          ...data
//         } as ISearchKeyword);
//       });
//       setKeyWords(keywordsList);
//     }, error => {
//       console.error("Error fetching documents: ", error);
//     });

//     // Unsubscribe from the listener when the component unmounts
//     return () => subscriber();
//   }, [])

//   useEffect(() => {
//     let filtered = books;
    
//     // Filter by category
//     if (selectedCategory !== 'Popular') {
//       fetchBooksByCategory(selectedCategory) .then((res)=>{
//         setFilteredBooks(res)
//       })
//     }else{
//       setFilteredBooks(books);
//     }

//     let suggestions:ISearchKeyword[] = [];
//     // Filter by search query (title or author)
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       suggestions = keyWords.filter(keyword =>
//         keyword.id.toLowerCase().includes(query)
//       );
//       console.log('Search Query ',searchQuery,suggestions);
//     }

//     setSuggestions(suggestions)

//   }, [searchQuery, selectedCategory, books]);


//   useEffect(() => {
//      const booksRef = db.collection('Books') 
//      const q = query(booksRef, orderBy("popularRating","desc"), orderBy("date","desc") ); 
//       const subscriber = q.onSnapshot(querySnapshot => {  
//       const booksList:IBook[] = [];
//       console.log("Total books: ", querySnapshot.size);
//       querySnapshot.forEach(doc => {
//         const data = doc.data();
//         booksList.push({
//           id: doc.id,
//          ...data
//         } as IBook);
//       });
//       setBooks(booksList);
//       setLoading(false);
//     }, error => {
//       console.error("Error fetching documents: ", error);
//       setLoading(false);
//     });

//     // Unsubscribe from the listener when the component unmounts
//     return () => subscriber();
//   }, [])

//   useEffect(() => {
//     // Get a reference to the 'books' collection
//     const booksRef = db.collection('categories').orderBy("label","asc");

//     // Fetch the data and set up a real-time listener
//     const subscriber = booksRef.onSnapshot(querySnapshot => {
//       const categories:{id:string,label:string,key:string}[] = [];
//       querySnapshot.forEach(doc => {
//         const data = doc.data();
//         categories.push({
//           id: doc.id,
//          ...data
//         } as {id:string,label:string,key:string});
//       });
//       setCategories(categories.map(cat=>cat.key));
//       setLoading(false);
//     }, error => {
//       console.error("Error fetching documents: ", error);
//       setLoading(false);
//     });

//     // Unsubscribe from the listener when the component unmounts
//     return () => subscriber();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   const renderItem = ({ item }:{item:IBook}) => (
//     <TouchableOpacity style={[styles.bookItem,{ width: ITEM_WIDTH }]} onPress={() => navigation.navigate(MainNav.BookDeatils, item)}>
//       <Image
//         style={styles.bookCover}
//         source={{ uri: item.coverImageUrl[0] }}
//       />
//       <View style={styles.bookInfo}>
//         <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
//         {/* <Text style={styles.bookAuthor}>{item.author}</Text> */}
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <AppUpdateChecker />
//       <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery}  />
//       {suggestions.length > 0 && searchQuery.length > 0 ? (
//         <View style={styles.categoriesContainer}>
//           <FlatList
//             style={styles.suggestionsList}
//             data={suggestions}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <TouchableOpacity onPress={() => {
//                 fetchBooksByTitleAndAuthor(item.id,item.type).then((res)=>{
//                   console.log('fetchBooksByTitleAndAuthor Result ',res);
//                   setFilteredBooks(res)
//                   // setSearchQuery(item.id)
//                   setSuggestions([])
//                 })
//               }} style={styles.suggestionItem}>
//                 <Text style={styles.suggestionText}>{item.id}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       ) : (
//       <View style={styles.categoriesContainer}>
//         <FlatList
//           data={['Popular', ...categories]}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={(item) => item}
//           // renderItem={RenderCategory} 
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => {
//                 setSelectedCategory(item)
//                 setIsSearch(false)
//               }}
              
//             >
//               <LinearGradient
//                 colors={selectedCategory === item ? ['#7B5EC9', '#4B71C8','#22B4D3' ] : ['#E0E0E0', '#E0E0E0','#E0E0E0' ]} 
//                 locations={[0.0, 0.5, 1.0]}
//                 start={{ x: 0, y: 0 }} // Gradient start position
//                 end={{ x: 1, y: 1 }}  
//                style={[
//                 styles.categoryButton,
//                 selectedCategory === item && styles.selectedCategoryButton
//               ]}>
//                     <Text style={[
//                                     styles.categoryText,
//                                     selectedCategory === item && styles.selectedCategoryText
//                                   ]}>
//                                     {item}
//                                   </Text>
//                 </LinearGradient>
              
//             </TouchableOpacity>
//           )}

//         />
//       </View>)}
      
//       <FlatList
//         data={filteredBooks}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         numColumns={4}
//         columnWrapperStyle={styles.columnWrapper}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// };


// const headerStyles = StyleSheet.create({
//   container: {
//     backgroundColor: Colors.nav,
//     padding: 16,
//     paddingTop: 20,
//     // borderBottomLeftRadius: 20,
//     // borderBottomRightRadius: 20,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     // marginBottom: 16,
//     // textAlign: 'center',
//   },
//   searchContainer: {
//     backgroundColor: 'white',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#333',
//   },
// });

// const { width } = Dimensions.get('window');
// const GAP = 10;
// // Logic: Calculate item width based on 4 columns and margins
// const ITEM_WIDTH = (width - (GAP * 5)) / 4;


// const styles = StyleSheet.create({
//   suggestionsContainer: {
//     position: 'absolute',
//     top: 100,
//     left: 10,
//     right: 10,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     elevation: 5,
//     zIndex: 1,
//   },
//   suggestionsList: {
//     backgroundColor: 'white',
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8,
//     marginHorizontal: 10,
//     marginTop: 10,
//     elevation: 2,
//   },
//   suggestionItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   suggestionText: {
//     fontSize: 16,
//     color: '#333',
//   },
  
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     padding: 10,
//   },
//   searchBarContainer: {
//     backgroundColor: 'white',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//     elevation: 2,
//   },
//   searchInput: {
//     height: 40,
//     backgroundColor: '#F0F0F0',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     fontSize: 16,
//     color: '#333',
//   },
//   categoriesContainer: {
//     paddingVertical: 10,
//     paddingHorizontal: 5,
//     backgroundColor: 'white',
//     // height:100,
//     elevation: 1,
//   },
//   categoryButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#E0E0E0',
//     marginHorizontal: 5,
//   },
//   selectedCategoryButton: {
//     backgroundColor: Colors.nav,
//   },
//   categoryText: {
//     color: '#333',
//     fontWeight: '600',
//   },
//   selectedCategoryText: {
//     color: 'white',
//   },
//   bookItem: {
//     // flex:1,
//     flexDirection: 'column',
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 5,
//     // marginBottom: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//   },
//   bookCover: {
//     width: 80,
//     height: 120,
//     borderRadius: 6,
//     marginRight: 15,
//   },
//   bookInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   bookTitle: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#333',
//     lineHeight:20,
//     marginBottom: 4,
//     width:"100%",
//     overflow:"hidden"
//   },
//   bookAuthor: {
//     fontSize: 10,
//     color: '#777',
//     lineHeight:30,
//   },
//   bookPrice: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#007BFF',
//     marginTop: 8,
//   },
//   columnWrapper: {
//     justifyContent: 'flex-start',
//     paddingHorizontal: GAP,
//     gap: GAP, // Requires RN 0.71+
//     marginBottom: GAP,
//   },
// });



// export default BookListScreen;





// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   TouchableOpacity,
//   TextInput,
//   StatusBar,
//   Dimensions,
// } from 'react-native';
// import firestore, { orderBy, query, where } from '@react-native-firebase/firestore';
// import { IBook } from '../types/models/IBook';
// import { Colors } from '../res/color';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { MainNav, RootStackParamList } from '../nav/main.nav';
// import AppUpdateChecker from '../componet/atoms/AppUpdateChecker';
// import { useAtom } from 'jotai';
// import { ISearchKeyword, keywordsState } from '../features/jotai/model/books';
// import LinearGradient from 'react-native-linear-gradient';
// import { Icon, IconKey, IconsSize } from '../componet/atoms/icons';
// import EmptyState from '../componet/atoms/container/EmptyState';

// const db = firestore();

// type BookListScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.Books>;

// const Header = ({
//   searchQuery,
//   setSearchQuery,
//   isSearch,
//   setIsSearch,
// }: {
//   searchQuery: string;
//   setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
//   isSearch: boolean;
//   setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   return (
//     <LinearGradient
//       colors={['#7B5EC9', '#4B71C8', '#22B4D3']}
//       locations={[0.0, 0.5, 1.0]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={[headerStyles.container, { flexDirection: 'row' }]}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.nav} />
//       {!isSearch && <Text style={[headerStyles.title, { flex: 1 }]}>Shwe Ywet Hla</Text>}
//       {!isSearch && (
//         <TouchableOpacity onPress={() => setIsSearch(true)}>
//           <Icon icon={IconKey.search} size={IconsSize.lg} className={{ color: '#fff' }} />
//         </TouchableOpacity>
//       )}
//       {isSearch && (
//         <View style={[headerStyles.searchContainer, { flex: 1 }]}>
//           <TextInput
//             style={headerStyles.searchInput}
//             placeholder="Search books by title or author..."
//             placeholderTextColor="#A0A0A0"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//       )}
//     </LinearGradient>
//   );
// };

// const fetchBooksByCategory = async (category: string) => {
//   try {
//     const booksRef = db.collection('Books');
//     const querySnapshot = await booksRef.where('genre', '==', category).get();

//     const books: IBook[] = [];
//     querySnapshot.forEach(doc => {
//       books.push({ id: doc.id, ...doc.data() } as IBook);
//     });
//     return books;
//   } catch (error) {
//     console.error('Error fetching documents:', error);
//     return [];
//   }
// };

// const fetchBooksByTitleAndAuthor = async (keyword: string, field: string) => {
//   try {
//     const booksRef = db.collection('Books');
//     const querySnapshot = await booksRef.where(field, '==', keyword).get();

//     console.log('fetchBooksByTitleAndAuthor', keyword, field, querySnapshot.size);
//     const books: IBook[] = [];
//     querySnapshot.forEach(doc => {
//       books.push({ id: doc.id, ...doc.data() } as IBook);
//     });
//     return books;
//   } catch (error) {
//     console.error('Error fetching documents:', error);
//     return [];
//   }
// };

// const BookListScreen = ({ navigation,route }: BookListScreenProps) => {
//   const [categories, setCategories] = useState<string[]>([]);
//   const [books, setBooks] = useState<IBook[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [keyWords, setKeyWords] = useAtom(keywordsState);
//   const [selectedCategory, setSelectedCategory] = useState('Popular');
//   const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [suggestions, setSuggestions] = useState<ISearchKeyword[]>([]);
//   const [isSearch, setIsSearch] = useState(false);
//   const paramCategory = route.params ? route.params.category : null;

//   useEffect(() => {
//     const keywordsRef = db.collection('Keywords');
//     if (keyWords.length > 0) return;

//     const subscriber = keywordsRef.onSnapshot(
//       querySnapshot => {
//         const keywordsList: ISearchKeyword[] = [];
//         querySnapshot.forEach(doc => {
//           const data = doc.data();
//           keywordsList.push({
//             id: doc.id,
//             ...data,
//           } as ISearchKeyword);
//         });
//         setKeyWords(keywordsList);
//       },
//       error => {
//         console.error('Error fetching documents: ', error);
//       },
//     );

//     return () => subscriber();
//   }, [keyWords, setKeyWords]);

//   useEffect(() => {
//     if (selectedCategory !== 'Popular') {
//       fetchBooksByCategory(selectedCategory).then(res => {
//         setFilteredBooks(res);
//       });
//     } else {
//       setFilteredBooks(books);
//     }

//     let suggestionsList: ISearchKeyword[] = [];
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       suggestionsList = keyWords.filter(keyword => keyword.id.toLowerCase().includes(q));
//       console.log('Search Query ', searchQuery, suggestionsList);
//     }

//     setSuggestions(suggestionsList);
//   }, [searchQuery, selectedCategory, books, keyWords]);

//   useEffect(() => {
//     setBooks([]);
//     setFilteredBooks([]);
//     if(paramCategory) setSelectedCategory(paramCategory)
//     const booksRef = db.collection('Books');
//     const whereQuery = paramCategory ? where('genre', '==', paramCategory) : where("premium_type","==","html");
//     const q = query(booksRef,whereQuery, orderBy('popularRating', 'desc'), orderBy('date', 'desc'));
//     const subscriber = q.onSnapshot(
//       querySnapshot => {
//         const booksList: IBook[] = [];
//         console.log('Total books: ', querySnapshot.size);
//         querySnapshot.forEach(doc => {
//           const data = doc.data();
//           booksList.push({
//             id: doc.id,
//             ...data,
//           } as IBook);
//         });
//         setBooks(booksList);
//         setLoading(false);
//       },
//       error => {
//         console.log('Error fetching documents: ', error);
//         setLoading(false);
//       },
//     );

//     return () => subscriber();
//   }, [paramCategory]);

//   useEffect(() => {
//     const categoriesRef = db.collection('categories').orderBy('label', 'asc');

//     const subscriber = categoriesRef.onSnapshot(
//       querySnapshot => {
//         const cats: { id: string; label: string; key: string }[] = [];
//         querySnapshot.forEach(doc => {
//           const data = doc.data();
//           cats.push({
//             id: doc.id,
//             ...data,
//           } as { id: string; label: string; key: string });
//         });
//         setCategories(cats.map(cat => cat.key));
//         setLoading(false);
//       },
//       error => {
//         console.error('Error fetching documents: ', error);
//         setLoading(false);
//       },
//     );

//     return () => subscriber();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   const renderItem = ({ item }: { item: IBook }) => {
//     return (<TouchableOpacity
//         style={[styles.bookItem, { width: ITEM_WIDTH } ]}
//         disabled={ !item.premium }
//         onPress={() => navigation.navigate(MainNav.BookDeatils, item)}>
//         <Image style={[styles.bookCover,item.premium ? {}: {opacity:0.1}]} source={{ uri: item.coverImageUrl[0] }} />
//         <View style={styles.bookInfo}>
//           <Text style={styles.bookTitle} numberOfLines={2}>
//             {item.title}
//           </Text>
//         </View>
//     </TouchableOpacity>)
//   }

//   return (
//     <View style={styles.container}>
//       <AppUpdateChecker />
//       <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} isSearch={isSearch} setIsSearch={setIsSearch} />

//       {suggestions.length > 0 && searchQuery.length > 0 ? (
//         <View style={styles.categoriesContainer}>
//           <FlatList
//             style={styles.suggestionsList}
//             data={suggestions}
//             keyExtractor={item => item.id}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => {
//                   fetchBooksByTitleAndAuthor(item.id, item.type).then(res => {
//                     console.log('fetchBooksByTitleAndAuthor Result ', res);
//                     setFilteredBooks(res);
//                     setSuggestions([]);
//                   });
//                 }}
//                 style={styles.suggestionItem}>
//                 <Text style={styles.suggestionText}>{item.id}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       ) : (
//         <View style={styles.categoriesContainer}>
//           <FlatList
//             data={['Popular', ...categories]}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={item => item}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => {
//                   setSelectedCategory(item);
//                   setIsSearch(false);
//                 }}>
//                 <LinearGradient
//                   colors={selectedCategory === item ? ['#7B5EC9', '#4B71C8', '#22B4D3'] : ['#E0E0E0', '#E0E0E0', '#E0E0E0']}
//                   locations={[0.0, 0.5, 1.0]}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={[styles.categoryButton, selectedCategory === item && styles.selectedCategoryButton]}>
//                   <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>{item}</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       )}

//       {
//         filteredBooks.length === 0 && <EmptyState  />
//       }

      

//       <FlatList
//         data={filteredBooks}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         numColumns={4}
//         onScroll={()=>setIsSearch(false)}
//         columnWrapperStyle={styles.columnWrapper}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// };

// const headerStyles = StyleSheet.create({
//   container: {
//     backgroundColor: Colors.nav,
//     padding: 16,
//     paddingTop: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   searchContainer: {
//     backgroundColor: 'white',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     fontSize: 16,
//     color: '#333',
//   },
// });

// const { width } = Dimensions.get('window');
// const GAP = 10;
// const ITEM_WIDTH = (width - GAP * 5) / 4;

// const styles = StyleSheet.create({
//   suggestionsContainer: {
//     position: 'absolute',
//     top: 100,
//     left: 10,
//     right: 10,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     elevation: 5,
//     zIndex: 1,
//   },
//   suggestionsList: {
//     backgroundColor: 'white',
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8,
//     marginHorizontal: 10,
//     marginTop: 10,
//     elevation: 2,
//   },
//   suggestionItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   suggestionText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     padding: 10,
//   },
//   searchBarContainer: {
//     backgroundColor: 'white',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//     elevation: 2,
//   },
//   searchInput: {
//     height: 40,
//     backgroundColor: '#F0F0F0',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     fontSize: 16,
//     color: '#333',
//   },
//   categoriesContainer: {
//     paddingVertical: 10,
//     paddingHorizontal: 5,
//     backgroundColor: 'white',
//     elevation: 1,
//   },
//   categoryButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#E0E0E0',
//     marginHorizontal: 5,
//   },
//   selectedCategoryButton: {
//     backgroundColor: Colors.nav,
//   },
//   categoryText: {
//     color: '#333',
//     fontWeight: '600',
//   },
//   selectedCategoryText: {
//     color: 'white',
//   },
//   bookItem: {
//     flexDirection: 'column',
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 5,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//   },
//   bookCover: {
//     width: 80,
//     height: 120,
//     borderRadius: 6,
//     marginRight: 15,
//   },
//   bookInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   bookTitle: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#333',
//     lineHeight: 20,
//     marginBottom: 4,
//     width: '100%',
//     overflow: 'hidden',
//   },
//   bookAuthor: {
//     fontSize: 10,
//     color: '#777',
//     lineHeight: 30,
//   },
//   bookPrice: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#007BFF',
//     marginTop: 8,
//   },
//   columnWrapper: {
//     justifyContent: 'flex-start',
//     paddingHorizontal: GAP,
//     gap: GAP,
//     marginBottom: GAP,
//   },
// });

// export default BookListScreen;

import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import firestore, { orderBy, query, where } from '@react-native-firebase/firestore';
import { IBook } from '../types/models/IBook';
import { Colors } from '../res/color';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNav, RootStackParamList } from '../nav/main.nav';
import AppUpdateChecker from '../componet/atoms/AppUpdateChecker';
import { useAtom } from 'jotai';
import { ISearchKeyword, keywordsState } from '../features/jotai/model/books';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, IconKey, IconsSize } from '../componet/atoms/icons';
import EmptyState from '../componet/atoms/container/EmptyState';

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
  const [categories, setCategories] = useState<string[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [keyWords, setKeyWords] = useAtom(keywordsState);
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [filteredBooks, setFilteredBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<ISearchKeyword[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  const paramCategory = route.params ? route.params.category : null;

  useEffect(() => {
    const keywordsRef = db.collection('Keywords');
    if (keyWords.length > 0) return;

    const subscriber = keywordsRef.onSnapshot(
      querySnapshot => {
        const keywordsList: ISearchKeyword[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          keywordsList.push({
            id: doc.id,
            ...data,
          } as ISearchKeyword);
        });
        setKeyWords(keywordsList);
      },
      error => {
        console.error('Error fetching documents: ', error);
      },
    );

    return () => subscriber();
  }, [keyWords, setKeyWords]);

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
      suggestionsList = keyWords.filter(keyword => keyword.id.toLowerCase().includes(q));
    }

    setSuggestions(suggestionsList);
  }, [searchQuery, selectedCategory, books, keyWords]);

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

  useEffect(() => {
    const categoriesRef = db.collection('categories').orderBy('label', 'asc');

    const subscriber = categoriesRef.onSnapshot(
      querySnapshot => {
        const cats: { id: string; label: string; key: string }[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          cats.push({
            id: doc.id,
            ...data,
          } as { id: string; label: string; key: string });
        });
        setCategories(cats.map(cat => cat.key));
        setLoading(false);
      },
      error => {
        console.error('Error fetching documents: ', error);
        setLoading(false);
      },
    );

    return () => subscriber();
  }, []);

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
        onPress={() => navigation.navigate(MainNav.BookDeatils, item)}>
        
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
            data={['Popular', ...categories]}
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