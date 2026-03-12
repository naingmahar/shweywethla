import { JotaiPersistence, JotaiPersistenceKey } from "../config";

export const darkModeAtom = JotaiPersistence<boolean>(JotaiPersistenceKey.darkMode, false);
