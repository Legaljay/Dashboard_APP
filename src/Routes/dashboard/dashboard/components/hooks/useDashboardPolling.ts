// import { useEffect, useCallback } from 'react';
// import { useAppDispatch } from '@/redux-slice/hooks';
// import { getWalletBalance } from '@/redux-slice/applications/applications.slice';

// /**
//  * Custom hook for polling dashboard data at regular intervals
//  * @param {number} interval - Polling interval in milliseconds (default: 30000ms)
//  */
// export const useDashboardPolling = (interval: number = 30000) => {
//   const dispatch = useAppDispatch();

//   const fetchWalletBalance = useCallback(() => {
//     dispatch(getWalletBalance());
//   }, [dispatch]);

//   useEffect(() => {
//     // Initial fetch
//     fetchWalletBalance();

//     // Set up polling
//     const pollInterval = setInterval(fetchWalletBalance, interval);

//     // Cleanup on unmount
//     return () => clearInterval(pollInterval);
//   }, [fetchWalletBalance, interval]);

//   return {
//     refreshWalletBalance: fetchWalletBalance
//   };
// };
