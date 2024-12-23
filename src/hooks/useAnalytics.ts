import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchAnalyticsData } from '../store/slices/analyticsSlice';
import { RootState } from '../store/types';

/**
 * Custom hook for managing analytics data in the application.
 * Handles fetching, caching, and refreshing of analytics data using Redux.
 * 
 * @returns {Object} An object containing:
 *   - analyticsData: any - The current analytics data
 *   - isLoading: boolean - Whether analytics data is being fetched
 *   - error: string | null - Error message if fetch failed
 *   - refreshAnalytics: () => void - Function to manually refresh analytics data
 * 
 * @example
 * ```tsx
 * function AnalyticsDashboard() {
 *   const { analyticsData, isLoading, error, refreshAnalytics } = useAnalytics();
 * 
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} />;
 * 
 *   return (
 *     <div>
 *       <button onClick={refreshAnalytics}>Refresh Data</button>
 *       <AnalyticsDisplay data={analyticsData} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useAnalytics = () => {
  const dispatch = useAppDispatch();
  const analytics = useAppSelector((state: RootState) => state.analytics);
  const { data, loading, error } = analytics;

  // Automatically fetch analytics data if not already loaded
  useEffect(() => {
    if (!data && !loading && !error) {
      dispatch(fetchAnalyticsData());
    }
  }, [dispatch, data, loading, error]);

  /**
   * Manually triggers a refresh of the analytics data
   * Useful for updating data after actions or on user request
   */
  const refreshAnalytics = () => {
    dispatch(fetchAnalyticsData());
  };

  return {
    analyticsData: data,
    isLoading: loading,
    error,
    refreshAnalytics,
  };
};
