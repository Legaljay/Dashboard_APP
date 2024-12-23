import { useCallback, useRef } from 'react';
import { useLoadingState } from './useLoadingState';

/**
 * Configuration options for the useApi hook
 * @template T The type of data returned by the API
 */
interface UseApiConfig<T> {
  /** Callback function called when the API call succeeds */
  onSuccess?: (data: T) => void;
  /** Callback function called when the API call fails */
  onError?: (error: Error) => void;
  /** Transform function to convert API response to desired format */
  transform?: (data: any) => T;
}

/**
 * Return type for the useApi hook
 * @template T The type of data returned by the API
 */
interface UseApiReturn<T> {
  /** The transformed API response data */
  data: T | null;
  /** Whether an API call is in progress */
  isLoading: boolean;
  /** Error message if the API call failed */
  error: string | null;
  /** Function to execute the API call */
  execute: (...args: any[]) => Promise<T>;
  /** Function to reset the hook's state */
  reset: () => void;
}

/**
 * Custom hook for managing API calls with loading, error, and success states.
 * Provides type-safe data transformation and error handling.
 * 
 * @template T The type of data returned by the API after transformation
 * @param apiFunction The API function to call
 * @param config Configuration options for success/error handling and data transformation
 * 
 * @returns {UseApiReturn<T>} Object containing API call state and control functions
 * 
 * @example
 * ```tsx
 * interface User {
 *   id: string;
 *   name: string;
 * }
 * 
 * function UserProfile() {
 *   const { data: user, isLoading, error, execute } = useApi<User>(
 *     fetchUser,
 *     {
 *       onSuccess: (user) => console.log('User loaded:', user.name),
 *       onError: (error) => showErrorToast(error.message),
 *       transform: (data) => ({
 *         id: data.user_id,
 *         name: data.user_name
 *       })
 *     }
 *   );
 * 
 *   useEffect(() => {
 *     execute('user123');
 *   }, [execute]);
 * 
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!user) return null;
 * 
 *   return <UserDetails user={user} />;
 * }
 * ```
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<any>,
  config: UseApiConfig<T> = {}
): UseApiReturn<T> {
  const {
    onSuccess,
    onError,
    transform = (data: any) => data as T,
  } = config;

  const { isLoading, error, setError, withLoading } = useLoadingState();
  const dataRef = useRef<T | null>(null);

  /**
   * Executes the API call with the provided arguments
   * Handles loading state, data transformation, and error handling
   * @param args Arguments to pass to the API function
   * @returns Promise resolving to the transformed data
   * @throws Error if the API call fails
   */
  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      try {
        const result = await withLoading(apiFunction(...args));
        const transformedData = transform(result);
        dataRef.current = transformedData;
        onSuccess?.(transformedData);
        return transformedData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error.message);
        onError?.(error);
        throw error;
      }
    },
    [apiFunction, withLoading, transform, onSuccess, onError, setError]
  );

  /**
   * Resets the hook's state to initial values
   * Useful for clearing errors or data between API calls
   */
  const reset = useCallback(() => {
    dataRef.current = null;
    setError(null);
  }, [setError]);

  return {
    data: dataRef.current,
    isLoading,
    error,
    execute,
    reset,
  };
}
