import { useState, useCallback } from 'react';

/**
 * Return type for the useLoadingState hook
 */
interface UseLoadingStateReturn {
  /** Whether the operation is currently loading */
  isLoading: boolean;
  /** Error message if the operation failed, null otherwise */
  error: string | null;
  /** Directly set the loading state */
  setLoading: (loading: boolean) => void;
  /** Directly set the error state */
  setError: (error: string | null) => void;
  /** Start loading state and clear any errors */
  startLoading: () => void;
  /** Stop loading state */
  stopLoading: () => void;
  /** Clear any error messages */
  clearError: () => void;
  /** Wrap an async operation with loading state management */
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

/**
 * A hook that manages loading and error states for async operations.
 * Provides utilities for handling loading states, error handling, and wrapping promises.
 * 
 * @param initialLoading Initial loading state
 * @returns Object containing loading state utilities
 * 
 * @example
 * ```tsx
 * // Basic usage with API call
 * function UserProfile({ userId }: { userId: string }) {
 *   const {
 *     isLoading,
 *     error,
 *     withLoading
 *   } = useLoadingState();
 * 
 *   const [user, setUser] = useState<User | null>(null);
 * 
 *   useEffect(() => {
 *     withLoading(
 *       fetchUser(userId)
 *     ).then(setUser);
 *   }, [userId]);
 * 
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *   if (!user) return null;
 * 
 *   return <UserDetails user={user} />;
 * }
 * 
 * // Manual loading state management
 * function DataExport() {
 *   const {
 *     isLoading,
 *     error,
 *     startLoading,
 *     stopLoading,
 *     setError,
 *     clearError
 *   } = useLoadingState();
 * 
 *   const handleExport = async () => {
 *     try {
 *       startLoading();
 *       clearError();
 *       await exportData();
 *       showSuccessToast('Export complete');
 *     } catch (err) {
 *       setError('Export failed: ' + err.message);
 *     } finally {
 *       stopLoading();
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button
 *         onClick={handleExport}
 *         disabled={isLoading}
 *       >
 *         {isLoading ? 'Exporting...' : 'Export Data'}
 *       </button>
 *       {error && <ErrorBanner message={error} />}
 *     </div>
 *   );
 * }
 * 
 * // Multiple concurrent operations
 * function Dashboard() {
 *   const users = useLoadingState();
 *   const posts = useLoadingState();
 *   const comments = useLoadingState();
 * 
 *   useEffect(() => {
 *     users.withLoading(fetchUsers());
 *     posts.withLoading(fetchPosts());
 *     comments.withLoading(fetchComments());
 *   }, []);
 * 
 *   const isLoading = users.isLoading || posts.isLoading || comments.isLoading;
 *   const error = users.error || posts.error || comments.error;
 * 
 *   return (
 *     <div>
 *       {isLoading && <LoadingOverlay />}
 *       {error && <ErrorMessage message={error} />}
 *       <DashboardContent />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Manages both loading and error states
 * - Provides both manual and automatic state management
 * - Handles promise rejections automatically
 * - Supports multiple concurrent operations
 * - Type-safe promise handling
 * 
 * @bestPractices
 * - Use withLoading for simple async operations
 * - Use manual control for complex loading sequences
 * - Clear errors when starting new operations
 * - Handle specific error types appropriately
 * - Consider UX when showing loading states
 * - Use multiple instances for independent operations
 * 
 * @performance
 * - Minimal state updates
 * - Memoized utility functions
 * - No unnecessary re-renders
 * - Efficient error handling
 */
export const useLoadingState = (initialLoading = false): UseLoadingStateReturn => {
  // Track loading and error states
  const [isLoading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  // Memoized utility functions
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  const clearError = useCallback(() => setError(null), []);

  /**
   * Wraps a promise with loading state management
   * Automatically handles loading state and error handling
   */
  const withLoading = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    try {
      startLoading();
      clearError();
      const result = await promise;
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      stopLoading();
    }
  }, [startLoading, clearError, stopLoading]);

  return {
    isLoading,
    error,
    setLoading,
    setError,
    startLoading,
    stopLoading,
    clearError,
    withLoading,
  };
};
