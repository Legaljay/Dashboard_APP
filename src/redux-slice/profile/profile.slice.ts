import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar: string | null;
  country: string;
  timezone: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  digest: 'none' | 'daily' | 'weekly';
  types: {
    security: boolean;
    updates: boolean;
    marketing: boolean;
  };
}

interface UserConfig {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  preferences: {
    dateFormat: string;
    timeFormat: '12h' | '24h';
    currency: string;
  };
}

interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  details: Record<string, any>;
  category: 'auth' | 'profile' | 'settings' | 'business' | 'other';
  ip?: string;
  userAgent?: string;
}

interface ProfileState {
  profile: UserProfile | null;
  config: UserConfig | null;
  activities: UserActivity[];
  loading: {
    profile: boolean;
    config: boolean;
    activity: boolean;
    update: boolean;
    password: boolean;
  };
  error: {
    profile: string | null;
    config: string | null;
    activity: string | null;
    update: string | null;
    password: string | null;
  };
}

const initialState: ProfileState = {
  profile: null,
  config: null,
  activities: [],
  loading: {
    profile: false,
    config: false,
    activity: false,
    update: false,
    password: false,
  },
  error: {
    profile: null,
    config: null,
    activity: null,
    update: null,
    password: null,
  },
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.USER_PROFILE);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await api.put(ApiEndpoints.USER_UPDATE, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (data: { password: string; old_password: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(ApiEndpoints.USER_PASSWORD, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

export const fetchUserConfig = createAsyncThunk(
  'profile/fetchUserConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.USER_CONFIG);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user config');
    }
  }
);

export const fetchUserActivity = createAsyncThunk(
  'profile/fetchUserActivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.USER_ACTIVITY);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user activity');
    }
  }
);

export const updateUserConfig = createAsyncThunk(
  'profile/updateUserConfig',
  async (data: Partial<UserConfig>, { rejectWithValue }) => {
    try {
      const response = await api.put(ApiEndpoints.USER_CONFIG, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user config');
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'profile/updateNotificationSettings',
  async (settings: Partial<NotificationSettings>, { rejectWithValue }) => {
    try {
      const response = await api.put(ApiEndpoints.USER_NOTIFICATIONS, settings);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update notification settings');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        profile: null,
        config: null,
        activity: null,
        update: null,
        password: null,
      };
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.payload as string;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading.update = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload as string;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading.password = true;
        state.error.password = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading.password = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading.password = false;
        state.error.password = action.payload as string;
      })

      // Fetch User Config
      .addCase(fetchUserConfig.pending, (state) => {
        state.loading.config = true;
        state.error.config = null;
      })
      .addCase(fetchUserConfig.fulfilled, (state, action) => {
        state.loading.config = false;
        state.config = action.payload;
      })
      .addCase(fetchUserConfig.rejected, (state, action) => {
        state.loading.config = false;
        state.error.config = action.payload as string;
      })

      // Update User Config
      .addCase(updateUserConfig.pending, (state) => {
        state.loading.config = true;
        state.error.config = null;
      })
      .addCase(updateUserConfig.fulfilled, (state, action) => {
        state.loading.config = false;
        state.config = { ...state.config, ...action.payload };
      })
      .addCase(updateUserConfig.rejected, (state, action) => {
        state.loading.config = false;
        state.error.config = action.payload as string;
      })

      // Update Notification Settings
      .addCase(updateNotificationSettings.pending, (state) => {
        state.loading.config = true;
        state.error.config = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.loading.config = false;
        if (state.config) {
          state.config.notifications = action.payload;
        }
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.loading.config = false;
        state.error.config = action.payload as string;
      })

      // Fetch User Activity
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading.activity = true;
        state.error.activity = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading.activity = false;
        state.activities = action.payload;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading.activity = false;
        state.error.activity = action.payload as string;
      });
  },
});

export const { clearErrors, resetState } = profileSlice.actions;

// Basic selectors
export const selectProfileState = (state: RootState) => state.profile;
export const selectUserProfile = (state: RootState) => state.profile.profile;
export const selectUserConfig = (state: RootState) => state.profile.config;
export const selectUserActivities = (state: RootState) => state.profile.activities;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;

// Computed selectors
export const selectFullName = createSelector(
  selectUserProfile,
  (profile) => profile ? `${profile.firstName} ${profile.lastName}` : ''
);

export const selectNotificationSettings = createSelector(
  selectUserConfig,
  (config) => config?.notifications
);

export const selectThemePreference = createSelector(
  selectUserConfig,
  (config) => config?.theme || 'system'
);

export const selectDateTimePreferences = createSelector(
  selectUserConfig,
  (config) => config?.preferences ? {
    dateFormat: config.preferences.dateFormat,
    timeFormat: config.preferences.timeFormat
  } : null
);

export const selectActivityByCategory = (category: UserActivity['category']) =>
  createSelector(
    selectUserActivities,
    (activities) => activities.filter(activity => activity.category === category)
);

export const selectRecentActivities = createSelector(
  selectUserActivities,
  (activities) => activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
);

export const selectSecurityActivities = createSelector(
  selectUserActivities,
  (activities) => activities.filter(activity => 
    activity.category === 'auth' || 
    activity.action.toLowerCase().includes('password') ||
    activity.action.toLowerCase().includes('security')
  )
);

export default profileSlice.reducer;
