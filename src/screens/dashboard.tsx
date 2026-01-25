import React, { use, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Image,
  ListRenderItem,
  Dimensions,
  ImageBackground,
  Linking
} from 'react-native';
import firestore, { addDoc, collection, or, orderBy, query, where } from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import { IBook } from '../types/models/IBook';
import { CategoryIcon, TechnologyIcon } from '../componet/atoms/SVG';
import { GradientColor } from '../res/color';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNav, RootStackParamList } from '../nav/main.nav';
import { DatabaseReference, firebase, onValue, ref } from '@react-native-firebase/database';
// Assuming you would use an icon library like react-native-vector-icons
// import Icon from 'react-native-vector-icons/Ionicons'; 

const db = firestore();

// --- COLOR PALETTE (Hex Codes) ---
const COLORS = {
  PRIMARY: '#4F46E5',         // Indigo: Used for active elements and buttons
  PRIMARY_LIGHT: '#E0E7FF',   // Very Light Indigo: Used for category pills background
  BACKGROUND: '#FFFFFF',      // Pure White: Screen background
  CARD_BACKGROUND: '#F9FAFB', // Light Gray: Search bar background
  TEXT_DARK: '#1F2937',       // Dark Gray: Primary text, titles
  TEXT_MEDIUM: '#6B7280',     // Medium Gray: Secondary text, inactive tabs
  BORDER: '#D1D5DB',          // Light Border Gray
  ACCENT_RED: '#F87171',      // For a 'New/Sale' banner or notification badge
};

const data = [
  {
    title: "Slide 1",
    content: "https://firebasestorage.googleapis.com/v0/b/shweywethla-49cb4.firebasestorage.app/o/image%2FGemini_Generated_Image_cfpcbtcfpcbtcfpc.png?alt=media&token=335c8389-140b-4039-8add-d683923db615",
  },
  {
    title: "Slide 2",
    content: "https://firebasestorage.googleapis.com/v0/b/shweywethla-49cb4.firebasestorage.app/o/image%2FGemini_Generated_Image_rvtyx9rvtyx9rvty.png?alt=media&token=5ba7297f-c887-438e-8d61-c9c1d072aa0d",
  },
  {
    title: "Slide 3",
    content: "https://firebasestorage.googleapis.com/v0/b/shweywethla-49cb4.firebasestorage.app/o/image%2FGemini_Generated_Image_93x5z993x5z993x5.png?alt=media&token=2a5d9b7f-b5fa-46d2-a2cf-b6bf3dad7bc3",
  },
];
 
type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.Dashboard>;

const database = firebase
  .app()
  .database('https://shweywethla-49cb4-default-rtdb.asia-southeast1.firebasedatabase.app/')


