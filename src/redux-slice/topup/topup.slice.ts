import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface TopupRequest {
  amount: number;
  currency: string;
}

interface TopupResponse {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  paymentLink?: string;
  reference: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface TopupState {
  currentRequest: TopupResponse | null;
  history: TopupResponse[];
  loading: {
    request: boolean;
    generate: boolean;
    notification: boolean;
  };
  error: {
    request: string | null;
    generate: string | null;
    notification: string | null;
  };
}

interface FlutterwaveNotification {
  status: string;
  reference: string;
  providerId: string;
}

const initialState: TopupState = {
  currentRequest: null,
  history: [],
  loading: {
    request: false,
    generate: false,
    notification: false,
  },
  error: {
    request: null,
    generate: null,
    notification: null,
  },
};

export const requestEnterpriseTopup = createAsyncThunk(
  'topup/requestEnterprise',
  async (requestData: TopupRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.TOPUP_REQUEST_ENTERPRISE, requestData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request enterprise top-up');
    }
  }
);

export const generateTopup = createAsyncThunk(
  'topup/generate',
  async (requestData: TopupRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.TOPUP_GENERATE, requestData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate top-up');
    }
  }
);

export const handleFlutterwaveNotification = createAsyncThunk(
  'topup/flutterwaveNotification',
  async (notificationData: FlutterwaveNotification, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.TOPUP_FLUTTERWAVE_NOTIFICATION, notificationData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process Flutterwave notification');
    }
  }
);

const topupSlice = createSlice({
  name: 'topup',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        request: null,
        generate: null,
        notification: null,
      };
    },
    resetState: () => initialState,
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request Enterprise Top-up
      .addCase(requestEnterpriseTopup.pending, (state) => {
        state.loading.request = true;
        state.error.request = null;
      })
      .addCase(requestEnterpriseTopup.fulfilled, (state, action) => {
        state.loading.request = false;
        state.currentRequest = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(requestEnterpriseTopup.rejected, (state, action) => {
        state.loading.request = false;
        state.error.request = action.payload as string;
      })

      // Generate Top-up
      .addCase(generateTopup.pending, (state) => {
        state.loading.generate = true;
        state.error.generate = null;
      })
      .addCase(generateTopup.fulfilled, (state, action) => {
        state.loading.generate = false;
        state.currentRequest = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(generateTopup.rejected, (state, action) => {
        state.loading.generate = false;
        state.error.generate = action.payload as string;
      })

      // Handle Flutterwave Notification
      .addCase(handleFlutterwaveNotification.pending, (state) => {
        state.loading.notification = true;
        state.error.notification = null;
      })
      .addCase(handleFlutterwaveNotification.fulfilled, (state, action) => {
        state.loading.notification = false;
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
        const index = state.history.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.history[index] = action.payload;
        }
      })
      .addCase(handleFlutterwaveNotification.rejected, (state, action) => {
        state.loading.notification = false;
        state.error.notification = action.payload as string;
      });
  },
});

export const { clearErrors, resetState, clearCurrentRequest } = topupSlice.actions;

// Selectors
export const selectTopupState = (state: RootState) => state.topup;
export const selectCurrentTopupRequest = (state: RootState) => state.topup.currentRequest;
export const selectTopupHistory = (state: RootState) => state.topup.history;
export const selectTopupLoading = (state: RootState) => state.topup.loading;
export const selectTopupError = (state: RootState) => state.topup.error;

export default topupSlice.reducer;
