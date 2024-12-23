import { useState, useEffect } from 'react';

/**
 * A hook that returns a debounced value that only updates after a specified delay
 * has passed without any new updates to the original value.
 * 
 * @template T The type of the value being debounced
 * @param value The value to debounce
 * @param delay The delay in milliseconds before the debounced value updates
 * @returns The debounced value
 * 
 * @example
 * ```tsx
 * // Basic search input with debouncing
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 *   useEffect(() => {
 *     // Only called 500ms after the user stops typing
 *     searchAPI(debouncedSearch);
 *   }, [debouncedSearch]);
 * 
 *   return (
 *     <input
 *       type="text"
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 * 
 * // Form validation with debouncing
 * function RegistrationForm() {
 *   const [username, setUsername] = useState('');
 *   const debouncedUsername = useDebounce(username, 800);
 * 
 *   useEffect(() => {
 *     if (debouncedUsername) {
 *       checkUsernameAvailability(debouncedUsername);
 *     }
 *   }, [debouncedUsername]);
 * 
 *   return (
 *     <input
 *       type="text"
 *       value={username}
 *       onChange={(e) => setUsername(e.target.value)}
 *       placeholder="Choose username"
 *     />
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Useful for reducing API calls in search inputs
 * - Can improve performance by limiting expensive operations
 * - Helps prevent unnecessary re-renders
 * - Cleans up timeouts automatically on unmount
 * 
 * @bestPractices
 * - Choose an appropriate delay based on your use case:
 *   - Search inputs: 300-500ms
 *   - Form validation: 800-1000ms
 *   - Autosave: 1000-2000ms
 * - Use a longer delay for expensive operations
 * - Consider using a shorter delay for better UX in critical features
 * 
 * @performance
 * - The hook uses a single timeout
 * - Cleanup is handled automatically
 * - Memory usage is minimal
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Store the debounced value in state
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run effect if value or delay changes

  return debouncedValue;
}
