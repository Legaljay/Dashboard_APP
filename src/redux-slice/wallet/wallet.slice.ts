import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';

interface WalletState {
  balance: number;
  transactions: any[];
  stats: any;
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  balance: 0,
  transactions: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async () => {
    const response = await api.get(ApiEndpoints.WALLET_BALANCE);
    return response.data;
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async () => {
    const response = await api.get(ApiEndpoints.WALLET_TRANSACTIONS);
    return response.data;
  }
);

export const fetchTransactionStats = createAsyncThunk(
  'wallet/fetchStats',
  async () => {
    const response = await api.get(ApiEndpoints.TRANSACTIONS_STATS);
    return response.data;
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wallet balance';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer;
