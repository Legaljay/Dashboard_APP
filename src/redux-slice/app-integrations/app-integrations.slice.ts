import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

// Types
export interface Integration {
  id: string;
  applicationId: string;
  provider: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'pending' | 'failed';
  config: Record<string, any>;
  credentials?: Record<string, any>;
  features: string[];
  requiredScopes: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationState {
  integrations: Integration[];
  availableIntegrations: Integration[];
  loading: boolean;
  error: string | null;
  currentIntegration: Integration | null;
}

const initialState: IntegrationState = {
  integrations: [],
  availableIntegrations: [],
  loading: false,
  error: null,
  currentIntegration: null,
};

// Async Thunks
export const fetchIntegrations = createAsyncThunk(
  'appIntegrations/fetchIntegrations',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/dashboard/applications/${applicationId}/integrations`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch integrations');
    }
  }
);

export const fetchAvailableIntegrations = createAsyncThunk(
  'appIntegrations/fetchAvailableIntegrations',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/dashboard/applications/${applicationId}/integrations/available`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available integrations');
    }
  }
);

export const installIntegration = createAsyncThunk(
  'appIntegrations/installIntegration',
  async ({ applicationId, integration }: { applicationId: string; integration: Partial<Integration> }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/dashboard/applications/${applicationId}/integrations`, integration);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to install integration');
    }
  }
);

export const updateIntegration = createAsyncThunk(
  'appIntegrations/updateIntegration',
  async ({ applicationId, integrationId, updates }: { applicationId: string; integrationId: string; updates: Partial<Integration> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/dashboard/applications/${applicationId}/integrations/${integrationId}`, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update integration');
    }
  }
);

export const uninstallIntegration = createAsyncThunk(
  'appIntegrations/uninstallIntegration',
  async ({ applicationId, integrationId }: { applicationId: string; integrationId: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`/dashboard/applications/${applicationId}/integrations/${integrationId}`);
      return integrationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to uninstall integration');
    }
  }
);

// Slice
const appIntegrationsSlice = createSlice({
  name: 'appIntegrations',
  initialState,
  reducers: {
    setCurrentIntegration: (state, action: PayloadAction<Integration | null>) => {
      state.currentIntegration = action.payload;
    },
    clearIntegrationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch integrations
      .addCase(fetchIntegrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.loading = false;
        state.integrations = action.payload;
      })
      .addCase(fetchIntegrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch available integrations
      .addCase(fetchAvailableIntegrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableIntegrations.fulfilled, (state, action) => {
        state.loading = false;
        state.availableIntegrations = action.payload;
      })
      .addCase(fetchAvailableIntegrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Install integration
      .addCase(installIntegration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(installIntegration.fulfilled, (state, action) => {
        state.loading = false;
        state.integrations.push(action.payload);
      })
      .addCase(installIntegration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update integration
      .addCase(updateIntegration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIntegration.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.integrations.findIndex(integration => integration.id === action.payload.id);
        if (index !== -1) {
          state.integrations[index] = action.payload;
        }
      })
      .addCase(updateIntegration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Uninstall integration
      .addCase(uninstallIntegration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uninstallIntegration.fulfilled, (state, action) => {
        state.loading = false;
        state.integrations = state.integrations.filter(integration => integration.id !== action.payload);
      })
      .addCase(uninstallIntegration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { setCurrentIntegration, clearIntegrationError } = appIntegrationsSlice.actions;

// Selectors
export const selectIntegrations = (state: RootState) => state.appIntegrations.integrations;
export const selectAvailableIntegrations = (state: RootState) => state.appIntegrations.availableIntegrations;
export const selectIntegrationLoading = (state: RootState) => state.appIntegrations.loading;
export const selectIntegrationError = (state: RootState) => state.appIntegrations.error;
export const selectCurrentIntegration = (state: RootState) => state.appIntegrations.currentIntegration;

// Memoized Selectors
export const selectIntegrationById = (integrationId: string) => (state: RootState) => 
  state.appIntegrations.integrations.find(integration => integration.id === integrationId);

export const selectIntegrationsByCategory = (category: string) => (state: RootState) =>
  state.appIntegrations.integrations.filter(integration => integration.category === category);

export const selectActiveIntegrations = (state: RootState) =>
  state.appIntegrations.integrations.filter(integration => integration.status === 'active');

// Reducer
export default appIntegrationsSlice.reducer;
