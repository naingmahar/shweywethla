import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import firestore, { orderBy, query, where, limit } from '@react-native-firebase/firestore';
import { DatabaseReference, firebase, onValue, ref } from '@react-native-firebase/database';
import { IBook } from '../types/models/IBook';
import { ISearchKeyword } from '../features/jotai/model/books';

const db = firestore();
const database = firebase
  .app()
  .database('https://shweywethla-49cb4-default-rtdb.asia-southeast1.firebasedatabase.app/');

interface DashboardContextData {
  // Data
  books: IBook[];
  notes: IBook[];
  commingBooks: IBook[];
  categories: string[];
  carousel: { image: string; url: string }[];
  keywords: ISearchKeyword[];

  // Loading states
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  refreshData: () => Promise<void>;
  clearCache: () => void;
}

const DashboardContext = createContext<DashboardContextData | undefined>(undefined);

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  // State for all cached data
  const [books, setBooks] = useState<IBook[]>([]);
  const [notes, setNote] = useState<IBook[]>([]);
  const [commingBooks, setCommingBooks] = useState<IBook[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [carousel, setCarousel] = useState<{ image: string; url: string }[]>([]);
  const [keywords, setKeywords] = useState<ISearchKeyword[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch all data once
  const fetchAllData = async () => {
    setIsLoading(true);

    try {
      // Fetch in parallel for better performance
      await Promise.all([
        fetchCarousel(),
        fetchBooks(),
        fetchNotes(),
        fetchCommingSoonBooks(),
        fetchCategories(),
        fetchKeywords(),
      ]);

      setIsInitialized(true);
      console.log('✅ Dashboard data cached successfully');
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch carousel data (ads)
  const fetchCarousel = async () => {
    return new Promise<void>((resolve) => {
      const appRef: DatabaseReference = ref(database, `ads`);
      onValue(
        appRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setCarousel(data);
          }
          resolve();
        },
        (error) => {
          console.error('Error fetching carousel:', error);
          resolve();
        }
      );
    });
  };

  // Fetch books (premium HTML type) - Limited to 30 for performance
  const fetchBooks = async () => {
    try {
      const booksRef = db.collection('Books');
      const q = query(
        booksRef,
        where('premium_type', '==', 'html'),
        orderBy('popularRating', 'desc'),
        limit(30)
      );

      const querySnapshot = await q.get();
      const booksList: IBook[] = [];

      querySnapshot.forEach((doc) => {
        booksList.push({
          id: doc.id,
          ...doc.data(),
        } as IBook);
      });

      setBooks(booksList);
      console.log(`📚 Fetched ${booksList.length} books (limited to 30)`);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Fetch notes - Limited to 30 for performance
  const fetchNotes = async () => {
    try {
      const notesRef = db.collection('Notes');
      const q = query(
        notesRef,
        orderBy('popularRating', 'desc'),
        limit(30)
      );

      const querySnapshot = await q.get();
      const notesList: IBook[] = [];

      querySnapshot.forEach((doc) => {
        notesList.push({
          id: doc.id,
          ...doc.data(),
        } as IBook);
      });

      setNote(notesList);
      console.log(`📝 Fetched ${notesList.length} notes (limited to 30)`);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Fetch coming soon books
  const fetchCommingSoonBooks = async () => {
    try {
      const booksRef = db.collection('Books');
      const q = query(booksRef, where('premium_type', '==', 'Comming_Soon'));

      const querySnapshot = await q.get();
      const booksList: IBook[] = [];

      querySnapshot.forEach((doc) => {
        booksList.push({
          id: doc.id,
          ...doc.data(),
        } as IBook);
      });

      setCommingBooks(booksList);
      console.log(`🔜 Fetched ${booksList.length} coming soon books`);
    } catch (error) {
      console.error('Error fetching coming soon books:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categoriesRef = db.collection('categories').orderBy('label', 'asc');
      const querySnapshot = await categoriesRef.get();

      const categoriesList: { id: string; label: string; key: string }[] = [];

      querySnapshot.forEach((doc) => {
        categoriesList.push({
          id: doc.id,
          ...doc.data(),
        } as { id: string; label: string; key: string });
      });

      setCategories(categoriesList.map((cat) => cat.key));
      console.log(`📂 Fetched ${categoriesList.length} categories`);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch keywords for search
  const fetchKeywords = async () => {
    try {
      const keywordsRef = db.collection('Keywords');
      const querySnapshot = await keywordsRef.get();

      const keywordsList: ISearchKeyword[] = [];

      querySnapshot.forEach((doc) => {
        keywordsList.push({
          id: doc.id,
          ...doc.data(),
        } as ISearchKeyword);
      });

      setKeywords(keywordsList);
      console.log(`🔍 Fetched ${keywordsList.length} keywords`);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    }
  };

  // Clear all cached data
  const clearCache = () => {
    setBooks([]);
    setNote([]);
    setCommingBooks([]);
    setCategories([]);
    setCarousel([]);
    setKeywords([]);
    setIsInitialized(false);
    console.log('🗑️ Cache cleared');
  };

  // Fetch data on mount (once per session)
  useEffect(() => {
    fetchAllData();

    // Cleanup function
    return () => {
      console.log('🔄 DashboardContext unmounting');
    };
  }, []);

  const contextValue: DashboardContextData = {
    books,
    notes,
    commingBooks,
    categories,
    carousel,
    keywords,
    isLoading,
    isInitialized,
    refreshData: fetchAllData,
    clearCache,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
