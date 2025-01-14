import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux-slice/hooks';
import { fetchAppAnalytics } from '../redux-slice/app-analytics/app-analytics.slice';
import { fetchMemoryFiles } from '@/redux-slice/app-memory/app-memory.slice';
import { fetchBusinessWallets } from '@/redux-slice/business-wallet/business-wallet.slice';


/**
 * Interface for dashboard data
 */
export interface DashboardData {
  tasks: {
    average: number;
    total: number;
  };
  totalNewUsers: number;
  increase: {
    increaseInConversationsPercentage: number;
    increaseInCustomersPercentage: number;
  };
}

/**
 * Custom hook for managing dashboard statistics and metrics.
 * Integrates with real API endpoints and implements wallet balance polling.
 * 
 * @param {string} period - Time period for dashboard data (default: 'week')
 * @returns {Object} An object containing:
 *   - dashboardData: DashboardData | null - Current dashboard data
 *   - memoryFiles: any[] - Current memory files
 *   - walletBalance: number | null - Current wallet balance
 *   - loading: boolean - Whether data is being fetched
 *   - error: string | null - Error message if fetch failed
 *   - refreshData: () => void - Function to manually refresh dashboard data
 * 
 * @example
 * ```tsx
 * function DashboardMetrics() {
 *   const { dashboardData, memoryFiles, walletBalance, loading, error, refreshData } = useDashboardData();
 * 
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *   if (!dashboardData) return null;
 * 
 *   const {
 *     tasks,
 *     totalNewUsers,
 *     increase
 *   } = dashboardData;
 * 
 *   return (
 *     <div className="dashboard-metrics">
 *       <header>
 *         <h2>Dashboard Metrics</h2>
 *         <button onClick={refreshData}>
 *           Refresh
 *         </button>
 *       </header>
 *       <div className="metrics-grid">
 *         <MetricCard
 *           title="Average Tasks"
 *           value={tasks.average}
 *         />
 *         <MetricCard
 *           title="Total Tasks"
 *           value={tasks.total}
 *         />
 *         <MetricCard
 *           title="New Users"
 *           value={totalNewUsers}
 *         />
 *         <MetricCard
 *           title="Increase in Conversations"
 *           value={`${increase.increaseInConversationsPercentage}%`}
 *         />
 *         <MetricCard
 *           title="Increase in Customers"
 *           value={`${increase.increaseInCustomersPercentage}%`}
 *         />
 *         <MetricCard
 *           title="Wallet Balance"
 *           value={walletBalance}
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Integrates with real API endpoints for dashboard data
 * - Implements wallet balance polling every 30 seconds
 * - Includes error handling and loading states
 * - Provides manual refresh capability
 * - Auto-fetches data on component mount
 * 
 * @todo
 * - Add data caching capability
 * - Implement retry logic for failed fetches
 */
// export const useDashboardData = (period: string = 'week') => {
//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const walletBalance = useAppSelector((state) => state.businessWallet.wallets);
//   const analytics = useAppSelector((state) => state.appAnalytics.analytics);
//   const memoryFiles = useAppSelector((state) => state.memory.memoryFiles);
//   const currentAppId = useAppSelector((state) => state.applications.selectedApplication);
//   const business = useAppSelector(state => state.business.activeBusiness);
//   const businessID = (business && business.id) as string;

//   const walletCredit = walletBalance.find(wallet => wallet.currency === 'USD');
//   const walletBalanceValue = walletCredit ? walletCredit.balance : 0;

//   const fetchDashboardData = useCallback(async () => {
//     if (!currentAppId) {
//       setError('No application selected');
//       setLoading(false);
//       return;
//     }

//     try {
//       await Promise.all([
//         dispatch(fetchAppAnalytics({ applicationId: currentAppId, period })).unwrap(),
//         dispatch(fetchMemoryFiles(currentAppId)).unwrap()
//       ]);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch dashboard data');
//       console.error('Dashboard data fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [dispatch, currentAppId, period]);

//   const fetchWalletBalance = useCallback(() => {
//     dispatch(fetchBusinessWallets(businessID));
//   }, [dispatch]);

//   // Initial data fetch
//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   // Wallet balance polling
//   useEffect(() => {
//     fetchWalletBalance();
//     const pollInterval = setInterval(fetchWalletBalance, 30000); // Poll every 30 seconds

//     return () => clearInterval(pollInterval);
//   }, [fetchWalletBalance]);

//   const refreshData = useCallback(() => {
//     setLoading(true);
//     fetchDashboardData();
//     fetchWalletBalance();
//   }, [fetchDashboardData, fetchWalletBalance]);

//   return {
//     dashboardData: analytics,
//     memoryFiles,
//     walletBalance,
//     walletBalanceValue,
//     walletCredit,
//     loading,
//     error,
//     refreshData,
//   };
// };

export const useDashboardData = (period: string = 'week') => {
  const dispatch = useAppDispatch();
  const mountedRef = useRef(false);
  const pollingRef = useRef<NodeJS.Timeout>();
  const lastFetchRef = useRef<number>(0);
  const POLL_INTERVAL = 30000;
  const DEBOUNCE_DELAY = 1000;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const walletBalance = useAppSelector((state) => state.businessWallet.wallets);
  const analytics = useAppSelector((state) => state.appAnalytics.analytics);
  const memoryFiles = useAppSelector((state) => state.memory.memoryFiles);
  const currentAppId = useAppSelector((state) => state.applications.selectedApplication);
  const business = useAppSelector(state => state.business.activeBusiness);
  const businessID = (business?.id) as string;

  const walletCredit = walletBalance.find(wallet => wallet.currency === 'USD');
  const walletBalanceValue = walletCredit?.balance ?? 0;


  const fetchWalletBalance = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < DEBOUNCE_DELAY) return;
    
    lastFetchRef.current = now;
    if (!businessID || !mountedRef.current) return;
    

    try {
      await dispatch(fetchBusinessWallets(businessID)).unwrap();
    } catch (err) {
      console.error('Wallet fetch error:', err);
      // Silent fail for background polling
    }
  }, [dispatch, businessID]);

  const fetchDashboardData = useCallback(async () => {
    if (!currentAppId) {
      setError('No application selected');
      setLoading(false);
      return;
    }

    // // Check if the data is already in the store and is fresh
    // const isDataFresh = analytics && Date.now() - lastFetchRef.current < POLL_INTERVAL;

    // if (isDataFresh) {
    //   setLoading(false);
    //   return; // Don't refetch if data is fresh
    // }

    try {
      await Promise.all([
        dispatch(fetchAppAnalytics({ applicationId: currentAppId, period })).unwrap(),
        dispatch(fetchMemoryFiles(currentAppId)).unwrap()
      ]);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [dispatch, currentAppId, period]);

  useEffect(() => {
    mountedRef.current = true;
    fetchDashboardData();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!mountedRef.current || !businessID) return;

    const startPolling = () => {
      fetchWalletBalance();
      pollingRef.current = setInterval(fetchWalletBalance, POLL_INTERVAL);
    };

    startPolling();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchWalletBalance, businessID]);

  const refreshData = useCallback(() => {
    setLoading(true);
    return Promise.all([
      fetchDashboardData(),
      fetchWalletBalance()
    ]);
  }, [fetchDashboardData, fetchWalletBalance]);

  return {
    dashboardData: analytics,
    memoryFiles,
    walletBalance,
    walletBalanceValue,
    walletCredit,
    loading,
    error,
    refreshData,
  };
};