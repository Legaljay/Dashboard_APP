// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '@/services/api';
// import { ApiEndpoints } from '@/enums/api.enum';

// interface AuditEvent {
//   id: string;
//   type: string;
//   action: string;
//   actor: {
//     id: string;
//     type: 'user' | 'system' | 'integration';
//     name: string;
//   };
//   target: {
//     id: string;
//     type: string;
//     name: string;
//   };
//   metadata: Record<string, any>;
//   ip?: string;
//   userAgent?: string;
//   timestamp: string;
// }

// interface AuditFilter {
//   startDate?: string;
//   endDate?: string;
//   actorTypes?: string[];
//   actionTypes?: string[];
//   targetTypes?: string[];
// }

// interface AuditStats {
//   totalEvents: number;
//   eventsByType: Record<string, number>;
//   eventsByActor: Record<string, number>;
//   eventsByTarget: Record<string, number>;
//   timeDistribution: {
//     period: string;
//     count: number;
//   }[];
// }

// interface AuditState {
//   events: AuditEvent[];
//   stats: AuditStats | null;
//   currentFilter: AuditFilter;
//   loading: boolean;
//   error: string | null;
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//   };
// }

// const initialState: AuditState = {
//   events: [],
//   stats: null,
//   currentFilter: {},
//   loading: false,
//   error: null,
//   pagination: {
//     page: 1,
//     limit: 50,
//     total: 0,
//   },
// };

// export const fetchAuditEvents = createAsyncThunk(
//   'audit/fetchEvents',
//   async ({ filter, page, limit }: { filter: AuditFilter; page: number; limit: number }) => {
//     const response = await api.get(ApiEndpoints.AUDIT_LOGS, {
//       params: { ...filter, page, limit },
//     });
//     return response.data;
//   }
// );

// export const fetchAuditStats = createAsyncThunk(
//   'audit/fetchStats',
//   async (filter: AuditFilter) => {
//     const response = await api.get(`${ApiEndpoints.AUDIT_LOGS}/stats`, {
//       params: filter,
//     });
//     return response.data;
//   }
// );

// export const exportAuditLogs = createAsyncThunk(
//   'audit/exportLogs',
//   async ({ filter, format }: { filter: AuditFilter; format: 'csv' | 'json' }) => {
//     const response = await api.get(`${ApiEndpoints.AUDIT_LOGS}/export`, {
//       params: { ...filter, format },
//       responseType: 'blob',
//     });
//     return response.data;
//   }
// );

// const auditSlice = createSlice({
//   name: 'audit',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     setFilter: (state, action) => {
//       state.currentFilter = action.payload;
//       state.pagination.page = 1; // Reset to first page when filter changes
//     },
//     clearFilter: (state) => {
//       state.currentFilter = {};
//       state.pagination.page = 1;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAuditEvents.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAuditEvents.fulfilled, (state, action) => {
//         state.loading = false;
//         state.events = action.payload.events;
//         state.pagination = {
//           page: action.payload.page,
//           limit: action.payload.limit,
//           total: action.payload.total,
//         };
//       })
//       .addCase(fetchAuditEvents.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch audit events';
//       })
//       .addCase(fetchAuditStats.fulfilled, (state, action) => {
//         state.stats = action.payload;
//       })
//       .addCase(exportAuditLogs.rejected, (state, action) => {
//         state.error = action.error.message || 'Failed to export audit logs';
//       });
//   },
// });

// export const { clearError, setFilter, clearFilter } = auditSlice.actions;
// export default auditSlice.reducer;
