import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';
import { ApiKeyFetchResponse } from '@/types/apikey.types';

export interface ApiKeyState {
  publicKey: string | null;
  secretKey: string | null;
  loading: boolean;
  error: string | null;
  resetting: boolean;
}

const initialState: ApiKeyState = {
  publicKey: null,
  secretKey: null,
  loading: false,
  error: null,
  resetting: false,
};

export const fetchApiKey = createAsyncThunk(
  'apiKey/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiKeyFetchResponse>(ApiEndpoints.API_KEY);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch API key');
    }
  }
);

export const resetPublicKey = createAsyncThunk(
  'apiKey/resetPublic',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put(ApiEndpoints.API_KEY_RESET_PUBLIC);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset public key');
    }
  }
);

export const resetSecretKey = createAsyncThunk(
  'apiKey/resetSecret',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put(ApiEndpoints.API_KEY_RESET_SECRET);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset secret key');
    }
  }
);

const apiKeySlice = createSlice({
  name: 'apiKey',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch API Key
      .addCase(fetchApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiKey.fulfilled, (state, action) => {
        state.loading = false;
        state.publicKey = action.payload.data.public_key;
        state.secretKey = action.payload.data.secret_key;
      })
      .addCase(fetchApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch API key';
      })
      // Reset Public Key
      .addCase(resetPublicKey.pending, (state) => {
        state.resetting = true;
        state.error = null;
      })
      .addCase(resetPublicKey.fulfilled, (state, action) => {
        state.resetting = false;
        // state.publicKey = action.payload.data.public_key;
      })
      .addCase(resetPublicKey.rejected, (state, action) => {
        state.resetting = false;
        state.error = action.error.message || 'Failed to reset public key';
      })
      // Reset Secret Key
      .addCase(resetSecretKey.pending, (state) => {
        state.resetting = true;
        state.error = null;
      })
      .addCase(resetSecretKey.fulfilled, (state, action) => {
        state.resetting = false;
        // state.secretKey = action.payload.data.secret_key;
      })
      .addCase(resetSecretKey.rejected, (state, action) => {
        state.resetting = false;
        state.error = action.error.message || 'Failed to reset secret key';
      });
  },
});

export const { clearError, resetState } = apiKeySlice.actions;

// Selectors
export const selectApiKey = (state: RootState) => ({
  publicKey: state.apiKeys.publicKey,
  secretKey: state.apiKeys.secretKey,
});
export const selectApiKeyLoading = (state: RootState) => state.apiKeys.loading;
export const selectApiKeyError = (state: RootState) => state.apiKeys.error;
export const selectApiKeyResetting = (state: RootState) => state.apiKeys.resetting;

export default apiKeySlice.reducer;
