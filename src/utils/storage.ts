/**
 * Utility functions for localStorage operations with error handling
 */

export const storage = {
  /**
   * Get an item from localStorage
   * @param key - The localStorage key
   * @param defaultValue - Default value if key doesn't exist or parsing fails
   * @returns The parsed value or default value
   */
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  /**
   * Set an item in localStorage
   * @param key - The localStorage key
   * @param value - The value to store
   * @returns boolean indicating success
   */
  set: <T>(key: string, value: T): boolean => {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Remove an item from localStorage
   * @param key - The localStorage key
   * @returns boolean indicating success
   */
  remove: (key: string): boolean => {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
      return false
    }
  },

  /**
   * Clear all localStorage
   * @returns boolean indicating success
   */
  clear: (): boolean => {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      window.localStorage.clear()
      return true
    } catch (error) {
      console.warn('Error clearing localStorage:', error)
      return false
    }
  },

  /**
   * Check if localStorage is available
   * @returns boolean indicating availability
   */
  isAvailable: (): boolean => {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      const testKey = '__localStorage_test__'
      window.localStorage.setItem(testKey, 'test')
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  },
}

// Constants for localStorage keys to avoid typos
export const STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
  THEME: 'theme',
  USER_PREFERENCES: 'user-preferences',
} as const
