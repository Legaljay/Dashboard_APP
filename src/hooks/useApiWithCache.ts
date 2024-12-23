import { useCallback, useRef } from 'react';
import { useAsync } from './useAsync';

/**
 * Represents a cached item with its data and timestamp
 * @template T The type of data being cached
 */
interface CacheItem<T> {
  /** The cached data */
  data: T;
  /** Timestamp when the data was cached */
  timestamp: number;
}

/**
 * Configuration options for the cache behavior
 */
interface CacheConfig {
  /** Time to live in milliseconds before cache invalidation */
  ttl?: number;
  /** Whether caching is enabled */
  enabled?: boolean;
}

/**
 * Custom hook for making API calls with built-in caching support.
 * Provides configurable TTL and cache invalidation.
 * 
 * @template T The type of data being fetched and cached
 * @param defaultConfig Default cache configuration that applies to all fetches
 * 
 * @returns {Object} An object containing:
 *   - fetchWithCache: Function to fetch data with caching
 *   - invalidateCache: Function to invalidate cache entries
 *   - isLoading: Whether a fetch is in progress
 *   - error: Error message if fetch failed
 * 
 * @example
 * ```tsx
 * interface User {
 *   id: string;
 *   name: string;
 * }
 * 
 * function UserDirectory() {
 *   const { fetchWithCache, invalidateCache, isLoading } = useApiWithCache<User>({
 *     ttl: 5 * 60 * 1000, // 5 minutes
 *     enabled: true
 *   });
 * 
 *   const fetchUser = async (userId: string) => {
 *     const user = await fetchWithCache(
 *       `user-${userId}`,
 *       () => api.getUser(userId),
 *       { ttl: 60 * 1000 } // Override TTL for this specific call
 *     );
 *     return user;
 *   };
 * 
 *   const refreshUser = (userId: string) => {
 *     invalidateCache(`user-${userId}`);
 *     fetchUser(userId);
 *   };
 * 
 *   return (
 *     <div>
 *       {isLoading ? <Spinner /> : <UserList onRefresh={refreshUser} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useApiWithCache<T>(defaultConfig: CacheConfig = {}) {
  const cache = useRef<Record<string, CacheItem<T>>>({});
  const { run, ...asyncState } = useAsync<T>();

  /**
   * Fetches data with caching support
   * @param key Cache key for the data
   * @param fetcher Function that returns a promise with the data
   * @param config Cache configuration for this specific fetch
   * @returns Promise resolving to the data (either from cache or freshly fetched)
   */
  const fetchWithCache = useCallback(async (
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig = {}
  ) => {
    const { ttl = 5 * 60 * 1000, enabled = true } = { ...defaultConfig, ...config };
    
    if (enabled) {
      const cached = cache.current[key];
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
    }

    const data = await run(fetcher());
    
    if (enabled) {
      cache.current[key] = {
        data,
        timestamp: Date.now(),
      };
    }

    return data;
  }, [run]);

  /**
   * Invalidates cache entries
   * @param key Optional cache key to invalidate. If not provided, invalidates entire cache
   */
  const invalidateCache = useCallback((key?: string) => {
    if (key) {
      delete cache.current[key];
    } else {
      cache.current = {};
    }
  }, []);

  return {
    fetchWithCache,
    invalidateCache,
    ...asyncState,
  };
}
