import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface Session {
  id: string;
  userId: string;
  applicationId: string;
  status: 'active' | 'disconnected';
  startTime: string;
  endTime?: string;
  metadata?: Record<string, any>;
}

interface AppSessionsState {
  sessions: Session[];
  activeSession: Session | null;
  loading: {
    list: boolean;
    connect: boolean;
    disconnect: boolean;
  };
  error: {
    list: string | null;
    connect: string | null;
    disconnect: string | null;
  };
}

const initialState: AppSessionsState = {
  sessions: [],
  activeSession: null,
  loading: {
    list: false,
    connect: false,
    disconnect: false,
  },
  error: {
    list: null,
    connect: null,
    disconnect: null,
  },
};

export const fetchAppSession = createAsyncThunk(
  'appSessions/fetchSession',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_SESSION.replace(':applicationId', applicationId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch session');
    }
  }
);

export const connectSession = createAsyncThunk(
  'appSessions/connect',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_SESSION_CONNECT.replace(':applicationId', applicationId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to connect session');
    }
  }
);

export const disconnectSession = createAsyncThunk(
  'appSessions/disconnect',
  async ({ applicationId, sessionId }: { applicationId: string; sessionId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_SESSION_DISCONNECT
          .replace(':applicationId', applicationId)
          .replace(':id', sessionId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to disconnect session');
    }
  }
);

const appSessionsSlice = createSlice({
  name: 'appSessions',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        list: null,
        connect: null,
        disconnect: null,
      };
    },
    resetState: () => initialState,
    setActiveSession: (state, action) => {
      state.activeSession = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Session
      .addCase(fetchAppSession.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchAppSession.fulfilled, (state, action) => {
        state.loading.list = false;
        state.sessions = Array.isArray(action.payload) ? action.payload : [action.payload];
        state.activeSession = action.payload.find((session: Session) => session.status === 'active') || null;
      })
      .addCase(fetchAppSession.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload as string;
      })

      // Connect Session
      .addCase(connectSession.pending, (state) => {
        state.loading.connect = true;
        state.error.connect = null;
      })
      .addCase(connectSession.fulfilled, (state, action) => {
        state.loading.connect = false;
        state.activeSession = action.payload;
        state.sessions.unshift(action.payload);
      })
      .addCase(connectSession.rejected, (state, action) => {
        state.loading.connect = false;
        state.error.connect = action.payload as string;
      })

      // Disconnect Session
      .addCase(disconnectSession.pending, (state) => {
        state.loading.disconnect = true;
        state.error.disconnect = null;
      })
      .addCase(disconnectSession.fulfilled, (state, action) => {
        state.loading.disconnect = false;
        if (state.activeSession?.id === action.payload.id) {
          state.activeSession = null;
        }
        const index = state.sessions.findIndex(session => session.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
      })
      .addCase(disconnectSession.rejected, (state, action) => {
        state.loading.disconnect = false;
        state.error.disconnect = action.payload as string;
      });
  },
});

export const { clearErrors, resetState, setActiveSession } = appSessionsSlice.actions;

// Selectors
export const selectAppSessionsState = (state: RootState) => state.appSessions;
export const selectSessions = (state: RootState) => state.appSessions.sessions;
export const selectActiveSession = (state: RootState) => state.appSessions.activeSession;
export const selectAppSessionsLoading = (state: RootState) => state.appSessions.loading;
export const selectAppSessionsError = (state: RootState) => state.appSessions.error;

export default appSessionsSlice.reducer;
