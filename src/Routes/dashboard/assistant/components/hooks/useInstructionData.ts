// import { AppCategory, fetchAppCategories, selectAllCategories } from '@/redux-slice/app-categories/app-categories.slice';
// import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
// import { useState, useEffect, useCallback } from 'react';


// export interface ServiceBlocksData {
//   id: string;
//   name: string;
//   description: string;
//   [key: string]: any;
// }

// export const useInstructionData = (applicationId: string) => {
//   const dispatch = useAppDispatch();
//   const { loading, updating, deleting, creating, error, categories: serviceBlocksData } = useAppSelector((state) => state.appCategories);

//   const fetchData = useCallback(async () => {
//     if (!applicationId) {
//       console.error('No applicationId provided');
//       return;
//     }

//     try {
//       const response = await dispatch(fetchAppCategories(applicationId)).unwrap();
    
//       // setData(response.categories.data); //TODO: replace with redux store data

//     } catch (error) {
//       console.error('Error fetching instruction data:', error);
//     } 
//   }, [applicationId]);

//   const handleFetchUpdate = useCallback(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData, applicationId]);

//   return {
//     loading,
//     serviceBlocksData,
//     refetch: fetchData,
//     handleFetchUpdate,
//   };
// };


import { AppCategory, fetchAppCategories, selectAllCategories } from '@/redux-slice/app-categories/app-categories.slice';
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { useState, useEffect, useCallback, useRef } from 'react';

export interface ServiceBlocksData {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
}

export const useInstructionData = (applicationId: string) => {
  const dispatch = useAppDispatch();
  const { loading, updating, deleting, creating, error, categories: serviceBlocksData, applicationId: AppID } = useAppSelector(
    (state) => state.appCategories
  );
  // Check if we have data in the Redux store for this applicationId
  const hasDataInStore = useCallback(() => {
    if (!applicationId || !serviceBlocksData) return false;
    // Assuming serviceBlocksData is an array or object that contains data specific to the applicationId
    // Adjust this check based on your actual data structure
    return (AppID === applicationId);
  }, [applicationId, serviceBlocksData]);

  const fetchData = useCallback(async (forceRefetch = false) => {
    if (!applicationId) {
      console.error('No applicationId provided');
      return;
    }

    // Skip fetch if we already have data in store and aren't force refreshing
    if (!forceRefetch && hasDataInStore()) {
      return;
    }

    try {
      await dispatch(fetchAppCategories(applicationId)).unwrap();
    } catch (error) {
      console.error('Error fetching instruction data:', error);
    }
  }, [applicationId, dispatch, hasDataInStore]);

  const handleFetchUpdate = useCallback(() => {
    fetchData(true); // Force refresh when explicitly requested
  }, [fetchData]);

  useEffect(() => {
    // Only fetch if we don't have the data in store
    if (!hasDataInStore()) {
      fetchData();
    }
  }, [fetchData, hasDataInStore, applicationId]);

  return {
    loading,
    serviceBlocksData,
    refetch: () => fetchData(true),
    handleFetchUpdate,
  };
};
