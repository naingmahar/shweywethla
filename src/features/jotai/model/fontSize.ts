import { JotaiPersistence, JotaiPersistenceKey } from "../config";

export const MIN_FONT_SIZE = 13;
export const MAX_FONT_SIZE = 26;
export const DEFAULT_FONT_SIZE = 17;

export const fontSizeAtom = JotaiPersistence<number>(JotaiPersistenceKey.fontSize, DEFAULT_FONT_SIZE);
