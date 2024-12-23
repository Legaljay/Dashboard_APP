import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface AppCustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: {
    list: boolean;
    single: boolean;
    identify: boolean;
  };
  error: {
    list: string | null;
    single: string | null;
    identify: string | null;
  };
}

const initialState: AppCustomersState = {
  customers: [],
  selectedCustomer: null,
  loading: {
    list: false,
    single: false,
    identify: false,
  },
  error: {
    list: null,
    single: null,
    identify: null,
  },
};

export const fetchAppCustomers = createAsyncThunk(
  'appCustomers/fetchCustomers',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_CUSTOMERS.replace(':applicationId', applicationId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'appCustomers/fetchCustomerById',
  async ({ applicationId, customerId }: { applicationId: string; customerId: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_CUSTOMER_BY_ID
          .replace(':applicationId', applicationId)
          .replace(':id', customerId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer');
    }
  }
);

export const identifyCustomer = createAsyncThunk(
  'appCustomers/identifyCustomer',
  async (customerData: Partial<Customer>, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.WIDGET_IDENTIFY_CUSTOMER, customerData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to identify customer');
    }
  }
);

const appCustomersSlice = createSlice({
  name: 'appCustomers',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        list: null,
        single: null,
        identify: null,
      };
    },
    resetState: () => initialState,
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers List
      .addCase(fetchAppCustomers.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchAppCustomers.fulfilled, (state, action) => {
        state.loading.list = false;
        state.customers = action.payload;
      })
      .addCase(fetchAppCustomers.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload as string;
      })

      // Fetch Single Customer
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading.single = true;
        state.error.single = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading.single = false;
        state.selectedCustomer = action.payload;
        const index = state.customers.findIndex(customer => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        } else {
          state.customers.push(action.payload);
        }
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading.single = false;
        state.error.single = action.payload as string;
      })

      // Identify Customer
      .addCase(identifyCustomer.pending, (state) => {
        state.loading.identify = true;
        state.error.identify = null;
      })
      .addCase(identifyCustomer.fulfilled, (state, action) => {
        state.loading.identify = false;
        const index = state.customers.findIndex(customer => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        } else {
          state.customers.push(action.payload);
        }
      })
      .addCase(identifyCustomer.rejected, (state, action) => {
        state.loading.identify = false;
        state.error.identify = action.payload as string;
      });
  },
});

export const { clearErrors, resetState, setSelectedCustomer } = appCustomersSlice.actions;

// Selectors
export const selectAppCustomersState = (state: RootState) => state.appCustomers;
export const selectCustomers = (state: RootState) => state.appCustomers.customers;
export const selectSelectedCustomer = (state: RootState) => state.appCustomers.selectedCustomer;
export const selectAppCustomersLoading = (state: RootState) => state.appCustomers.loading;
export const selectAppCustomersError = (state: RootState) => state.appCustomers.error;

export default appCustomersSlice.reducer;
