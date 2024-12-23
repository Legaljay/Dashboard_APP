import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

// Types
export interface Webhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  headers?: Record<string, string>;
  retryConfig?: {
    maxRetries: number;
    retryInterval: number;
  };
}

interface WebhookState {
  webhooks: Webhook[];
  loading: boolean;
  error: string | null;
  currentWebhook: Webhook | null;
}

const initialState: WebhookState = {
  webhooks: [],
  loading: false,
  error: null,
  currentWebhook: null,
};

// Async Thunks
export const fetchWebhooks = createAsyncThunk(
  'appWebhooks/fetchWebhooks',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/dashboard/applications/${applicationId}/webhooks`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch webhooks');
    }
  }
);

export const createWebhook = createAsyncThunk(
  'appWebhooks/createWebhook',
  async ({ applicationId, webhook }: { applicationId: string; webhook: Partial<Webhook> }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/dashboard/applications/${applicationId}/webhooks`, webhook);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create webhook');
    }
  }
);

export const updateWebhook = createAsyncThunk(
  'appWebhooks/updateWebhook',
  async ({ applicationId, webhookId, updates }: { applicationId: string; webhookId: string; updates: Partial<Webhook> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/dashboard/applications/${applicationId}/webhooks/${webhookId}`, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update webhook');
    }
  }
);

export const deleteWebhook = createAsyncThunk(
  'appWebhooks/deleteWebhook',
  async ({ applicationId, webhookId }: { applicationId: string; webhookId: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`/dashboard/applications/${applicationId}/webhooks/${webhookId}`);
      return webhookId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete webhook');
    }
  }
);

// Slice
const appWebhooksSlice = createSlice({
  name: 'appWebhooks',
  initialState,
  reducers: {
    setCurrentWebhook: (state, action: PayloadAction<Webhook | null>) => {
      state.currentWebhook = action.payload;
    },
    clearWebhookError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch webhooks
      .addCase(fetchWebhooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebhooks.fulfilled, (state, action) => {
        state.loading = false;
        state.webhooks = action.payload;
      })
      .addCase(fetchWebhooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create webhook
      .addCase(createWebhook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWebhook.fulfilled, (state, action) => {
        state.loading = false;
        state.webhooks.push(action.payload);
      })
      .addCase(createWebhook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update webhook
      .addCase(updateWebhook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWebhook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.webhooks.findIndex(webhook => webhook.id === action.payload.id);
        if (index !== -1) {
          state.webhooks[index] = action.payload;
        }
      })
      .addCase(updateWebhook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete webhook
      .addCase(deleteWebhook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWebhook.fulfilled, (state, action) => {
        state.loading = false;
        state.webhooks = state.webhooks.filter(webhook => webhook.id !== action.payload);
      })
      .addCase(deleteWebhook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { setCurrentWebhook, clearWebhookError } = appWebhooksSlice.actions;

// Selectors
export const selectWebhooks = (state: RootState) => state.appWebhooks.webhooks;
export const selectWebhookLoading = (state: RootState) => state.appWebhooks.loading;
export const selectWebhookError = (state: RootState) => state.appWebhooks.error;
export const selectCurrentWebhook = (state: RootState) => state.appWebhooks.currentWebhook;

// Reducer
export default appWebhooksSlice.reducer;
