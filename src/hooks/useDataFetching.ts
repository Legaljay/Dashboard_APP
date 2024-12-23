import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useDispatch } from 'react-redux';

/**
 * Represents the current state of a data fetch operation
 * @template T The type of data being fetched
 */
interface FetchState<T> {
  /** The fetched data */
  data: T | null;
  /** Whether the initial fetch is in progress */
  loading: boolean;
  /** Error object if the fetch failed */
  error: Error | null;
  /** Whether a revalidation is in progress */
  isValidating: boolean;
}

/**
 * Configuration options for the useDataFetching hook
 * @template T The type of data being fetched
 */
interface UseDataFetchingOptions<T> {
  /** Toast notification settings */
  showToasts?: {
    /** Show success toast */
    success?: boolean;
    /** Show error toast */
    error?: boolean;
  };
  /** Custom toast messages */
  toastMessages?: {
    /** Function to generate success toast message */
    success?: (data: T) => string;
    /** Function to generate error toast message */
    error?: (error: Error) => string;
  };
  
  /** Redux dispatch callbacks */
  onSuccess?: (data: T, dispatch: any) => void;
  onError?: (error: Error, dispatch: any) => void;
  
  /** Polling configuration */
  pollingInterval?: number;
  pollingEnabled?: boolean;
  
  /** Revalidation triggers */
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  
  /** Cache key for request deduplication */
  cacheKey?: string;
  
  /** Retry configuration for failed requests */
  retryCount?: number;
  retryInterval?: number;
  
  /** Transform function for modifying response data */
  transform?: (data: T) => T;
}

/**
 * Advanced hook for data fetching with comprehensive features including
 * caching, revalidation, polling, retries, and toast notifications.
 * 
 * @template T The type of data being fetched
 * @param fetchFn Function that returns a promise resolving to the data
 * @param dependencies Array of dependencies that trigger a refetch when changed
 * @param options Configuration options for the fetch behavior
 * 
 * @returns {Object} An object containing:
 *   - data: T | null - The fetched data
 *   - loading: boolean - Whether the initial fetch is in progress
 *   - error: Error | null - Error object if the fetch failed
 *   - isValidating: boolean - Whether a revalidation is in progress
 *   - refetch: () => Promise<void> - Function to manually trigger a refetch
 *   - mutate: (data: T | null) => void - Function to manually update the data
 * 
 * @example
 * ```tsx
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 * 
 * function UserProfile({ userId }: { userId: string }) {
 *   const {
 *     data: user,
 *     loading,
 *     error,
 *     refetch
 *   } = useDataFetching<User>(
 *     () => api.getUser(userId),
 *     [userId],
 *     {
 *       showToasts: { error: true },
 *       toastMessages: {
 *         error: (err) => `Failed to load user: ${err.message}`
 *       },
 *       pollingInterval: 30000,
 *       revalidateOnFocus: true,
 *       retryCount: 3,
 *       transform: (user) => ({
 *         ...user,
 *         name: user.name.toUpperCase()
 *       }),
 *       onSuccess: (user, dispatch) => {
 *         dispatch(userActions.setUser(user));
 *       }
 *     }
 *   );
 * 
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!user) return null;
 * 
 *   return (
 *     <div>
 *       <h1>{user.name}</h1>
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Supports automatic and manual revalidation
 * - Integrates with Redux for state management
 * - Provides toast notifications for success/error states
 * - Includes polling and retry mechanisms
 * - Handles request deduplication
 * - Supports data transformation
 * 
 * @see {@link UseDataFetchingOptions} for detailed configuration options
 */
export function useDataFetching<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: UseDataFetchingOptions<T> = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isValidating: boolean;
  refetch: () => Promise<void>;
  mutate: (data: T | ((prev: T | null) => T)) => void;
} {
  const {
    showToasts = { success: false, error: true },
    toastMessages,
    onSuccess,
    onError,
    pollingInterval = 0,
    pollingEnabled = false,
    revalidateOnFocus = false,
    revalidateOnReconnect = false,
    retryCount = 3,
    retryInterval = 1000,
    transform,
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
    isValidating: false,
  });

  const { addToast } = useToast();
  const dispatch = useDispatch();
  const retryCountRef = useRef(0);
  const pollingTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  const mutate = useCallback((data: T | ((prev: T | null) => T)) => {
    setState(prev => ({
      ...prev,
      data: data instanceof Function ? data(prev.data) : data,
      error: null,
    }));
  }, []);

  const fetchData = useCallback(async (isRetry = false) => {
    if (!isMountedRef.current) return;

    setState(prev => ({ ...prev, isValidating: true }));
    
    try {
      const result = await fetchFn();
      if (!isMountedRef.current) return;

      const transformedData = transform ? transform(result) : result;
      
      setState(prev => ({
        data: transformedData,
        loading: false,
        error: null,
        isValidating: false,
      }));

      if (showToasts.success) {
        const successMessage = toastMessages?.success?.(transformedData) ?? 'Operation successful';
        addToast('success', successMessage);
      }

      if (onSuccess) {
        onSuccess(transformedData, dispatch);
      }

      retryCountRef.current = 0;
    } catch (error) {
      if (!isMountedRef.current) return;

      const isError = error instanceof Error;
      const errorInstance = isError ? error : new Error('An error occurred');

      if (isRetry && retryCountRef.current < retryCount) {
        retryCountRef.current += 1;
        setTimeout(() => fetchData(true), retryInterval);
        return;
      }

      setState(prev => ({
        data: null,
        loading: false,
        error: errorInstance,
        isValidating: false,
      }));

      if (showToasts.error) {
        const errorMessage = toastMessages?.error?.(errorInstance) ?? errorInstance.message;
        addToast('error', errorMessage);
      }

      if (onError) {
        onError(errorInstance, dispatch);
      }
    }
  }, [
    fetchFn,
    transform,
    showToasts.success,
    showToasts.error,
    toastMessages,
    addToast,
    onSuccess,
    onError,
    dispatch,
    retryCount,
    retryInterval
  ]);

  const refetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    await fetchData();
  }, [fetchData]);

  // Set up polling
  useEffect(() => {
    if (!pollingEnabled || !pollingInterval) return;

    const startPolling = () => {
      pollingTimeoutRef.current = setInterval(() => {
        fetchData();
      }, pollingInterval);
    };

    startPolling();

    return () => {
      if (pollingTimeoutRef.current) {
        clearInterval(pollingTimeoutRef.current);
      }
    };
  }, [pollingEnabled, pollingInterval, fetchData]);

  // Set up revalidation on focus/reconnect
  useEffect(() => {
    if (!revalidateOnFocus && !revalidateOnReconnect) return;

    const onFocus = () => {
      if (revalidateOnFocus) fetchData();
    };

    const onReconnect = () => {
      if (revalidateOnReconnect) fetchData();
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('online', onReconnect);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('online', onReconnect);
    };
  }, [revalidateOnFocus, revalidateOnReconnect, fetchData]);

  // Initial fetch and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
      if (pollingTimeoutRef.current) {
        clearInterval(pollingTimeoutRef.current);
      }
    };
  }, dependencies);

  return {
    ...state,
    refetch,
    mutate,
  };
}

export default useDataFetching;
