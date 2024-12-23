import { useCallback, useRef, useEffect } from 'react';

/** Type definition for any function */
type AnyFunction = (...args: any[]) => any;

/**
 * Configuration options for the useMemoizedCallback hook
 */
interface MemoizationOptions {
  /** Maximum number of cached results to store */
  maxCacheSize?: number;
  /** Time-to-live for cached results in milliseconds */
  ttl?: number;
}

/**
 * A hook that memoizes a callback function and caches its results.
 * Similar to useCallback but with result caching and cache management.
 * 
 * @template T Type of the callback function
 * @param callback The function to memoize
 * @param dependencies Array of dependencies for the callback
 * @param options Cache configuration options
 * @returns Memoized function with result caching
 * 
 * @example
 * ```tsx
 * // Basic usage with expensive calculation
 * function Calculator() {
 *   const calculateFactorial = useMemoizedCallback(
 *     (n: number): number => {
 *       if (n <= 1) return 1;
 *       return n * calculateFactorial(n - 1);
 *     },
 *     [],
 *     { maxCacheSize: 50, ttl: 60000 }
 *   );
 * 
 *   return (
 *     <div>
 *       <p>Factorial of 5: {calculateFactorial(5)}</p>
 *       <p>Factorial of 10: {calculateFactorial(10)}</p>
 *     </div>
 *   );
 * }
 * 
 * // API data transformation
 * function UserList() {
 *   const transformUserData = useMemoizedCallback(
 *     (users: RawUser[]): ProcessedUser[] => {
 *       return users.map(user => ({
 *         ...user,
 *         fullName: `${user.firstName} ${user.lastName}`,
 *         age: calculateAge(user.birthDate),
 *         status: determineUserStatus(user),
 *       }));
 *     },
 *     [],
 *     { maxCacheSize: 20 }
 *   );
 * 
 *   const [users, setUsers] = useState<RawUser[]>([]);
 * 
 *   useEffect(() => {
 *     fetchUsers().then(rawUsers => {
 *       const processedUsers = transformUserData(rawUsers);
 *       setUsers(processedUsers);
 *     });
 *   }, []);
 * 
 *   return <UserTable users={users} />;
 * }
 * 
 * // Event handling with parameters
 * function DataGrid() {
 *   const handleSort = useMemoizedCallback(
 *     (column: string, direction: 'asc' | 'desc') => {
 *       return data.sort((a, b) => {
 *         const modifier = direction === 'asc' ? 1 : -1;
 *         return modifier * a[column].localeCompare(b[column]);
 *       });
 *     },
 *     [data]
 *   );
 * 
 *   return (
 *     <Table>
 *       <Column
 *         name="name"
 *         onSort={(dir) => handleSort('name', dir)}
 *       />
 *       <Column
 *         name="email"
 *         onSort={(dir) => handleSort('email', dir)}
 *       />
 *     </Table>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Combines function memoization with result caching
 * - Automatically manages cache size and expiration
 * - Thread-safe cache access and updates
 * - Preserves function reference stability
 * 
 * @bestPractices
 * - Set appropriate cache size for memory constraints
 * - Choose TTL based on data freshness requirements
 * - Use with expensive computations only
 * - Consider cache invalidation needs
 * - Monitor cache hit rates in production
 * - Clear cache when dependencies change
 * 
 * @performance
 * - O(1) cache lookup time
 * - Automatic cache cleanup
 * - Memory-bounded cache size
 * - Minimal overhead for cache hits
 * - Efficient cache eviction
 * 
 * @caveats
 * - Only caches synchronous function results
 * - Arguments must be JSON-serializable
 * - Memory usage grows with cache size
 * - May need manual cache invalidation
 * - Not suitable for side effects
 */
export function useMemoizedCallback<T extends AnyFunction>(
  callback: T,
  dependencies: any[],
  { maxCacheSize = 100, ttl = 5 * 60 * 1000 }: MemoizationOptions = {}
): T {
  // Cache storage using Map for O(1) access
  const cache = useRef<Map<string, { result: any; timestamp: number }>>(new Map());

  // Periodically clear expired cache entries
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of cache.current.entries()) {
        if (now - value.timestamp > ttl) {
          cache.current.delete(key);
        }
      }
    }, ttl);

    return () => clearInterval(interval);
  }, [ttl]);

  return useCallback((...args: Parameters<T>) => {
    // Create cache key from stringified arguments
    const key = JSON.stringify(args);
    const now = Date.now();
    
    // Check cache for valid entry
    const cached = cache.current.get(key);
    if (cached && now - cached.timestamp < ttl) {
      return cached.result;
    }

    // Compute new result
    const result = callback(...args);

    // Manage cache size using FIFO
    if (cache.current.size >= maxCacheSize) {
      const oldestKey = cache.current.keys().next().value;
      cache.current.delete(oldestKey);
    }

    // Store new result in cache
    cache.current.set(key, { result, timestamp: now });
    return result;
  }, dependencies) as T;
}
