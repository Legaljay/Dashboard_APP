import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';


interface Feature {
  baseSubscriptionId: string;
  type: 'text'; 
  prefix: string;
  description: string;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  features: Feature[];
  monthly_amount: string; 
  yearly_amount: string;  
  tag_slug: string;
  disabled: boolean;
  created_at: string; 
  updated_at: string; 
}

export interface CurrentSubscription {
  id: string;
  subscription_details: Subscription; // Add this line
  applicationId: string | null; // Assuming applicationId can be null
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  active: boolean;
  renewal_failure_count: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

interface BusinessSubscriptionState {
  currentSubscription: CurrentSubscription | null;
  availableSubscriptions: Subscription[];
  loading: {
    current: boolean;
    available: boolean;
    upgrade: boolean;
    downgrade: boolean;
  };
  error: {
    current: string | null;
    available: string | null;
    upgrade: string | null;
    downgrade: string | null;
  };
}

const initialState: BusinessSubscriptionState = {
  currentSubscription: null,
  availableSubscriptions: [],
  loading: {
    current: false,
    available: false,
    upgrade: false,
    downgrade: false,
  },
  error: {
    current: null,
    available: null,
    upgrade: null,
    downgrade: null,
  },
};

export const fetchCurrentSubscription = createAsyncThunk(
  'businessSubscription/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.BUSINESS_SUBSCRIPTION_CURRENT);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current subscription');
    }
  }
);

export const fetchAvailableSubscriptions = createAsyncThunk(
  'businessSubscription/fetchAvailable',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.BUSINESS_SUBSCRIPTIONS_AVAILABLE);
      console.log(response.data.data.subscriptions);
      return response.data.data.subscriptions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available subscriptions');
    }
  }
);

export const upgradeSubscription = createAsyncThunk(
  'businessSubscription/upgrade',
  async (baseSubId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.BUSINESS_SUBSCRIPTION_UPGRADE.replace(':base_sub_id', baseSubId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upgrade subscription');
    }
  }
);

export const downgradeSubscription = createAsyncThunk(
  'businessSubscription/downgrade',
  async (baseSubId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.BUSINESS_SUBSCRIPTIONS_DOWNGRADE.replace(':base_sub_id', baseSubId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to downgrade subscription');
    }
  }
);

const businessSubscriptionSlice = createSlice({
  name: 'businessSubscription',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        current: null,
        available: null,
        upgrade: null,
        downgrade: null,
      };
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Current Subscription
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.loading.current = true;
        state.error.current = null;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.loading.current = false;
        state.currentSubscription = action.payload;
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.loading.current = false;
        state.error.current = action.payload as string;
      })

      // Fetch Available Subscriptions
      .addCase(fetchAvailableSubscriptions.pending, (state) => {
        state.loading.available = true;
        state.error.available = null;
      })
      .addCase(fetchAvailableSubscriptions.fulfilled, (state, action) => {
        state.loading.available = false;
        state.availableSubscriptions = action.payload;
      })
      .addCase(fetchAvailableSubscriptions.rejected, (state, action) => {
        state.loading.available = false;
        state.error.available = action.payload as string;
      })

      // Upgrade Subscription
      .addCase(upgradeSubscription.pending, (state) => {
        state.loading.upgrade = true;
        state.error.upgrade = null;
      })
      .addCase(upgradeSubscription.fulfilled, (state, action) => {
        state.loading.upgrade = false;
        state.currentSubscription = action.payload;
      })
      .addCase(upgradeSubscription.rejected, (state, action) => {
        state.loading.upgrade = false;
        state.error.upgrade = action.payload as string;
      })

      // Downgrade Subscription
      .addCase(downgradeSubscription.pending, (state) => {
        state.loading.downgrade = true;
        state.error.downgrade = null;
      })
      .addCase(downgradeSubscription.fulfilled, (state, action) => {
        state.loading.downgrade = false;
        state.currentSubscription = action.payload;
      })
      .addCase(downgradeSubscription.rejected, (state, action) => {
        state.loading.downgrade = false;
        state.error.downgrade = action.payload as string;
      });
  },
});

export const { clearErrors, resetState } = businessSubscriptionSlice.actions;

// Selectors
export const selectBusinessSubscriptionState = (state: RootState) => state.businessSubscription;
export const selectCurrentSubscription = (state: RootState) => state.businessSubscription.currentSubscription;
export const selectAvailableSubscriptions = (state: RootState) => state.businessSubscription.availableSubscriptions;
export const selectSubscriptionLoading = (state: RootState) => state.businessSubscription.loading;
export const selectSubscriptionError = (state: RootState) => state.businessSubscription.error;

export const selectAvailablePlans = (state: RootState) => state.businessSubscription.availableSubscriptions;
export const selectCurrentPlan = (state: RootState) => state.businessSubscription.currentSubscription;

export const selectAdjacentPlans = createSelector(
  [selectAvailablePlans, selectCurrentPlan],
  (availablePlans, currentPlan) => {

    // Check if availablePlans and currentPlan are defined
    if (!availablePlans || !currentPlan) {
      return { previousPlan: null, nextPlan: null };
    }

    // Sort plans by price
    const sortedPlans = [...availablePlans].sort((a, b) => {
      const aPrice = parseInt(a.yearly_amount);
      const bPrice = parseInt(b.yearly_amount);
      return aPrice - bPrice;
    });
    
    // Find current plan index
    const currentIndex = sortedPlans.findIndex(plan => plan.id === currentPlan.subscription_details.id);
    
    if (currentIndex === -1) {
      return { previousPlan: null, nextPlan: null };
    }

    return {
      previousPlan: currentIndex > 0 ? sortedPlans[currentIndex - 1] : null,
      nextPlan: currentIndex < sortedPlans.length - 1 ? sortedPlans[currentIndex + 1] : null
    };
  }
);

export const selectedBusinessPlans = createSelector(
  [selectBusinessSubscriptionState],
  (subscription) => ({
    currentPlan: subscription.currentSubscription?.subscription_details,
    subscriptions: subscription.availableSubscriptions
  })
);

export default businessSubscriptionSlice.reducer;
