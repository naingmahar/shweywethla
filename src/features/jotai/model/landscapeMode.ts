import { JotaiPersistence, JotaiPersistenceKey } from "../config";

export const landscapeModeAtom = JotaiPersistence<boolean>(JotaiPersistenceKey.landscapeMode, false);
