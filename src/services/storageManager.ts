import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { IBookDownloaded } from '../types/models/IBook';

const STORAGE_LIMIT_KEY = '@StorageLimitGB';
const DOWNLOADED_BOOKS_KEY = '@DownloadedBooks';
const DEFAULT_LIMIT_GB = 5;

export const getStorageLimitGB = async (): Promise<number> => {
  try {
    const val = await AsyncStorage.getItem(STORAGE_LIMIT_KEY);
    return val ? parseInt(val, 10) : DEFAULT_LIMIT_GB;
  } catch {
    return DEFAULT_LIMIT_GB;
  }
};

export const setStorageLimitGB = async (gb: number): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_LIMIT_KEY, String(gb));
};

const getFileSizeBytes = async (path: string): Promise<number> => {
  try {
    const stat = await RNFS.stat(path);
    return stat.size;
  } catch {
    return 0;
  }
};

export const enforceStorageLimit = async (): Promise<void> => {
  try {
    const limitGB = await getStorageLimitGB();
    const limitBytes = limitGB * 1024 * 1024 * 1024;

    const jsonValue = await AsyncStorage.getItem(DOWNLOADED_BOOKS_KEY);
    if (!jsonValue) return;

    let books: IBookDownloaded[] = JSON.parse(jsonValue);

    // Sort oldest first
    books.sort((a, b) =>
      new Date(a.downloadedAt).getTime() - new Date(b.downloadedAt).getTime()
    );

    // Calculate total size
    const sizes = await Promise.all(books.map(b => getFileSizeBytes(b.localFilePath)));
    let totalBytes = sizes.reduce((sum, s) => sum + s, 0);

    let i = 0;
    while (totalBytes > limitBytes && i < books.length) {
      // Remove oldest file
      try { await RNFS.unlink(books[i].localFilePath); } catch {}
      totalBytes -= sizes[i];
      i++;
    }

    // Update AsyncStorage — keep remaining books
    const remaining = books.slice(i);
    await AsyncStorage.setItem(DOWNLOADED_BOOKS_KEY, JSON.stringify(remaining));
  } catch (e) {
    console.error('enforceStorageLimit failed:', e);
  }
};

export const getCurrentStorageUsageGB = async (): Promise<number> => {
  try {
    const jsonValue = await AsyncStorage.getItem(DOWNLOADED_BOOKS_KEY);
    if (!jsonValue) return 0;
    const books: IBookDownloaded[] = JSON.parse(jsonValue);
    const sizes = await Promise.all(books.map(b => getFileSizeBytes(b.localFilePath)));
    const totalBytes = sizes.reduce((sum, s) => sum + s, 0);
    return parseFloat((totalBytes / (1024 * 1024)).toFixed(1)); // returns MB
  } catch {
    return 0;
  }
};
