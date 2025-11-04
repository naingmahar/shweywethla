
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { IBook, IBookDownloaded } from '../types/models/IBook';
import { addDownloadedBook, isBookDownloaded } from '../services/downloadedBooksDB';

// export const downloadFile = async (url:string,name?:string):Promise<{path?:string,error?:string}> => {
//     try {
//       // Save into internal app storage (no permissions required)
//       const path = RNFS.DocumentDirectoryPath + `/${name}.pdf`;

//       const result = await RNFS.downloadFile({
//         fromUrl: url,
//         toFile: path,
//       }).promise;

//       if (result.statusCode === 200) {
//         console.log('PDF downloaded at:', path);
//         return {path}
//       } else {
//         console.log('Download failed:', result);
//         return {error:'Download failed:'+ result}
//       }
//     } catch (err) {
//       console.error('Error downloading PDF:', err);
//       return {error:'Error downloading PDF:'+ err}
//     }
//   };


  // src/services/fileManager.js

const downloadDir = RNFS.DocumentDirectoryPath;

export const createFile = async (json:string) => {
  const localFilePath = `${downloadDir}/${"author"}.txt`;

  try {
   
    const result =  RNFS.writeFile(localFilePath,json,'utf8');

    return result;
  } catch (error) {
    console.error('Download or file operation failed:', error);
    return undefined;
  }
};

export const downloadFile = async (book:IBook):Promise<IBookDownloaded|undefined> => {
  const bookType = book.premium_type || 'pdf';
  const localFilePath = `${downloadDir}/${book.id}.${bookType}`;

  console.log('Starting download for book:',localFilePath);

  try {
    const fileRecord = await isBookDownloaded(book.id);
    
    if (fileRecord) {
      console.log('File already downloaded. Opening from local storage.');
      return fileRecord;
    }

    console.log('File not found locally. Starting download.');

    const downloadUrl = book.premium?.[0] || book.samplePdfUrl?.[0];
    const result = await RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: localFilePath,
    }).promise;

    if (result.statusCode === 200) {
      console.log('Download successful!');
      let downloadedBook:IBookDownloaded = {...book, localFilePath, downloadedAt: new Date().toISOString()};
      await addDownloadedBook(downloadedBook);
      return downloadedBook;
    } else {
      throw new Error(`Download failed with status code: ${result.statusCode}`);
    }

  } catch (error) {
    console.error('Download or file operation failed:', error);
    return undefined;
  }
};
