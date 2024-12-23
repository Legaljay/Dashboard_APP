import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface HistoryEntry {
  id: string;
  featureId: string;
  action: string;
  changes: Record<string, any>;
  timestamp: string;
  userId: string;
  metadata?: Record<string, any>;
}

interface AppHistoryState {
  history: HistoryEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: AppHistoryState = {
  history: [],
  loading: false,
  error: null,
};

export const fetchAppHistory = createAsyncThunk(
  'appHistory/fetchHistory',
  async ({ applicationId, featureId }: { applicationId: string; featureId: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_HISTORY
          .replace(':applicationId', applicationId)
          .replace(':featureId', featureId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch application history');
    }
  }
);

const appHistorySlice = createSlice({
  name: 'appHistory',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchAppHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors, resetState } = appHistorySlice.actions;

// Selectors
export const selectAppHistoryState = (state: RootState) => state.appHistory;
export const selectAppHistory = (state: RootState) => state.appHistory.history;
export const selectAppHistoryLoading = (state: RootState) => state.appHistory.loading;
export const selectAppHistoryError = (state: RootState) => state.appHistory.error;

export default appHistorySlice.reducer;
