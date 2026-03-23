
export interface IBook {
  id: string
  price: string
  title: string
  language: string
  genre: string
  description: string
  publishedDate: string
  publisher?: string
  numberOfPages: string
  author: string
  coverImageUrl: string[]
  samplePdfUrl: string[]
  isMasterBook?: boolean
  masterUrl?: string
  premium?: string[] | string
  premium_type?: 'html' | 'text' | 'pdf' | 'Comming_Soon'|null
  book_type?: 'short_note' | 'original'
  audioUrl?: string | string[]

}

export type IBookDownloaded = IBook & {
  localFilePath: string
  downloadedAt: string
  localAudioPaths?: string[]
  localPageDir?: string   // path to bookId_pages/ subfolder (set after preprocessing)
  totalPages?: number     // total page count (set after preprocessing)
  downloadSource?: 'Books' | 'Notes'
}