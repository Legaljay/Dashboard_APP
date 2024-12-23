import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';
import { create } from 'domain';

interface CurrencyDetails {
  currency: string;
  symbol: string;
  image: string;
}

interface ExchangeRateEntry {
  id: string;
  source: CurrencyDetails;
  target: CurrencyDetails;
  rate: string; 
}

interface FetchCurrencyRatesResponse {
  status: boolean;
  message: string;
  data: ExchangeRateEntry[];
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

interface CurrencyState {
  rates:  ExchangeRateEntry[];
  conversions: Record<string, ExchangeRate>;
  loading: {
    rates: boolean;
    convert: boolean;
    exchange: boolean;
  };
  error: {
    rates: string | null;
    convert: string | null;
    exchange: string | null;
  };
  lastUpdated: string | null;
}

const initialState: CurrencyState = {
  rates: [],
  conversions: {},
  loading: {
    rates: false,
    convert: false,
    exchange: false,
  },
  error: {
    rates: null,
    convert: null,
    exchange: null,
  },
  lastUpdated: null,
};

export const fetchCurrencyRates = createAsyncThunk(
  'currency/fetchRates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.CURRENCY_RATES);
      return response.data.data as ExchangeRateEntry[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch currency rates');
    }
  }
);

export const convertCurrency = createAsyncThunk(
  'currency/convert',
  async (
    data: { amount: number; from: string; to: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(ApiEndpoints.CURRENCY_CONVERT, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to convert currency');
    }
  }
);

export const getExchangeRate = createAsyncThunk(
  'currency/getExchangeRate',
  async (
    data: { from: string; to: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(ApiEndpoints.CURRENCY_RATE_EXCHANGE, { params: data });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get exchange rate');
    }
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        rates: null,
        convert: null,
        exchange: null,
      };
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Currency Rates
      .addCase(fetchCurrencyRates.pending, (state) => {
        state.loading.rates = true;
        state.error.rates = null;
      })
      .addCase(fetchCurrencyRates.fulfilled, (state, action) => {
        state.loading.rates = false;
        state.rates = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCurrencyRates.rejected, (state, action) => {
        state.loading.rates = false;
        state.error.rates = action.payload as string;
      })

      // Convert Currency
      .addCase(convertCurrency.pending, (state) => {
        state.loading.convert = true;
        state.error.convert = null;
      })
      .addCase(convertCurrency.fulfilled, (state, action) => {
        state.loading.convert = false;
        const { from, to, rate, timestamp } = action.payload;
        state.conversions[`${from}_${to}`] = {
          from,
          to,
          rate,
          lastUpdated: timestamp,
        };
      })
      .addCase(convertCurrency.rejected, (state, action) => {
        state.loading.convert = false;
        state.error.convert = action.payload as string;
      })

      // Get Exchange Rate
      .addCase(getExchangeRate.pending, (state) => {
        state.loading.exchange = true;
        state.error.exchange = null;
      })
      .addCase(getExchangeRate.fulfilled, (state, action) => {
        state.loading.exchange = false;
        const { from, to, rate, timestamp } = action.payload;
        state.conversions[`${from}_${to}`] = {
          from,
          to,
          rate,
          lastUpdated: timestamp,
        };
      })
      .addCase(getExchangeRate.rejected, (state, action) => {
        state.loading.exchange = false;
        state.error.exchange = action.payload as string;
      });
  },
});

export const { clearErrors, resetState } = currencySlice.actions;

// Selectors
export const selectCurrencyState = (state: RootState) => state.currency;
export const selectCurrencyRates = (state: RootState) => state.currency.rates;
export const selectCurrencyConversions = (state: RootState) => state.currency.conversions;
export const selectCurrencyLoading = (state: RootState) => state.currency.loading;
export const selectCurrencyError = (state: RootState) => state.currency.error;
export const selectCurrencyLastUpdated = (state: RootState) => state.currency.lastUpdated;

// Memoized selectors for specific conversions
export const selectConversionRate = (from: string, to: string) => (state: RootState) => {
  const key = `${from}_${to}`;
  return state.currency.conversions[key]?.rate;
};

export const selectConversionLastUpdated = (from: string, to: string) => (state: RootState) => {
  const key = `${from}_${to}`;
  return state.currency.conversions[key]?.lastUpdated;
};

// Selector to get the exchange rate for specific currency pairs
export const selectExchangeRate = (from: string, to: string) => (state: RootState) => {
  const exchangeRateEntry = state.currency.rates?.find(rate => 
      rate.source.currency === from && rate.target.currency === to
  );
  return exchangeRateEntry ? exchangeRateEntry.rate : null; // Return the rate or null if not found
};

export const selectExchangeCurrencyData = createSelector(
  [selectCurrencyState],
  (currencyState) => ({
    rates: currencyState.rates,
    conversions: currencyState.conversions,
    loading: currencyState.loading,
    error: currencyState.error,
    lastUpdated: currencyState.lastUpdated,
  })
);

export default currencySlice.reducer;
