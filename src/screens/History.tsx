import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { getDownloadedBooks } from '../services/downloadedBooksDB';
import { IBookDownloaded } from '../types/models/IBook';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNav, RootStackParamList } from '../nav/main.nav';
import { Colors } from '../res/color';

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
      onPress={() => navigation.navigate(MainNav.BookDeatils, item)}
    >
        <Image
        style={styles.bookCover}
        source={{ uri: item.coverImageUrl[0] }}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
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
      {/* Header View */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Downloads</Text>
      </View>
      {/* End of Header View */}

      {downloadedBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No books have been downloaded yet.</Text>
        </View>
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
    backgroundColor: Colors.nav,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
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