const Dashboard: React.FC<DashboardScreenProps> = (props) => {

  const cRef = React.useRef<ICarouselInstance>(null);
  const [books, setBooks] = useState<IBook[]>([]);
  const [commingBooks, setCommingBooks] = useState<IBook[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [carousel,setCarousel] = useState<{image:string,url:string}[]>([])

  const appRef: DatabaseReference = ref(database, `ads`);

  useEffect(() => {
    const unsubscribe = onValue(appRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Fetched app config:", data ,typeof data);
    if (data) {
      setCarousel(data)
    }
    }, (error) => {
      console.error("Firebase fetch failed:", error);
    });

    return () => unsubscribe();
  },[]);

  useEffect(() => { 
    const booksRef = db.collection('Books') 
    const q = query(booksRef,where("premium_type","==","html") ,orderBy("popularRating","desc") ); 
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
    }, error => {
      console.log("Error fetching documents: ", error);
     })
  },[])

  useEffect(() => { 
    const booksRef = db.collection('Books') 
    const q = query(booksRef,where("premium_type","==","Comming_Soon")); 
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
      setCommingBooks(booksList);
    }, error => {
      console.log("Error fetching documents: ", error);
     })
  },[])

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
      // setLoading(false);
    }, error => {
      console.error("Error fetching documents: ", error);
      // setLoading(false);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => subscriber();
  }, []);



  const renderBook: ListRenderItem<IBook> = ({ item }) => (
    // console.log('renderBook',item),
    <TouchableOpacity 
      onPress={()=>props.navigation.navigate(MainNav.Books,
        {
          //@ts-ignore
          screen: MainNav.BookDeatils,
          params: item
        }
      )}
      disabled={item.premium_type == "Comming_Soon" || !item.premium_type} 
      style={styles.bookCard}>
      <Image 
        source={{ uri: item.coverImageUrl[0] }} 
        style={styles.bookCover} 
      />
      {/* <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text> */}
    </TouchableOpacity>
  );

  const RenderCategory: ListRenderItem<string> = ({ item }) => (
    <TouchableOpacity onPress={()=>props.navigation.navigate(MainNav.Books,{
      //@ts-ignore
      screen: MainNav.Books,
      params: {  category:item }}
      )} style={styles.categoryPill}>
      <CategoryIcon categoryName={item} color={GradientColor[1]} size={60}/>
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );


  const openAnyUrl = (url: string): void => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>

        <Carousel
          width={Dimensions.get('window').width}
          height={150}
          ref={cRef}
          data={carousel}
          autoPlay={true}
          autoPlayInterval={5000}
          // style={{ width: '100%', height: 180}} // 4. Provide size via the style prop
          renderItem={({ item }) => (
            <TouchableOpacity style={{ flex: 1,height: "100%"}} onPress={()=>openAnyUrl(item.url)}>
              {/* <Image 
                source={{ uri: item.image }} 
                resizeMode="contain" 
                style={{ flex: 1, height: "auto",marginHorizontal:10,borderRadius:20,overflow: "hidden"}} 
             /> */}

              <View style={{ 
                // flex: 1, 
                marginHorizontal: 10, 
                borderRadius: 20, 
                overflow: 'hidden', // This clips the GIF
                backgroundColor: '#000' 
              }}>
                <Image 
                  source={{ uri: item.image }} 
                  resizeMode="cover" // Cover now works perfectly because the ratio matches
                  style={{ width: '100%', height: '100%', borderRadius: 20 }} 
                />
              </View>
                {/* <Text>{item.title}</Text> */}
                
              {/* </ImageBackground> */}
            </TouchableOpacity>
          )}
        />

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <FlatList
          horizontal
          data={categories}
          renderItem={RenderCategory} 
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
        />

        {/* <SearchBar /> */}
        {/* Trending Books Section */}
        <Text style={styles.sectionTitle}>Trending Books</Text>
        <FlatList
          horizontal
          data={books}
          renderItem={(item)=>renderBook({...item,...{isEnable:true}})} 
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bookList}
        />

        {/* Trending Books Section */}
        <Text style={styles.sectionTitle}>Comming Soon Books</Text>
        <FlatList
          horizontal
          data={commingBooks}
          renderItem={renderBook} 
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bookList}
        />

      </ScrollView>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      {/* <View style={styles.bottomNavContainer}>
        <NavItem label="Home" isActive={true} />
        <NavItem label="Categories" isActive={false} />
        <NavItem label="Library" isActive={false} />
        <NavItem label="Profile" isActive={false} />
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    marginTop:10
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_DARK,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  
  // --- Search Bar Styles ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BACKGROUND, // Light Gray background
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.BORDER, // Subtle border
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_DARK,
  },
  searchIcon: {
    fontSize: 18,
    color: COLORS.TEXT_MEDIUM,
    marginLeft: 10,
  },

  // --- Banner Styles ---
  banner: {
    backgroundColor: COLORS.ACCENT_RED, // Striking Red/Accent color
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.ACCENT_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.BACKGROUND, // White text on Red
    maxWidth: '65%',
  },
  bannerButton: {
    backgroundColor: COLORS.BACKGROUND,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  bannerButtonText: {
    color: COLORS.ACCENT_RED,
    fontWeight: 'bold',
    fontSize: 15,
  },

  // --- Section Titles and Lists ---
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_DARK,
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
  },
  categoryList: {
    marginBottom: 20,
    paddingHorizontal: 16,
    marginRight:10,
    overflow: "visible"
  },
  categoryPill: {
    // backgroundColor: COLORS.PRIMARY_LIGHT, // Light Indigo background
    // paddingHorizontal: 15,
    // paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryText: {
    textAlign:"center",
    color: "grey", 
    // fontSize:12,
    fontWeight: '400',
  },
  bookList: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  bookCard: {
    width: 100, // Slightly smaller book cards for a denser list
    marginRight: 15,
  },
  bookCover: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_DARK,
  },

  // --- BOTTOM NAVIGATION BAR STYLES ---
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 65,
    backgroundColor: COLORS.BACKGROUND, // White background
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER, // Light border
    shadowColor: COLORS.TEXT_DARK,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8, // Android elevation for shadow effect
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  navIconPlaceholder: {
    fontSize: 18, // Represents the icon size
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
  },
});

export default Dashboard;
