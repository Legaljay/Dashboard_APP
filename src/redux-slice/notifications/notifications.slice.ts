import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { replaceUrlParams } from '@/utils/api.utils';
import { RootState } from '../store';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  preferences: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  preferences: {
    email: true,
    push: true,
    inApp: true,
  },
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await api.get(ApiEndpoints.USER_NOTIFICATIONS);
    return response.data;
  }
);

export const fetchNotificationById = createAsyncThunk(
  'notifications/fetchById',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.USER_NOTIFICATION_SINGLE, { id: notificationId })
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notification');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.USER_NOTIFICATION_READ, { id: notificationId })
      );
      return { id: notificationId, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

// export const markAsRead = createAsyncThunk(
//   'notifications/markAsRead',
//   async (notificationId: string) => {
//     const response = await api.put(`${ApiEndpoints.USER_NOTIFICATIONS}/${notificationId}/read`);
//     return response.data;
//   }
// );

// export const markAllAsRead = createAsyncThunk(
//   'notifications/markAllAsRead',
//   async () => {
//     const response = await api.put(`${ApiEndpoints.USER_NOTIFICATIONS}/read-all`);
//     return response.data;
//   }
// );

// export const updateNotificationPreferences = createAsyncThunk(
//   'notifications/updatePreferences',
//   async (preferences: NotificationsState['preferences']) => {
//     const response = await api.put(`${ApiEndpoints.USER_PREFERENCES}/notifications`, preferences);
//     return response.data;
//   }
// );

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both direct array response and wrapped response
        const notifications = Array.isArray(action.payload) ? action.payload : 
                            (action.payload?.data && Array.isArray(action.payload.data)) ? action.payload.data : null;
        
        if (notifications) {
          state.notifications = notifications;
          state.unreadCount = notifications.filter((n: Notification) => !n.read).length;
        } else {
          state.notifications = [];
          state.unreadCount = 0;
          console.warn('Unexpected payload structure in fetchNotifications:', action.payload);
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(fetchNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        } else {
          state.notifications.push(action.payload);
          if (!action.payload.read) {
            state.unreadCount += 1;
          }
        }
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notification';
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const notification = state.notifications.find(n => n.id === action.payload.id);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to mark notification as read';
      })
      // .addCase(markAsRead.fulfilled, (state, action) => {
      //   const notification = state.notifications.find(n => n.id === action.payload.id);
      //   if (notification && !notification.read) {
      //     notification.read = true;
      //     state.unreadCount -= 1;
      //   }
      // })
      // .addCase(markAllAsRead.fulfilled, (state) => {
      //   state.notifications.forEach(notification => {
      //     notification.read = true;
      //   });
      //   state.unreadCount = 0;
      // })
      // .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
      //   state.preferences = action.payload;
      // });
  },
});

export const { clearError, addNotification, removeNotification } = notificationsSlice.actions;

export const selectNotificationById = (id: string) => (state: RootState) =>
  state.notifications.notifications.find(notification => notification.id === id);

export const selectUnreadNotifications = (state: RootState) =>
  state.notifications.notifications.filter(notification => !notification.read);

export default notificationsSlice.reducer;
