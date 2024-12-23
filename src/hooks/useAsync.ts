import { useState, useCallback } from 'react';

/**
 * Represents the state of an asynchronous operation
 * @template T The type of data that will be returned by the async operation
 */
interface AsyncState<T> {
  /** Current status of the async operation */
  status: 'idle' | 'loading' | 'success' | 'error';
  /** Data returned from the async operation when successful */
  data: T | null;
  /** Error object if the async operation fails */
  error: Error | null;
}

/**
 * A custom hook for managing asynchronous operations in React components.
 * Provides state management and utility functions for handling async operations.
 * 
 * @template T The type of data that will be returned by the async operation
 * 
 * @returns {Object} An object containing:
 *   - isIdle: boolean - Whether the async operation hasn't started
 *   - isLoading: boolean - Whether the async operation is in progress
 *   - isSuccess: boolean - Whether the async operation completed successfully
 *   - isError: boolean - Whether the async operation failed
 *   - data: T | null - The data returned by the async operation
 *   - error: Error | null - The error object if the operation failed
 *   - run: (promise: Promise<T>) => Promise<T> - Function to execute the async operation
 *   - reset: () => void - Function to reset the state to idle
 * 
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const { isLoading, data: user, error, run } = useAsync<User>();
 * 
 *   useEffect(() => {
 *     run(fetchUser(userId));
 *   }, [userId, run]);
 * 
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!user) return null;
 * 
 *   return <UserDetails user={user} />;
 * }
 * ```
 */
export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  /**
   * Executes an async operation and updates the state accordingly
   * @param promise The promise to execute
   * @returns The resolved value of the promise
   * @throws The error if the promise rejects
   */
  const run = useCallback(async (promise: Promise<T>) => {
    setState({ status: 'loading', data: null, error: null });
    try {
      const data = await promise;
      setState({ status: 'success', data, error: null });
      return data;
    } catch (error) {
      setState({ status: 'error', data: null, error: error as Error });
      throw error;
    }
  }, []);

  /**
   * Resets the state back to idle
   * Useful for clearing errors or resetting after completion
   */
  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  return {
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    data: state.data,
    error: state.error,
    run,
    reset,
  };
}
