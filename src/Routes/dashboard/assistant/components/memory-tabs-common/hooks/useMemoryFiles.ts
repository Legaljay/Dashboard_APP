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


import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MemoryFile } from '../types';
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { fetchMemoryFiles } from '@/redux-slice/app-memory/app-memory.slice';

interface CacheData {
  data: MemoryFile[];
  timestamp: number;
}

// Create a cache structure that allows proper cleanup
class MemoryCache {
  private cache = new Map<string, Map<string, CacheData>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set(applicationId: string, purpose: string, data: CacheData) {
    if (!this.cache.has(applicationId)) {
      this.cache.set(applicationId, new Map());
    }
    this.cache.get(applicationId)?.set(purpose, data);
  }

  get(applicationId: string, purpose: string): CacheData | undefined {
    return this.cache.get(applicationId)?.get(purpose);
  }

  delete(applicationId: string, purpose?: string) {
    if (purpose) {
      this.cache.get(applicationId)?.delete(purpose);
      // Clean up empty application maps
      if (this.cache.get(applicationId)?.size === 0) {
        this.cache.delete(applicationId);
      }
    } else {
      this.cache.delete(applicationId);
    }
  }

  isValid(applicationId: string, purpose: string): boolean {
    const cached = this.get(applicationId, purpose);
    if (!cached) return false;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.delete(applicationId, purpose);
      return false;
    }

    return true;
  }

  clear() {
    this.cache.clear();
  }
}

const memoryFilesCache = new MemoryCache();

export const useMemoryFiles = (applicationId: string, purpose: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const allMemoryFiles = useAppSelector((state) => state.memory.memoryFiles);

  const getFilteredData = useCallback((data: MemoryFile[]) => {
    return data.filter((item: MemoryFile) => item.purpose === purpose);
  }, [purpose]);

  const hasValidCache = useCallback(() => {
    return memoryFilesCache.isValid(applicationId, purpose);
  }, [applicationId, purpose]);

  const fetchData = async (forceRefresh = false) => {
    if (!applicationId) {
      console.error('No applicationId provided');
      return;
    }

    if (!forceRefresh && hasValidCache()) {
      // setLoading(false);
      return;
    }

    if (!forceRefresh && allMemoryFiles?.length > 0) {
      // setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await dispatch(fetchMemoryFiles(applicationId)).unwrap();
      
      memoryFilesCache.set(applicationId, purpose, {
        data: response.data,
        timestamp: Date.now()
      });

      setLoading(false);

      if (response.data?.length > 0) {
        if (response.data?.length === 1) {
          // Commented out as per original code
          // dispatch(showTestemployeeTour(true));
        }
      }
    } catch (error: any) {
      if (error.status === 401) {
        navigate('/');
      }
      setError(error.message);
      setLoading(false);
      memoryFilesCache.delete(applicationId, purpose);
    }
  };

  useEffect(() => {
    if (!hasValidCache()) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [applicationId, purpose]);

  // Cleanup specific cache entries when component unmounts
  // useEffect(() => {
  //   return () => {
  //     memoryFilesCache.delete(applicationId, purpose);
  //   };
  // }, [applicationId, purpose]);

  const fetchedData = useMemo(() => {
    if (hasValidCache()) {
      const cached = memoryFilesCache.get(applicationId, purpose);
      return getFilteredData(cached?.data || []);
    }
    return getFilteredData(allMemoryFiles || []);
  }, [applicationId, purpose, hasValidCache, getFilteredData, allMemoryFiles]);

  const refetch = () => fetchData(true);

  return { fetchedData, loading, error, refetch };
};