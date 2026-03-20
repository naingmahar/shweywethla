import { JotaiPersistence, JotaiPersistenceKey } from "../config";

export const DEFAULT_FONT_FAMILY_ID = 'default';

export const fontFamilyAtom = JotaiPersistence<string>(
  JotaiPersistenceKey.fontFamily,
  DEFAULT_FONT_FAMILY_ID,
);
