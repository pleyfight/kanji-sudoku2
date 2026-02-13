// Safe wrapper around localStorage.
// Prevents crashes in environments where storage is unavailable (private mode, SSR, quota exceeded).

import { logger, LOG_EVENTS } from './logger';

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
      logger.warn(
        'storage',
        LOG_EVENTS.STORAGE_GET_FAILED,
        'localStorage get failed',
        { error: String(error) },
        { key },
      );
      return null;
    }
  },

  setItem(key: string, value: string): void {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.setItem(key, value);
    } catch (error) {
      logger.warn(
        'storage',
        LOG_EVENTS.STORAGE_SET_FAILED,
        'localStorage set failed',
        { error: String(error) },
        { key },
      );
    }
  },

  removeItem(key: string): void {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.removeItem(key);
    } catch (error) {
      logger.warn(
        'storage',
        LOG_EVENTS.STORAGE_REMOVE_FAILED,
        'localStorage remove failed',
        { error: String(error) },
        { key },
      );
    }
  },

  /**
   * Parse JSON from localStorage with an unsafe `as T` cast.
   * @deprecated Use `getValidatedJSON` for type-safe parsing with schema validation.
   */
  getJSON<T>(key: string): T | null {
    const raw = this.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.warn(
        'storage',
        LOG_EVENTS.STORAGE_PARSE_FAILED,
        'localStorage JSON parse failed',
        { error: String(error) },
        { key },
      );
      return null;
    }
  },

  /**
   * Parse JSON from localStorage with runtime schema validation.
   * Returns null if parsing fails or the validator rejects the data.
   *
   * @param key - localStorage key
   * @param validator - Function that returns true if the parsed data matches the expected shape
   *
   * @example
   * const scores = safeStorage.getValidatedJSON<Record<number, number>>(
   *   'scores',
   *   (data): data is Record<number, number> =>
   *     typeof data === 'object' && data !== null && !Array.isArray(data),
   * );
   */
  getValidatedJSON<T>(key: string, validator: (data: unknown) => data is T): T | null {
    const raw = this.getItem(key);
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (validator(parsed)) {
        return parsed;
      }
      logger.warn(
        'storage',
        LOG_EVENTS.STORAGE_SCHEMA_INVALID,
        `localStorage schema validation failed for key "${key}"`,
        undefined,
        { key },
      );
      return null;
    } catch (error) {
      logger.warn(
        'storage',
        LOG_EVENTS.STORAGE_PARSE_FAILED,
        'localStorage JSON parse failed',
        { error: String(error) },
        { key },
      );
      return null;
    }
  },

  setJSON<T>(key: string, value: T): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (error) {
      logger.warn(
        'storage',
        LOG_EVENTS.STORAGE_STRINGIFY_FAILED,
        'localStorage JSON stringify failed',
        { error: String(error) },
        { key },
      );
    }
  },
};
