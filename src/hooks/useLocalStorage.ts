import { useState, useEffect } from 'react';

/**
 * A hook that provides persistent state management using localStorage.
 * Works similarly to useState but persists the value across page reloads.
 * 
 * @template T The type of the stored value
 * @param key The localStorage key to store the value under
 * @param initialValue The initial value (used if no value exists in localStorage)
 * @returns A tuple containing the stored value and a setter function
 * 
 * @example
 * ```tsx
 * // Basic usage
 * function UserSettings() {
 *   const [theme, setTheme] = useLocalStorage('theme', 'light');
 * 
 *   return (
 *     <select
 *       value={theme}
 *       onChange={(e) => setTheme(e.target.value)}
 *     >
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *     </select>
 *   );
 * }
 * 
 * // Complex objects
 * interface UserPreferences {
 *   theme: 'light' | 'dark';
 *   fontSize: number;
 *   notifications: boolean;
 * }
 * 
 * function PreferencesPanel() {
 *   const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
 *     'preferences',
 *     {
 *       theme: 'light',
 *       fontSize: 14,
 *       notifications: true,
 *     }
 *   );
 * 
 *   const updatePreference = <K extends keyof UserPreferences>(
 *     key: K,
 *     value: UserPreferences[K]
 *   ) => {
 *     setPreferences(prev => ({
 *       ...prev,
 *       [key]: value,
 *     }));
 *   };
 * 
 *   return (
 *     <div>
 *       <select
 *         value={preferences.theme}
 *         onChange={(e) => updatePreference('theme', e.target.value as 'light' | 'dark')}
 *       >
 *         <option value="light">Light</option>
 *         <option value="dark">Dark</option>
 *       </select>
 *       
 *       <input
 *         type="number"
 *         value={preferences.fontSize}
 *         onChange={(e) => updatePreference('fontSize', Number(e.target.value))}
 *       />
 *       
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={preferences.notifications}
 *           onChange={(e) => updatePreference('notifications', e.target.checked)}
 *         />
 *         Enable Notifications
 *       </label>
 *     </div>
 *   );
 * }
 * 
 * // Functional updates
 * function Counter() {
 *   const [count, setCount] = useLocalStorage('count', 0);
 * 
 *   return (
 *     <button onClick={() => setCount(prev => prev + 1)}>
 *       Count: {count}
 *     </button>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Persists data across page reloads
 * - Supports all JSON-serializable values
 * - Handles SSR gracefully
 * - Provides useState-like API
 * - Includes error handling
 * 
 * @bestPractices
 * - Use meaningful keys to avoid conflicts
 * - Keep stored values reasonably small
 * - Handle potential parsing errors
 * - Consider using prefixes for keys
 * - Clear old/unused keys
 * - Use appropriate initial values
 * 
 * @performance
 * - Minimizes localStorage access
 * - Handles JSON parsing efficiently
 * - Prevents unnecessary re-renders
 * - Lazy initial value reading
 * 
 * @limitations
 * - Limited by localStorage size (~5-10MB)
 * - Only supports JSON-serializable data
 * - Synchronous storage operations
 * - No expiration mechanism
 * - Not suitable for sensitive data
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  /**
   * Read the value from localStorage or return initialValue
   * Handles SSR and parsing errors gracefully
   */
  const readValue = () => {
    // Handle SSR
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Parse stored json or return initialValue
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  /**
   * Return a wrapped version of useState's setter function that
   * persists the new value to localStorage
   */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Read stored value on mount
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue, setValue] as const;
}
