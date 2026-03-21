
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { IBook, IBookDownloaded } from '../types/models/IBook';
import { addDownloadedBook, isBookDownloaded } from '../services/downloadedBooksDB';
import { enforceStorageLimit } from '../services/storageManager';

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

// Preprocess an HTML book into per-page files stored in a subfolder.
// Returns { localPageDir, totalPages } or undefined on failure.
export const preprocessBookPages = async (
  bookId: string,
  localFilePath: string,
): Promise<{ localPageDir: string; totalPages: number } | undefined> => {
  const localPageDir = `${downloadDir}/${bookId}_pages`;
  try {
    // If already preprocessed, return existing dir
    const metaPath = `${localPageDir}/meta.json`;
    const alreadyDone = await RNFS.exists(metaPath);
    if (alreadyDone) {
      const meta = JSON.parse(await RNFS.readFile(metaPath, 'utf8'));
      return { localPageDir, totalPages: meta.totalPages };
    }

    // Read original file and split into pages
    const content = await RNFS.readFile(localFilePath, 'utf8');
    const pages = content
      .split('---')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (pages.length === 0) return undefined;

    // Create subfolder
    const dirExists = await RNFS.exists(localPageDir);
    if (!dirExists) await RNFS.mkdir(localPageDir);

    // Write each page as a separate file
    await Promise.all(
      pages.map((pageContent, i) =>
        RNFS.writeFile(`${localPageDir}/page_${i}.txt`, pageContent, 'utf8'),
      ),
    );

    // Write meta
    await RNFS.writeFile(
      metaPath,
      JSON.stringify({ totalPages: pages.length }),
      'utf8',
    );

    console.log(`Preprocessed ${pages.length} pages for book ${bookId}`);
    return { localPageDir, totalPages: pages.length };
  } catch (error) {
    console.error('preprocessBookPages failed:', error);
    return undefined;
  }
};

const downloadAudioFiles = async (bookId: string, audioUrl: string | string[]): Promise<string[]> => {
  const urls = Array.isArray(audioUrl) ? audioUrl : [audioUrl];
  const localPaths: string[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const ext = url.split('?')[0].split('.').pop() || 'mp3';
    const localPath = `${downloadDir}/${bookId}_audio_${i}.${ext}`;
    try {
      const exists = await RNFS.exists(localPath);
      if (!exists) {
        const result = await RNFS.downloadFile({ fromUrl: url, toFile: localPath }).promise;
        if (result.statusCode !== 200) {
          console.warn(`Audio part ${i} download failed:`, result.statusCode);
          continue;
        }
      }
      localPaths.push(localPath);
    } catch (e) {
      console.warn(`Audio part ${i} download error:`, e);
    }
  }
  return localPaths;
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

    const typeConvertDownloadUrl = typeof book.premium == "string" ? book.premium : book.premium?.[0];
    const downloadUrl = typeConvertDownloadUrl || book.samplePdfUrl?.[0];

    if (!downloadUrl) {
      console.error('downloadFile: no download URL available for book', book.id);
      return undefined;
    }

    const result = await RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: localFilePath,
    }).promise;

    if (result.statusCode === 200) {
      console.log('Download successful!');

      // Download audio files if available
      let localAudioPaths: string[] | undefined;
      if (book.audioUrl) {
        localAudioPaths = await downloadAudioFiles(book.id, book.audioUrl);
      }

      // Preprocess HTML books into per-page files for fast on-demand loading
      let localPageDir: string | undefined;
      let totalPages: number | undefined;
      if (bookType === 'html') {
        const preprocessed = await preprocessBookPages(book.id, localFilePath);
        if (preprocessed) {
          localPageDir = preprocessed.localPageDir;
          totalPages = preprocessed.totalPages;
        }
      }

      let downloadedBook:IBookDownloaded = {
        ...book,
        localFilePath,
        downloadedAt: new Date().toISOString(),
        ...(localAudioPaths && localAudioPaths.length > 0 ? { localAudioPaths } : {}),
        ...(localPageDir ? { localPageDir, totalPages } : {}),
      };
      await addDownloadedBook(downloadedBook);
      await enforceStorageLimit();
      return downloadedBook;
    } else {
      throw new Error(`Download failed with status code: ${result.statusCode}`);
    }

  } catch (error) {
    console.error('Download or file operation failed:', error);
    return undefined;
  }
};
