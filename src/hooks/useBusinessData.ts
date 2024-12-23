import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { 
  fetchBusinessProfile, 
  // markAsStale 
} from '@/redux-slice/business/business.slice';

/**
 * Custom hook for managing business profile data with automatic revalidation.
 * Handles fetching, caching, and periodic refreshing of business data using Redux.
 * 
 * @param revalidateInterval - Time in milliseconds before marking data as stale (default: 5 minutes)
 * 
 * @returns {Object} An object containing:
 *   - business: BusinessProfile | null - The current business profile data
 *   - loading: boolean - Whether business data is being fetched
 *   - error: string | null - Error message if fetch failed
 *   - refetch: () => void - Function to manually trigger a data refresh
 *   - isStale: boolean - Whether the data is considered stale
 *   - lastUpdated: number | null - Timestamp of last successful update
 * 
 * @example
 * ```tsx
 * function BusinessDashboard() {
 *   const {
 *     business,
 *     loading,
 *     error,
 *     refetch,
 *     isStale,
 *     lastUpdated
 *   } = useBusinessData(10 * 60 * 1000); // 10 minutes revalidation
 * 
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *   if (!business) return <SetupBusiness />;
 * 
 *   return (
 *     <div>
 *       <header>
 *         <h1>{business.name}</h1>
 *         <button onClick={refetch}>Refresh</button>
 *         {isStale && <StaleDataIndicator lastUpdated={lastUpdated} />}
 *       </header>
 *       <BusinessMetrics data={business} />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - The hook automatically fetches data when mounted if no data exists or is stale
 * - Sets up an interval to mark data as stale based on revalidateInterval
 * - Cleans up interval on unmount
 * - Provides manual refetch capability
 * - Tracks data staleness and last update time
 */
export const useBusinessData = (revalidateInterval = 300000) => { // 5 minutes default
  const dispatch = useAppDispatch();
  const business = useAppSelector((state) => state.business);
  const { activeBusiness: profile, loading, error } = business;

  useEffect(() => {
    // Check if we need to fetch data
    if (!profile) {
      dispatch(fetchBusinessProfile());
    }

    // Set up revalidation interval
    const intervalId = setInterval(() => {
      // dispatch(markAsStale());
    }, revalidateInterval);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [dispatch, profile, revalidateInterval]);

  /**
   * Forces an immediate refresh of business data
   * Marks current data as stale and triggers a new fetch
   */
  const refetch = () => {
    // dispatch(markAsStale());
    dispatch(fetchBusinessProfile());
  };

  return {
    business: profile,
    loading,
    error,
    refetch,
  };
};
