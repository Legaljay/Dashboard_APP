import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AnalyticsData } from '../types';

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAnalyticsData = createAsyncThunk(
  'analytics/fetchData',
  async () => {
    // Replace with actual API call
    const mockData: AnalyticsData = {
      // dailyActiveUsers: 1500,
      // monthlyActiveUsers: 25000,
      // revenue: 50000,
      // userGrowth: 15,
      // metrics: {
      //   conversionRate: 3.5,
      //   churnRate: 2.1,
      //   averageSessionDuration: 15,
      // },
      totalRequests: 2000,
      successfulRequests: 1996,
      failedRequests: 4,
      averageResponseTime: 200,
      tokenUsage: 50,
      costEstimate: 30,
      timeRange: new Date().toLocaleString(),
    };
    return mockData;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    resetAnalytics: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics data';
      });
  },
});

export const { resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
