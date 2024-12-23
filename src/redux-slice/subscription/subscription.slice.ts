import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';

interface SubscriptionState {
  plans: any[];
  currentPlan: any;
  invoices: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
  currentPlan: null,
  invoices: [],
  loading: false,
  error: null,
};

export const fetchSubscriptionPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async () => {
    const response = await api.get(ApiEndpoints.SUBSCRIPTION_PLANS);
    return response.data;
  }
);

export const fetchCurrentSubscription = createAsyncThunk(
  'subscription/fetchCurrent',
  async () => {
    const response = await api.get(ApiEndpoints.SUBSCRIPTION_CURRENT);
    return response.data;
  }
);

export const upgradeSubscription = createAsyncThunk(
  'subscription/upgrade',
  async (planId: string) => {
    const response = await api.post(ApiEndpoints.SUBSCRIPTION_UPGRADE, { planId });
    return response.data;
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async () => {
    const response = await api.post(ApiEndpoints.SUBSCRIPTION_CANCEL);
    return response.data;
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscription plans';
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.currentPlan = action.payload;
      })
      .addCase(upgradeSubscription.fulfilled, (state, action) => {
        state.currentPlan = action.payload;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.currentPlan = null;
      });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
