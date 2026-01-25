import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { getDownloadedBooks, removeDownloadedBook } from '../services/downloadedBooksDB';
import { IBookDownloaded } from '../types/models/IBook';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNav, RootStackParamList } from '../nav/main.nav';
import { Colors, GradientColor } from '../res/color';
import { EsButton, GradientButton } from '../componet/atoms/container/EsButton';
import { GradientContainer } from '../componet/atoms/container/GradientContainer';
import EmptyLibraryScreen from '../componet/atoms/container/EmptyLibraryScreen';

type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, MainNav.History>;

export const History:React.FC<HistoryScreenProps> = ({navigation}) => {
  const [downloadedBooks, setDownloadedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDownloadedBooks = async () => {
    try {
      const books = await getDownloadedBooks();
      setDownloadedBooks(books);
    } catch (error) {
      console.error("Failed to fetch downloaded books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloadedBooks();
  }, []);

  const renderItem = ({ item }:{item:IBookDownloaded}) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={()=>navigation.navigate(MainNav.ADS,item)}
    >
        <Image
        style={styles.bookCover}
        source={{ uri: item.coverImageUrl[0] }}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
      </View>
      <View style={{justifyContent:"center"}}>
        <EsButton 
        style={{paddingHorizontal:20,paddingVertical:5,backgroundColor:GradientColor[5]}}
        onPress={()=>{
          removeDownloadedBook(item.id)
          .then(()=>fetchDownloadedBooks())
          .catch(err=>console.log(err))
        }} 
        title='Delete' />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading downloaded books...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    
      <GradientContainer style={styles.header}>
          <Text style={styles.headerTitle}>Downloaded Books</Text>
      </GradientContainer>

      {downloadedBooks.length === 0 ? (
        <EmptyLibraryScreen onBrowsePress={() => navigation.navigate(MainNav.Books, { category: 'Popular' })}/>
      ) : (
        <FlatList
          refreshing={loading}
          onRefresh={()=>fetchDownloadedBooks()}
          data={downloadedBooks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    // backgroundColor: Colors.nav,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20, // To avoid status bar overlap
    marginBottom: 5,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
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
    // alignItems:"center"
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
});
