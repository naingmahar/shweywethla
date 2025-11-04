const ADS_WATCHED_KEY = 'ads_watched';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setRecordAdWatch = async () => {
  try {
    await AsyncStorage.setItem(ADS_WATCHED_KEY, "1".toString());
  } catch (e) {
    console.error("Failed to record ad watch:", e);
    return null;
  }
}

export const RemoveSavedRecordAdWatch = async () => {
  try {
    await AsyncStorage.setItem(ADS_WATCHED_KEY, "0".toString());
  } catch (e) {
    console.error("Failed to record ad watch:", e);
    return null;
  }
}
export const getRecordAdWatch = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ADS_WATCHED_KEY);
    if(value !== null) {
      return parseInt(value) == 1;
    }
    return false;
  } catch(e) {
    console.error("Failed to get ad watch record:", e);
    return false;
  }
}

