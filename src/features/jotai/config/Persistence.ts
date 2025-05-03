import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { JotaiPersistenceKey } from './KeyList';

export const JotaiPersistence = <T>(key:JotaiPersistenceKey, initialValue:T|undefined) => {
    const baseAtom = atom<T|undefined>(initialValue)
    baseAtom.onMount = (setValue) => {
      ;(async () => {
        const item = await AsyncStorage.getItem(key)
        let data = item != null ? JSON.parse(item) : undefined
        setValue(data)
      })()
    }
    const derivedAtom = atom(
      (get) => get(baseAtom),
      (get, set, update) => {
        const nextValue =
          typeof update === 'function' ? update(get(baseAtom)) : update
        set(baseAtom, nextValue)
        AsyncStorage.setItem(key, JSON.stringify(nextValue))
      },
    )
    return derivedAtom
  }