type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const getStorage = (): StorageLike | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const safeStorage = {
  getItem(key: string): string | null {
    const storage = getStorage();
    if (!storage) return null;
    try {
      return storage.getItem(key);
    } catch (error) {
      console.warn('[Kudoku] localStorage get failed:', error);
      return null;
    }
  },

  setItem(key: string, value: string): void {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.setItem(key, value);
    } catch (error) {
      console.warn('[Kudoku] localStorage set failed:', error);
    }
  },

  removeItem(key: string): void {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.removeItem(key);
    } catch (error) {
      console.warn('[Kudoku] localStorage remove failed:', error);
    }
  },

  getJSON<T>(key: string): T | null {
    const raw = this.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn('[Kudoku] localStorage JSON parse failed:', error);
      return null;
    }
  },

  setJSON<T>(key: string, value: T): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('[Kudoku] localStorage JSON stringify failed:', error);
    }
  },
};
