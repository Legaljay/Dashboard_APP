// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { MemoryFile } from '../types';
// import { useAppDispatch } from '@/redux-slice/hooks';
// import { fetchMemoryFiles } from '@/redux-slice/app-memory/app-memory.slice';

// export const useMemoryFiles = (applicationId: string, purpose: string) => {
//   const [fetchedData, setFetchedData] = useState<MemoryFile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();


//   const fetchData = async () => {
//     if (!applicationId) {
//       console.error('No applicationId provided');
//       return;
//     }

//     try {
//       const response = await dispatch(fetchMemoryFiles(applicationId)).unwrap();
  
//       const filteredData = response.data.filter(
//         (item: MemoryFile) => item.purpose === purpose
//       );

//       setFetchedData(filteredData);
//       setLoading(false);

//       if (response.data?.length > 0) {
//         // dispatch(setMemoryExists(true));
//         if (response.data?.length === 1) {
//           // dispatch(showTestemployeeTour(true));
//         }
//       } else {
//         // dispatch(setMemoryExists(false));
//         // dispatch(showTestemployeeTour(false));
//       }
//     } catch (error: any) {
//       if (error.status === 401) {
//         navigate('/');
//       }
//       setError(error.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [applicationId]);

//   const refetch = () => fetchData();

//   return { fetchedData, loading, error, refetch };
// };


// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { useNavigate } from 'react-router';
// import { MemoryFile } from '../types';
// import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
// import { fetchMemoryFiles } from '@/redux-slice/app-memory/app-memory.slice';

// interface CacheData {
//   data: MemoryFile[];
//   timestamp: number;
// }

// interface CacheKey {
//   applicationId: string;
//   purpose: string;
// }

// // Use WeakMap with object keys for better memory management
// const memoryFilesCache = new WeakMap<CacheKey, CacheData>();

// export const useMemoryFiles = (applicationId: string, purpose: string) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   // Get the filtered data from Redux store
//   const allMemoryFiles = useAppSelector((state) => state.memory.memoryFiles);
  
//   // Create cache key object that can be used with WeakMap
//   const cacheKey = useMemo(() => ({
//     applicationId,
//     purpose
//   }), [applicationId, purpose]);

//   const getFilteredData = useCallback((data: MemoryFile[]) => {
//     return data.filter((item: MemoryFile) => item.purpose === purpose);
//   }, [purpose]);

//   const hasValidCache = useCallback(() => {
//     const cached = memoryFilesCache.get(cacheKey);
//     if (!cached) return false;

//     const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
//     const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
    
//     if (isExpired) {
//       memoryFilesCache.delete(cacheKey);
//       return false;
//     }
    
//     return true;
//   }, [cacheKey]);

//   const fetchData = async (forceRefresh = false) => {
//     if (!applicationId) {
//       console.error('No applicationId provided');
//       return;
//     }

//     // Check if we have valid cache and aren't force refreshing
//     if (!forceRefresh && hasValidCache()) {
//       const cached = memoryFilesCache.get(cacheKey);
//       if (cached) {
//         setLoading(false);
//         return;
//       }
//     }

//     // Check if we already have data in Redux store
//     if (!forceRefresh && allMemoryFiles?.length > 0) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await dispatch(fetchMemoryFiles(applicationId)).unwrap();
      
//       // Update cache
//       memoryFilesCache.set(cacheKey, {
//         data: response.data,
//         timestamp: Date.now()
//       });

//       setLoading(false);

//       if (response.data?.length > 0) {
//         if (response.data?.length === 1) {
//           // Commented out as per original code
//           // dispatch(showTestemployeeTour(true));
//         }
//       }
//     } catch (error: any) {
//       if (error.status === 401) {
//         navigate('/');
//       }
//       setError(error.message);
//       setLoading(false);
//       // Clear cache on error
//       memoryFilesCache.delete(cacheKey);
//     }
//   };

//   useEffect(() => {
//     if (!hasValidCache()) {
//       fetchData();
//     } else {
//       setLoading(false);
//     }
//   }, [applicationId, purpose]);

//   // Get the current data (either from cache or Redux store)
//   const fetchedData = useMemo(() => {
//     if (hasValidCache()) {
//       const cached = memoryFilesCache.get(cacheKey);
//       return getFilteredData(cached?.data || []);
//     }
//     return getFilteredData(allMemoryFiles || []);
//   }, [cacheKey, hasValidCache, getFilteredData, allMemoryFiles]);

//   const refetch = () => fetchData(true);

//   return { fetchedData, loading, error, refetch };
// };

//with caching
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MemoryFile } from '../types';
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { fetchMemoryFiles } from '@/redux-slice/app-memory/app-memory.slice';

