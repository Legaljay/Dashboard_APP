import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  period: string;
  timestamp: string;
}

interface AnalyticsData {
  metrics: AnalyticsMetric[];
  summary: {
    totalRequests: number;
    totalUsers: number;
    avgResponseTime: number;
    successRate: number;
  };
  trends: {
    daily: AnalyticsMetric[];
    weekly: AnalyticsMetric[];
    monthly: AnalyticsMetric[];
  };
}

interface AppAnalyticsState {
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppAnalyticsState = {
  analytics: null,
  loading: false,
  error: null,
};

export const fetchAppAnalytics = createAsyncThunk(
  'appAnalytics/fetchAnalytics',
  async ({applicationId, period}: {applicationId: string; period: string}, { rejectWithValue }) => {
    try {
      const response = await api.get(`${ApiEndpoints.APP_ANALYTICS.replace(':applicationId', applicationId)}?period=${period}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

const appAnalyticsSlice = createSlice({
  name: 'appAnalytics',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAppAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors, resetState } = appAnalyticsSlice.actions;

// Selectors
export const selectAppAnalyticsState = (state: RootState) => state.appAnalytics;
export const selectAnalytics = (state: RootState) => state.appAnalytics.analytics;
export const selectAppAnalyticsLoading = (state: RootState) => state.appAnalytics.loading;
export const selectAppAnalyticsError = (state: RootState) => state.appAnalytics.error;

// Memoized Selectors
export const selectDailyTrends = (state: RootState) => state.appAnalytics.analytics?.trends.daily || [];
export const selectWeeklyTrends = (state: RootState) => state.appAnalytics.analytics?.trends.weekly || [];
export const selectMonthlyTrends = (state: RootState) => state.appAnalytics.analytics?.trends.monthly || [];
export const selectAnalyticsSummary = (state: RootState) => state.appAnalytics.analytics?.summary || null;

export default appAnalyticsSlice.reducer;
