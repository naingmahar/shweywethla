
// src/services/downloadedBooksDB.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IBook, IBookDownloaded } from '../types/models/IBook';

const STORAGE_KEY = '@DownloadedBooks';

// Get all downloaded books from AsyncStorage
export const getDownloadedBooks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to fetch downloaded books:", e);
    return [];
  }
};

// Save a new downloaded book record
export const addDownloadedBook = async (bookInfo:IBookDownloaded) => {
  try {
    const existingBooks = await getDownloadedBooks();
    const newBooks = [...existingBooks, bookInfo];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
  } catch (e) {
    console.error("Failed to save downloaded book:", e);
  }
};

// Check if a book is already downloaded
export const isBookDownloaded = async (bookId:string) => {
  try {
    const books:IBookDownloaded[] = await getDownloadedBooks();
    return books.find(book => book.id === bookId);
  } catch (e) {
    console.error("Failed to check if book is downloaded:", e);
    return undefined;
  }
};

// You can add a delete function if needed
export const removeDownloadedBook = async (bookId:string) => {
  try {
    const existingBooks:IBook[] = await getDownloadedBooks();
    const newBooks = existingBooks.filter(book => book.id !== bookId);
    console.log('New Books ',bookId,newBooks)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
  } catch (e) {
    console.error("Failed to remove downloaded book:", e);
  }
};