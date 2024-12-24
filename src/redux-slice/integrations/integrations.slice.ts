// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '@/services/api';
// import { ApiEndpoints } from '@/enums/api.enum';

// interface Integration {
//   id: string;
//   type: string;
//   name: string;
//   provider: string;
//   status: 'connected' | 'disconnected' | 'error';
//   config: Record<string, any>;
//   credentials: {
//     accessToken?: string;
//     refreshToken?: string;
//     expiresAt?: string;
//   };
//   metadata: {
//     lastSync?: string;
//     nextSync?: string;
//     syncStatus?: 'idle' | 'running' | 'failed';
//   };
//   permissions: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// interface IntegrationProvider {
//   id: string;
//   name: string;
//   description: string;
//   category: string;
//   features: string[];
//   requiredScopes: string[];
//   configSchema: Record<string, any>;
//   documentationUrl: string;
// }

// interface SyncLog {
//   id: string;
//   integrationId: string;
//   startTime: string;
//   endTime: string;
//   status: 'success' | 'failed';
//   details: Record<string, any>;
// }

// interface IntegrationsState {
//   integrations: Integration[];
//   providers: IntegrationProvider[];
//   syncLogs: SyncLog[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: IntegrationsState = {
//   integrations: [],
//   providers: [],
//   syncLogs: [],
//   loading: false,
//   error: null,
// };

// export const fetchIntegrations = createAsyncThunk(
//   'integrations/fetchIntegrations',
//   async () => {
//     const response = await api.get(ApiEndpoints.APP_INTEGRATIONS);
//     return response.data;
//   }
// );

// export const fetchProviders = createAsyncThunk(
//   'integrations/fetchProviders',
//   async () => {
//     const response = await api.get(`${ApiEndpoints.APP_INTEGRATIONS}/providers`);
//     return response.data;
//   }
// );

// export const connectIntegration = createAsyncThunk(
//   'integrations/connect',
//   async (data: { providerId: string; config: Record<string, any> }) => {
//     const response = await api.post(ApiEndpoints.APP_INTEGRATIONS, data);
//     return response.data;
//   }
// );

// export const disconnectIntegration = createAsyncThunk(
//   'integrations/disconnect',
//   async (id: string) => {
//     await api.post(`${ApiEndpoints.APP_INTEGRATIONS}/${id}/disconnect`);
//     return id;
//   }
// );

// export const updateIntegrationConfig = createAsyncThunk(
//   'integrations/updateConfig',
//   async ({ id, config }: { id: string; config: Record<string, any> }) => {
//     const response = await api.put(`${ApiEndpoints.APP_INTEGRATIONS}/${id}/config`, config);
//     return response.data;
//   }
// );

// export const syncIntegration = createAsyncThunk(
//   'integrations/sync',
//   async (id: string) => {
//     const response = await api.post(`${ApiEndpoints.APP_INTEGRATIONS}/${id}/sync`);
//     return response.data;
//   }
// );

// export const fetchSyncLogs = createAsyncThunk(
//   'integrations/fetchSyncLogs',
//   async (integrationId: string) => {
//     const response = await api.get(`${ApiEndpoints.APP_INTEGRATIONS}/${integrationId}/sync-logs`);
//     return response.data;
//   }
// );

// const integrationsSlice = createSlice({
//   name: 'integrations',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     updateIntegrationStatus: (state, action) => {
//       const { integrationId, status } = action.payload;
//       const integration = state.integrations.find(i => i.id === integrationId);
//       if (integration) {
//         integration.status = status;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchIntegrations.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchIntegrations.fulfilled, (state, action) => {
//         state.loading = false;
//         state.integrations = action.payload;
//       })
//       .addCase(fetchIntegrations.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch integrations';
//       })
//       .addCase(fetchProviders.fulfilled, (state, action) => {
//         state.providers = action.payload;
//       })
//       .addCase(connectIntegration.fulfilled, (state, action) => {
//         state.integrations.push(action.payload);
//       })
//       .addCase(disconnectIntegration.fulfilled, (state, action) => {
//         const integration = state.integrations.find(i => i.id === action.payload);
//         if (integration) {
//           integration.status = 'disconnected';
//           integration.credentials = {};
//         }
//       })
//       .addCase(updateIntegrationConfig.fulfilled, (state, action) => {
//         const index = state.integrations.findIndex(i => i.id === action.payload.id);
//         if (index !== -1) {
//           state.integrations[index] = action.payload;
//         }
//       })
//       .addCase(syncIntegration.fulfilled, (state, action) => {
//         const integration = state.integrations.find(i => i.id === action.payload.integrationId);
//         if (integration) {
//           integration.metadata = {
//             ...integration.metadata,
//             lastSync: action.payload.startTime,
//             syncStatus: action.payload.status,
//           };
//         }
//       })
//       .addCase(fetchSyncLogs.fulfilled, (state, action) => {
//         state.syncLogs = action.payload;
//       });
//   },
// });

// export const { clearError, updateIntegrationStatus } = integrationsSlice.actions;
// export default integrationsSlice.reducer;
