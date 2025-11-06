import { atom } from "jotai";

export interface ISearchKeyword {
  id: string,
  type: string
}

export const keywordsState = atom<ISearchKeyword[]>([]);