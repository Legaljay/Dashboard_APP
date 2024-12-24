// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '@/services/api';
// import { ApiEndpoints } from '@/enums/api.enum';

// interface AnalyticsMetric {
//   id: string;
//   name: string;
//   value: number;
//   change: number;
//   period: string;
// }

// interface ChartData {
//   labels: string[];
//   datasets: {
//     label: string;
//     data: number[];
//   }[];
// }

// interface AnalyticsState {
//   metrics: {
//     daily: AnalyticsMetric[];
//     weekly: AnalyticsMetric[];
//     monthly: AnalyticsMetric[];
//   };
//   charts: {
//     usage: ChartData;
//     revenue: ChartData;
//     users: ChartData;
//   };
//   customReports: any[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AnalyticsState = {
//   metrics: {
//     daily: [],
//     weekly: [],
//     monthly: [],
//   },
//   charts: {
//     usage: { labels: [], datasets: [] },
//     revenue: { labels: [], datasets: [] },
//     users: { labels: [], datasets: [] },
//   },
//   customReports: [],
//   loading: false,
//   error: null,
// };

// export const fetchAnalytics = createAsyncThunk(
//   'analytics/fetchAnalytics',
//   async (period: 'daily' | 'weekly' | 'monthly') => {
//     const response = await api.get(`${ApiEndpoints.BUSINESS_ANALYTICS}/${period}`);
//     return { period, data: response.data };
//   }
// );

// export const fetchChartData = createAsyncThunk(
//   'analytics/fetchChartData',
//   async (chartType: 'usage' | 'revenue' | 'users') => {
//     const response = await api.get(`${ApiEndpoints.BUSINESS_ANALYTICS}/charts/${chartType}`);
//     return { chartType, data: response.data };
//   }
// );

// export const generateCustomReport = createAsyncThunk(
//   'analytics/generateCustomReport',
//   async (params: { metrics: string[]; period: string; filters: any }) => {
//     const response = await api.post(`${ApiEndpoints.BUSINESS_ANALYTICS}/custom-report`, params);
//     return response.data;
//   }
// );

// const analyticsSlice = createSlice({
//   name: 'analytics',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearCustomReports: (state) => {
//       state.customReports = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAnalytics.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAnalytics.fulfilled, (state, action) => {
//         state.loading = false;
//         state.metrics[action.payload.period] = action.payload.data;
//       })
//       .addCase(fetchAnalytics.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch analytics';
//       })
//       .addCase(fetchChartData.fulfilled, (state, action) => {
//         state.charts[action.payload.chartType] = action.payload.data;
//       })
//       .addCase(generateCustomReport.fulfilled, (state, action) => {
//         state.customReports.push(action.payload);
//       });
//   },
// });

// export const { clearError, clearCustomReports } = analyticsSlice.actions;
// export default analyticsSlice.reducer;
