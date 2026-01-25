
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

}

export type IBookDownloaded = IBook & {
  localFilePath: string
  downloadedAt: string
}