import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import {
  UserProfile,
  UserNotification,
  UserPreferences,
  UserActivity,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
  IUserProfileResponse,
  IUserNotificationsResponse,
} from '@/types/user.types';

interface UserState {
  profile: UserProfile | null;
  notifications: UserNotification[];
  preferences: UserPreferences | null;
  activities: UserActivity[];
  unreadNotifications: number;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  notifications: [],
  preferences: null,
  activities: [],
  unreadNotifications: 0,
  loading: false,
  error: null,
};

// Thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try{
    const response = await api.get<IUserProfileResponse>(ApiEndpoints.USER_PROFILE);
    return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await api.put<IUserProfileResponse>(ApiEndpoints.USER_PROFILE, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// export const fetchUserPreferences = createAsyncThunk(
//   'user/fetchPreferences',
//   async () => {
//     const response = await api.get<UserPreferences>(ApiEndpoints.USER_PREFERENCES);
//     return response.data;
//   }
// );

// export const updateUserPreferences = createAsyncThunk(
//   'user/updatePreferences',
//   async (data: UpdatePreferencesRequest) => {
//     const response = await api.put<UserPreferences>(ApiEndpoints.USER_PREFERENCES, data);
//     return response.data;
//   }
// );

export const fetchUserNotifications = createAsyncThunk(
  'user/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<IUserNotificationsResponse>(ApiEndpoints.USER_NOTIFICATIONS);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'user/markNotificationRead',
  async (notificationId: string) => {
    await api.put(`${ApiEndpoints.USER_NOTIFICATIONS}/${notificationId}/read`);
    return notificationId;
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'user/markAllNotificationsRead',
  async () => {
    await api.put(`${ApiEndpoints.USER_NOTIFICATIONS}/read-all`);
    return true;
  }
);

export const fetchUserActivity = createAsyncThunk(
  'user/fetchActivity',
  async () => {
    const response = await api.get<UserActivity[]>(ApiEndpoints.USER_ACTIVITY);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      })

      // Preferences
      // .addCase(fetchUserPreferences.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchUserPreferences.fulfilled, (state, action) => {
      //   state.preferences = action.payload;
      //   state.loading = false;
      // })
      // .addCase(fetchUserPreferences.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || 'Failed to fetch preferences';
      // })

      // // Update Preferences
      // .addCase(updateUserPreferences.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(updateUserPreferences.fulfilled, (state, action) => {
      //   state.preferences = action.payload;
      //   state.loading = false;
      // })
      // .addCase(updateUserPreferences.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || 'Failed to update preferences';
      // })

      // Notifications
      .addCase(fetchUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action: PayloadAction<UserNotification[]>) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })

      // Mark Notification Read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification) {
          notification.isRead = true;
          state.unreadNotifications = state.notifications.filter(n => !n.isRead).length;
        }
      })

      // Mark All Notifications Read
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.isRead = true; });
        state.unreadNotifications = 0;
      })

      // Activity
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.activities = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activity';
      });
  },
});

export const { clearError, resetState } = userSlice.actions;
export default userSlice.reducer;
