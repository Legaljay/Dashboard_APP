// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '@/services/api';
// import { ApiEndpoints } from '@/enums/api.enum';

// interface Report {
//   id: string;
//   name: string;
//   type: 'financial' | 'analytics' | 'performance' | 'custom';
//   schedule: {
//     frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
//     lastRun: string;
//     nextRun: string;
//   };
//   recipients: string[];
//   format: 'pdf' | 'csv' | 'excel';
//   filters: Record<string, any>;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ReportTemplate {
//   id: string;
//   name: string;
//   description: string;
//   type: string;
//   parameters: Record<string, any>;
// }

// interface ReportState {
//   reports: Report[];
//   templates: ReportTemplate[];
//   generatedReports: {
//     [reportId: string]: {
//       url: string;
//       generatedAt: string;
//       expiresAt: string;
//     };
//   };
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ReportState = {
//   reports: [],
//   templates: [],
//   generatedReports: {},
//   loading: false,
//   error: null,
// };

// export const fetchReports = createAsyncThunk(
//   'reports/fetchReports',
//   async () => {
//     const response = await api.get(ApiEndpoints.REPORTS);
//     return response.data;
//   }
// );

// export const fetchReportTemplates = createAsyncThunk(
//   'reports/fetchTemplates',
//   async () => {
//     const response = await api.get(`${ApiEndpoints.REPORTS}/templates`);
//     return response.data;
//   }
// );

// export const createReport = createAsyncThunk(
//   'reports/createReport',
//   async (data: Partial<Report>) => {
//     const response = await api.post(ApiEndpoints.REPORTS, data);
//     return response.data;
//   }
// );

// export const updateReport = createAsyncThunk(
//   'reports/updateReport',
//   async ({ id, data }: { id: string; data: Partial<Report> }) => {
//     const response = await api.put(`${ApiEndpoints.REPORTS}/${id}`, data);
//     return response.data;
//   }
// );

// export const deleteReport = createAsyncThunk(
//   'reports/deleteReport',
//   async (id: string) => {
//     await api.delete(`${ApiEndpoints.REPORTS}/${id}`);
//     return id;
//   }
// );

// export const generateReport = createAsyncThunk(
//   'reports/generateReport',
//   async ({ id, parameters }: { id: string; parameters?: Record<string, any> }) => {
//     const response = await api.post(`${ApiEndpoints.REPORTS}/${id}/generate`, parameters);
//     return { reportId: id, ...response.data };
//   }
// );

// export const scheduleReport = createAsyncThunk(
//   'reports/scheduleReport',
//   async ({ id, schedule }: { id: string; schedule: Report['schedule'] }) => {
//     const response = await api.post(`${ApiEndpoints.REPORTS}/${id}/schedule`, schedule);
//     return { id, schedule: response.data };
//   }
// );

// const reportsSlice = createSlice({
//   name: 'reports',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearGeneratedReport: (state, action) => {
//       const { reportId } = action.payload;
//       delete state.generatedReports[reportId];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchReports.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchReports.fulfilled, (state, action) => {
//         state.loading = false;
//         state.reports = action.payload;
//       })
//       .addCase(fetchReports.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch reports';
//       })
//       .addCase(fetchReportTemplates.fulfilled, (state, action) => {
//         state.templates = action.payload;
//       })
//       .addCase(createReport.fulfilled, (state, action) => {
//         state.reports.push(action.payload);
//       })
//       .addCase(updateReport.fulfilled, (state, action) => {
//         const index = state.reports.findIndex(r => r.id === action.payload.id);
//         if (index !== -1) {
//           state.reports[index] = action.payload;
//         }
//       })
//       .addCase(deleteReport.fulfilled, (state, action) => {
//         state.reports = state.reports.filter(report => report.id !== action.payload);
//         delete state.generatedReports[action.payload];
//       })
//       .addCase(generateReport.fulfilled, (state, action) => {
//         const { reportId, url, generatedAt, expiresAt } = action.payload;
//         state.generatedReports[reportId] = { url, generatedAt, expiresAt };
//       })
//       .addCase(scheduleReport.fulfilled, (state, action) => {
//         const report = state.reports.find(r => r.id === action.payload.id);
//         if (report) {
//           report.schedule = action.payload.schedule;
//         }
//       });
//   },
// });

// export const { clearError, clearGeneratedReport } = reportsSlice.actions;
// export default reportsSlice.reducer;
