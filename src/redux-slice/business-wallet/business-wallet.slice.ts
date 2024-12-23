import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface WalletTransaction {
  id: string;
  amount: number;
  currency: string;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  timestamp: string;
}

interface Wallet {
  id: string;
  balance: string;
  currency: string;
  transfer: boolean;
  symbol: string;
  flag: string | null; 
  currency_flag_url: string | null;
  currency_name: string | null;
  support_virtual_account: boolean;
  support_virtual_card: boolean;
  status: boolean;
}


interface WalletResponse {
  status: boolean;
  message: string;
  data: Wallet[];
}

// interface Wallet {
//   id: string;
//   businessId: string;
//   balance: number;
//   currency: string;
//   status: 'active' | 'inactive' | 'frozen';
//   transactions: WalletTransaction[];
// }

interface BusinessWalletState {
  wallets: Wallet[];
  loading: boolean;
  error: string | null;
}

const initialState: BusinessWalletState = {
  wallets: [],
  loading: false,
  error: null,
};

export const fetchBusinessWallets = createAsyncThunk(
  'businessWallet/fetchWallets',
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.BUSINESS_WALLET.replace(':business_id', businessId)
      );
      return response.data.data as Wallet[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch business wallets');
    }
  }
);

const businessWalletSlice = createSlice({
  name: 'businessWallet',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessWallets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessWallets.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets = action.payload;
      })
      .addCase(fetchBusinessWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors, resetState } = businessWalletSlice.actions;

// Selectors
export const selectBusinessWalletState = (state: RootState) => state.businessWallet;
export const selectBusinessWallets = (state: RootState) => state.businessWallet.wallets;
export const selectBusinessWalletLoading = (state: RootState) => state.businessWallet.loading;
export const selectBusinessWalletError = (state: RootState) => state.businessWallet.error;

export default businessWalletSlice.reducer;
