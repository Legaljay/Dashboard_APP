import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { IBusinessSettings } from '../types';
import { api } from '../services/api';

interface SettingsState {
  business: IBusinessSettings | null;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string | null;
    sessionTimeout: number;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  business: null,
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: null,
    sessionTimeout: 30, // minutes
  },
  preferences: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
  },
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk('settings/fetch', async () => {
  try {
    const response = await api.get<SettingsState>('/settings');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch settings');
  }
});

export const updateSettings = createAsyncThunk(
  'settings/update',
  async (settings: Partial<SettingsState>) => {
    try {
      const response = await api.patch<SettingsState>('/settings', settings);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

export const updateBusinessSettings = createAsyncThunk(
  'settings/updateBusiness',
  async (settings: IBusinessSettings) => {
    try {
      const response = await api.patch<{ business: IBusinessSettings }>(
        '/settings/business',
        settings
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update business settings');
    }
  }
);

export const updateSecuritySettings = createAsyncThunk(
  'settings/updateSecurity',
  async (settings: Partial<SettingsState['security']>) => {
    try {
      const response = await api.patch<{ security: SettingsState['security'] }>(
        '/settings/security',
        settings
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update security settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<SettingsState['notifications']>>
    ) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<SettingsState['preferences']>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setBusinessSettings: (state, action: PayloadAction<IBusinessSettings>) => {
      state.business = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch settings';
      })
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update settings';
      })
      .addCase(updateBusinessSettings.fulfilled, (state, action) => {
        state.business = action.payload.business;
      })
      .addCase(updateSecuritySettings.fulfilled, (state, action) => {
        state.security = action.payload.security;
      });
  },
});

export const {
  updateNotificationSettings,
  updatePreferences,
  setBusinessSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
