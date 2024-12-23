import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

interface ValidationResult {
  valid: boolean;
  message?: string;
  details?: Record<string, any>;
}

interface AppWidgetState {
  contacts: Contact[];
  validationResult: ValidationResult | null;
  loading: {
    createContact: boolean;
    validate: boolean;
  };
  error: {
    createContact: string | null;
    validate: string | null;
  };
}

const initialState: AppWidgetState = {
  contacts: [],
  validationResult: null,
  loading: {
    createContact: false,
    validate: false,
  },
  error: {
    createContact: null,
    validate: null,
  },
};

export const createContact = createAsyncThunk(
  'appWidget/createContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.WIDGET_CREATE_CONTACT, contactData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create contact');
    }
  }
);

export const validateWidget = createAsyncThunk(
  'appWidget/validate',
  async (validationData: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.WIDGET_VALIDATE, validationData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to validate widget');
    }
  }
);

const appWidgetSlice = createSlice({
  name: 'appWidget',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        createContact: null,
        validate: null,
      };
    },
    resetState: () => initialState,
    clearValidationResult: (state) => {
      state.validationResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Contact
      .addCase(createContact.pending, (state) => {
        state.loading.createContact = true;
        state.error.createContact = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading.createContact = false;
        state.contacts.unshift(action.payload);
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading.createContact = false;
        state.error.createContact = action.payload as string;
      })

      // Validate Widget
      .addCase(validateWidget.pending, (state) => {
        state.loading.validate = true;
        state.error.validate = null;
      })
      .addCase(validateWidget.fulfilled, (state, action) => {
        state.loading.validate = false;
        state.validationResult = action.payload;
      })
      .addCase(validateWidget.rejected, (state, action) => {
        state.loading.validate = false;
        state.error.validate = action.payload as string;
      });
  },
});

export const { clearErrors, resetState, clearValidationResult } = appWidgetSlice.actions;

// Selectors
export const selectAppWidgetState = (state: RootState) => state.appWidget;
export const selectContacts = (state: RootState) => state.appWidget.contacts;
export const selectValidationResult = (state: RootState) => state.appWidget.validationResult;
export const selectAppWidgetLoading = (state: RootState) => state.appWidget.loading;
export const selectAppWidgetError = (state: RootState) => state.appWidget.error;

export default appWidgetSlice.reducer;
