import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux-slice/store';
import { fetchWalletBalance } from '@/redux-slice/wallet/walletBalanceSlice';
import { getApplicationDraft } from '@/features/application/getApplicationByIdSlice';
import axios from 'axios';
import TokenService from '@/utils/token';

interface DashboardData {
  tasks?: {
    average: number;
  };
  increase?: {
    increaseInConversationsPercentage: number;
    increaseInCustomersPercentage: number;
  };
  totalNewUsers?: number;
}

export const useDashboardData = (applicationId: string | undefined) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [isDataM, setIsDataM] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const walletBalance = useSelector((state: RootState) => state.walletBalance);
  const URL = process.env.REACT_APP_BASEURL;

  const fetchDashboardData = async (period: string) => {
    if (!applicationId) return;

    try {
      setLoading(true);
      const token = TokenService.getToken();
      
      const [analyticsResponse, memoryResponse] = await Promise.all([
        axios.get(
          `${URL}/dashboard/applications/${applicationId}/analytics?period=${period}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${URL}/dashboard/applications/${applicationId}/memory`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ]);

      setDashboardData(analyticsResponse.data.data);
      setIsDataM(memoryResponse.data.data.length > 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) {
      dispatch(getApplicationDraft(applicationId));
    }
  }, [applicationId, dispatch]);

  useEffect(() => {
    const fetchWallet = async () => {
      await dispatch(fetchWalletBalance());
    };

    // Initial fetch
    fetchWallet();
    setFirstRender(false);

    // Polling every 10 seconds
    const intervalId = setInterval(fetchWallet, 10000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return {
    dashboardData,
    isDataM,
    loading,
    firstRender,
    fetchDashboardData,
    walletBalance
  };
};