interface CacheData {
  data: MemoryFile[];
  timestamp: number;
  error?: string;
}

class MemoryCache {
  private cache = new Map<string, Map<string, CacheData>>();
  private readonly CACHE_DURATION: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(cacheDuration = 5 * 60 * 1000) { // 5 minutes default
    this.CACHE_DURATION = cacheDuration;
    // Periodic cleanup of expired entries
    this.cleanupInterval = setInterval(() => this.cleanupExpired(), this.CACHE_DURATION);
  }

  private getCacheKey(applicationId: string, purpose: string): string {
    return `${applicationId}:${purpose}`;
  }

  set(applicationId: string, purpose: string, data: CacheData) {
    if (!applicationId || !purpose) return;
    
    if (!this.cache.has(applicationId)) {
      this.cache.set(applicationId, new Map());
    }
    this.cache.get(applicationId)?.set(purpose, {
      ...data,
      timestamp: Date.now()
    });
  }

  get(applicationId: string, purpose: string): CacheData | undefined {
    if (!applicationId || !purpose) return undefined;
    return this.cache.get(applicationId)?.get(purpose);
  }

  delete(applicationId: string, purpose?: string) {
    if (!applicationId) return;
    
    if (purpose) {
      this.cache.get(applicationId)?.delete(purpose);
      if (this.cache.get(applicationId)?.size === 0) {
        this.cache.delete(applicationId);
      }
    } else {
      this.cache.delete(applicationId);
    }
  }

  isValid(applicationId: string, purpose: string): boolean {
    if (!applicationId || !purpose) return false;
    
    const cached = this.get(applicationId, purpose);
    if (!cached) return false;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.delete(applicationId, purpose);
      return false;
    }

    return true;
  }

  private cleanupExpired() {
    this.cache.forEach((purposeMap, applicationId) => {
      purposeMap.forEach((data, purpose) => {
        if (Date.now() - data.timestamp > this.CACHE_DURATION) {
          this.delete(applicationId, purpose);
        }
      });
    });
  }

  clear() {
    this.cache.clear();
    clearInterval(this.cleanupInterval);
  }

  dispose() {
    this.clear();
    clearInterval(this.cleanupInterval);
  }
}

const memoryFilesCache = new MemoryCache();

export const useMemoryFiles = (applicationId: string, purpose: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const allMemoryFiles = useAppSelector((state) => state.memory.memoryFiles);

  // Validate inputs
  useEffect(() => {
    if (!applicationId || !purpose) {
      setError('Invalid applicationId or purpose');
      return;
    }
    setError(null);
  }, [applicationId, purpose]);

  const getFilteredData = useCallback((data: MemoryFile[] | null | undefined) => {
    if (!data) return [];
    return data.filter((item: MemoryFile) => item.purpose === purpose);
  }, [purpose]);

  const hasValidCache = useCallback(() => {
    return memoryFilesCache.isValid(applicationId, purpose);
  }, [applicationId, purpose]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!applicationId || !purpose) {
      console.error('Missing required parameters');
      setError('Missing required parameters');
      return;
    }

    if (!forceRefresh && hasValidCache()) {
      return;
    }

    if (!forceRefresh && allMemoryFiles?.length > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await dispatch(fetchMemoryFiles(applicationId)).unwrap();
      
      if (!response || !response.data) {
        throw new Error('Invalid response format');
      }

      memoryFilesCache.set(applicationId, purpose, {
        data: response.data,
        timestamp: Date.now()
      });

      setInitialized(true);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch memory files';
      
      if (error.status === 401) {
        navigate('/');
      }
      
      setError(errorMessage);
      memoryFilesCache.delete(applicationId, purpose);
      
      // Cache the error state to prevent constant retries
      memoryFilesCache.set(applicationId, purpose, {
        data: [],
        timestamp: Date.now(),
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [applicationId, purpose, dispatch, navigate, hasValidCache, allMemoryFiles]);

  // Initial fetch
  useEffect(() => {
    if (!initialized && !hasValidCache()) {
      fetchData();
    }
  }, [initialized, hasValidCache, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Optional: Uncomment if you want to clear cache on unmount
      // memoryFilesCache.delete(applicationId, purpose);
    };
  }, [applicationId, purpose]);

  const fetchedData = useMemo(() => {
    if (hasValidCache()) {
      const cached = memoryFilesCache.get(applicationId, purpose);
      return getFilteredData(cached?.data);
    }
    return getFilteredData(allMemoryFiles);
  }, [applicationId, purpose, hasValidCache, getFilteredData, allMemoryFiles]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return {
    fetchedData,
    loading,
    error,
    refetch,
    isInitialized: initialized
  };
};