// src/utils/storage.ts

/**
 * Local Storage ထဲက Data ကို ဖတ်ယူခြင်း
 * @param key Storage Key (ဥပမာ - 'transactions')
 * @returns Data သို့မဟုတ် null
 */
export const getFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    // Data ရှိရင် JSON ပြန်ဖြည်ပြီး Return ပြန်မယ်
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Local Storage ထဲ Data သိမ်းဆည်းခြင်း
 * @param key Storage Key
 * @param value သိမ်းဆည်းမယ့် Data
 */
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    // Object ကို JSON String အဖြစ် ပြောင်းပြီး သိမ်းမယ်
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

/**
 * Local Storage ထဲက Data ကို ဖျက်ခြင်း
 * @param key Storage Key
 */
export const removeFromStorage = (key: string): void => {
  localStorage.removeItem(key);
};
