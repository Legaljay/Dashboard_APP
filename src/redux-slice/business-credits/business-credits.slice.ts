import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface CreditUsage {
  id: string;
  amount: number;
  feature: string;
  timestamp: string;
  applicationId: string;
}

interface BusinessCredits {
  total: number;
  used: number;
  remaining: number;
  usageHistory: CreditUsage[];
}

interface BusinessCreditsState {
  credits: BusinessCredits | null;
  loading: {
    credits: boolean;
    usage: boolean;
    usageById: boolean;
  };
  error: {
    credits: string | null;
    usage: string | null;
    usageById: string | null;
  };
}

const initialState: BusinessCreditsState = {
  credits: null,
  loading: {
    credits: false,
    usage: false,
    usageById: false,
  },
  error: {
    credits: null,
    usage: null,
    usageById: null,
  },
};

export const fetchBusinessCredits = createAsyncThunk(
  'businessCredits/fetchCredits',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.BUSINESS_CREDITS);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch business credits');
    }
  }
);

export const fetchBusinessCreditsUsage = createAsyncThunk(
  'businessCredits/fetchUsage',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.BUSINESS_CREDITS_USAGE);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credits usage');
    }
  }
);

export const fetchBusinessCreditsUsageById = createAsyncThunk(
  'businessCredits/fetchUsageById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.BUSINESS_CREDITS_USAGE_BY_ID.replace(':id', id)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credits usage by ID');
    }
  }
);

const businessCreditsSlice = createSlice({
  name: 'businessCredits',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        credits: null,
        usage: null,
        usageById: null,
      };
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Credits
      .addCase(fetchBusinessCredits.pending, (state) => {
        state.loading.credits = true;
        state.error.credits = null;
      })
      .addCase(fetchBusinessCredits.fulfilled, (state, action) => {
        state.loading.credits = false;
        state.credits = action.payload;
      })
      .addCase(fetchBusinessCredits.rejected, (state, action) => {
        state.loading.credits = false;
        state.error.credits = action.payload as string;
      })

      // Fetch Usage
      .addCase(fetchBusinessCreditsUsage.pending, (state) => {
        state.loading.usage = true;
        state.error.usage = null;
      })
      .addCase(fetchBusinessCreditsUsage.fulfilled, (state, action) => {
        state.loading.usage = false;
        if (state.credits) {
          state.credits.usageHistory = action.payload;
        }
      })
      .addCase(fetchBusinessCreditsUsage.rejected, (state, action) => {
        state.loading.usage = false;
        state.error.usage = action.payload as string;
      })

      // Fetch Usage By ID
      .addCase(fetchBusinessCreditsUsageById.pending, (state) => {
        state.loading.usageById = true;
        state.error.usageById = null;
      })
      .addCase(fetchBusinessCreditsUsageById.fulfilled, (state, action) => {
        state.loading.usageById = false;
        // Assuming the response is a single usage record
        if (state.credits?.usageHistory) {
          const index = state.credits.usageHistory.findIndex(
            usage => usage.id === action.payload.id
          );
          if (index !== -1) {
            state.credits.usageHistory[index] = action.payload;
          } else {
            state.credits.usageHistory.push(action.payload);
          }
        }
      })
      .addCase(fetchBusinessCreditsUsageById.rejected, (state, action) => {
        state.loading.usageById = false;
        state.error.usageById = action.payload as string;
      });
  },
});

export const { clearErrors, resetState } = businessCreditsSlice.actions;

// Selectors
export const selectBusinessCreditsState = (state: RootState) => state.businessCredits;
export const selectBusinessCredits = (state: RootState) => state.businessCredits.credits;
export const selectBusinessCreditsLoading = (state: RootState) => state.businessCredits.loading;
export const selectBusinessCreditsError = (state: RootState) => state.businessCredits.error;

export default businessCreditsSlice.reducer;
