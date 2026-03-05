import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setItem<T>(key: string, value: T) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('storage set error', e);
  }
}

export async function getItem<T>(key: string, defaultValue?: T): Promise<T | undefined> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch (e) {
    console.warn('storage get error', e);
    return defaultValue;
  }
}
