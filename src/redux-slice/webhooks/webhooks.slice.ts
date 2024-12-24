// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '@/services/api';
// import { ApiEndpoints } from '@/enums/api.enum';

// interface WebhookEvent {
//   id: string;
//   type: string;
//   payload: any;
//   timestamp: string;
//   status: 'success' | 'failed' | 'pending';
//   retries: number;
// }

// interface Webhook {
//   id: string;
//   url: string;
//   events: string[];
//   active: boolean;
//   secret: string;
//   createdAt: string;
//   lastTriggered: string | null;
//   failureCount: number;
//   headers: Record<string, string>;
// }

// interface WebhookState {
//   webhooks: Webhook[];
//   events: WebhookEvent[];
//   availableEvents: string[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: WebhookState = {
//   webhooks: [],
//   events: [],
//   availableEvents: [],
//   loading: false,
//   error: null,
// };

// export const fetchWebhooks = createAsyncThunk(
//   'webhooks/fetchWebhooks',
//   async () => {
//     const response = await api.get(ApiEndpoints.APP_WEBHOOKS);
//     return response.data;
//   }
// );

// export const createWebhook = createAsyncThunk(
//   'webhooks/createWebhook',
//   async (data: Partial<Webhook>) => {
//     const response = await api.post(ApiEndpoints.APP_WEBHOOKS, data);
//     return response.data;
//   }
// );

// export const updateWebhook = createAsyncThunk(
//   'webhooks/updateWebhook',
//   async ({ id, data }: { id: string; data: Partial<Webhook> }) => {
//     const response = await api.put(`${ApiEndpoints.APP_WEBHOOKS}/${id}`, data);
//     return response.data;
//   }
// );

// export const deleteWebhook = createAsyncThunk(
//   'webhooks/deleteWebhook',
//   async (id: string) => {
//     await api.delete(`${ApiEndpoints.APP_WEBHOOKS}/${id}`);
//     return id;
//   }
// );

// export const fetchWebhookEvents = createAsyncThunk(
//   'webhooks/fetchEvents',
//   async (webhookId: string) => {
//     const response = await api.get(`${ApiEndpoints.APP_WEBHOOKS}/${webhookId}/events`);
//     return response.data;
//   }
// );

// export const retryWebhookEvent = createAsyncThunk(
//   'webhooks/retryEvent',
//   async ({ webhookId, eventId }: { webhookId: string; eventId: string }) => {
//     const response = await api.post(`${ApiEndpoints.APP_WEBHOOKS}/${webhookId}/events/${eventId}/retry`);
//     return response.data;
//   }
// );

// const webhooksSlice = createSlice({
//   name: 'webhooks',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     setWebhookStatus: (state, action) => {
//       const { webhookId, active } = action.payload;
//       const webhook = state.webhooks.find(w => w.id === webhookId);
//       if (webhook) {
//         webhook.active = active;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWebhooks.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchWebhooks.fulfilled, (state, action) => {
//         state.loading = false;
//         state.webhooks = action.payload;
//       })
//       .addCase(fetchWebhooks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch webhooks';
//       })
//       .addCase(createWebhook.fulfilled, (state, action) => {
//         state.webhooks.push(action.payload);
//       })
//       .addCase(updateWebhook.fulfilled, (state, action) => {
//         const index = state.webhooks.findIndex(w => w.id === action.payload.id);
//         if (index !== -1) {
//           state.webhooks[index] = action.payload;
//         }
//       })
//       .addCase(deleteWebhook.fulfilled, (state, action) => {
//         state.webhooks = state.webhooks.filter(webhook => webhook.id !== action.payload);
//       })
//       .addCase(fetchWebhookEvents.fulfilled, (state, action) => {
//         state.events = action.payload;
//       })
//       .addCase(retryWebhookEvent.fulfilled, (state, action) => {
//         const eventIndex = state.events.findIndex(e => e.id === action.payload.id);
//         if (eventIndex !== -1) {
//           state.events[eventIndex] = action.payload;
//         }
//       });
//   },
// });

// export const { clearError, setWebhookStatus } = webhooksSlice.actions;
// export default webhooksSlice.reducer;
