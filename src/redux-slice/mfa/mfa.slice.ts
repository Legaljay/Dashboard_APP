import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface MFAState {
  secret: string | null;
  isEnabled: boolean| null;
  isSetup: boolean | null;
  qrCode: string | null;
  loading: {
    setup: boolean;
    verify: boolean;
    toggle: boolean;
    settings: boolean;
  };
  error: {
    setup: string | null;
    verify: string | null;
    toggle: string | null;
    settings: string | null;
  };
}

const initialState: MFAState = {
  secret: null,
  isEnabled: null,
  isSetup: null,
  qrCode: null,
  loading: {
    setup: false,
    verify: false,
    toggle: false,
    settings: false,
  },
  error: {
    setup: null,
    verify: null,
    toggle: null,
    settings: null,
  },
};

export const generateMFASecret = createAsyncThunk(
  'mfa/generateSecret',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.USER_MFA_GENERATE_SECRET);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate MFA secret');
    }
  }
);

export const setupMFA = createAsyncThunk(
  'mfa/setup',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.USER_MFA_SETUP, { token });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to setup MFA');
    }
  }
);

export const verifyMFA = createAsyncThunk(
  'mfa/verify',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.USER_MFA_VERIFY, { token });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify MFA token');
    }
  }
);

export const toggleMFA = createAsyncThunk(
  'mfa/toggle',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put(ApiEndpoints.USER_MFA_TOGGLE);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle MFA');
    }
  }
);

export const getMFASettings = createAsyncThunk(
  'mfa/getSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.USER_MFA_SETTINGS);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get MFA settings');
    }
  }
);

const mfaSlice = createSlice({
  name: 'mfa',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        setup: null,
        verify: null,
        toggle: null,
        settings: null,
      };
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Generate Secret
      .addCase(generateMFASecret.pending, (state) => {
        state.loading.setup = true;
        state.error.setup = null;
      })
      .addCase(generateMFASecret.fulfilled, (state, action) => {
        state.loading.setup = false;
        state.secret = action.payload.secret;
        state.qrCode = action.payload.url;
      })
      .addCase(generateMFASecret.rejected, (state, action) => {
        state.loading.setup = false;
        state.error.setup = action.payload as string;
      })

      // Setup MFA
      .addCase(setupMFA.pending, (state) => {
        state.loading.setup = true;
        state.error.setup = null;
      })
      .addCase(setupMFA.fulfilled, (state) => {
        state.loading.setup = false;
        state.isEnabled = true;
      })
      .addCase(setupMFA.rejected, (state, action) => {
        state.loading.setup = false;
        state.error.setup = action.payload as string;
      })

      // Verify MFA
      .addCase(verifyMFA.pending, (state) => {
        state.loading.verify = true;
        state.error.verify = null;
      })
      .addCase(verifyMFA.fulfilled, (state) => {
        state.loading.verify = false;
      })
      .addCase(verifyMFA.rejected, (state, action) => {
        state.loading.verify = false;
        state.error.verify = action.payload as string;
      })

      // Toggle MFA
      .addCase(toggleMFA.pending, (state) => {
        state.loading.toggle = true;
        state.error.toggle = null;
      })
      .addCase(toggleMFA.fulfilled, (state) => {
        state.loading.toggle = false;
        state.isEnabled = !state.isEnabled;
      })
      .addCase(toggleMFA.rejected, (state, action) => {
        state.loading.toggle = false;
        state.error.toggle = action.payload as string;
      })

      // Get MFA Settings
      .addCase(getMFASettings.pending, (state) => {
        state.loading.settings = true;
        state.error.settings = null;
      })
      .addCase(getMFASettings.fulfilled, (state, action) => {
        state.loading.settings = false;
        state.isEnabled = action.payload.is_enabled;
        state.isSetup = action.payload.is_setup;
      })
      .addCase(getMFASettings.rejected, (state, action) => {
        state.loading.settings = false;
        state.error.settings = action.payload as string;
      });
  },
});

export const { clearErrors, resetState } = mfaSlice.actions;

export const selectMFAState = (state: RootState) => state.mfa;
export const selectMFAIsEnabled = (state: RootState) => state.mfa.isEnabled;
export const selectMFALoading = (state: RootState) => state.mfa.loading;
export const selectMFAError = (state: RootState) => state.mfa.error;

export default mfaSlice.reducer;
