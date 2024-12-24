import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';
import { replaceUrlParams } from '../../utils/api.utils';

interface PeerConnection {
  id: string;
  status: 'pending' | 'connected' | 'disconnected';
  requestedAt: string;
  connectedAt?: string;
  disconnectedAt?: string;
  metadata: Record<string, any>;
}

interface PeerState {
  connections: PeerConnection[];
  activeConnection: PeerConnection | null;
  loading: boolean;
  error: string | null;
}

const initialState: PeerState = {
  connections: [],
  activeConnection: null,
  loading: false,
  error: null,
};

export const requestPeerConnection = createAsyncThunk(
  'peer/requestConnection',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APP_PEER_REQUEST, { applicationId })
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request peer connection');
    }
  }
);

export const resendPeerRequest = createAsyncThunk(
  'peer/resendRequest',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APP_PEER_REQUEST_RESEND, { applicationId })
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to resend peer request');
    }
  }
);

export const connectPeer = createAsyncThunk(
  'peer/connect',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APP_PEER_CONNECT, { applicationId })
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to connect peer');
    }
  }
);

export const disconnectPeer = createAsyncThunk(
  'peer/disconnect',
  async ({ applicationId, peerId }: { applicationId: string; peerId: string }, { rejectWithValue }) => {
    try {
      await api.post(
        replaceUrlParams(ApiEndpoints.APP_PEER_DISCONNECT, { applicationId, id: peerId })
      );
      return peerId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to disconnect peer');
    }
  }
);

export const deletePeer = createAsyncThunk(
  'peer/delete',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      await api.delete(
        replaceUrlParams(ApiEndpoints.APP_PEER_DELETE, { applicationId })
      );
      return applicationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete peer');
    }
  }
);

const peerSlice = createSlice({
  name: 'peer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Request Peer Connection
      .addCase(requestPeerConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPeerConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.connections.push(action.payload);
      })
      .addCase(requestPeerConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to request peer connection';
      })

      // Resend Peer Request
      .addCase(resendPeerRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendPeerRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.connections.findIndex(conn => conn.id === action.payload.id);
        if (index !== -1) {
          state.connections[index] = action.payload;
        }
      })
      .addCase(resendPeerRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to resend peer request';
      })

      // Connect Peer
      .addCase(connectPeer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectPeer.fulfilled, (state, action) => {
        state.loading = false;
        state.activeConnection = action.payload;
        const index = state.connections.findIndex(conn => conn.id === action.payload.id);
        if (index !== -1) {
          state.connections[index] = action.payload;
        } else {
          state.connections.push(action.payload);
        }
      })
      .addCase(connectPeer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to connect peer';
      })

      // Disconnect Peer
      .addCase(disconnectPeer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disconnectPeer.fulfilled, (state, action) => {
        state.loading = false;
        if (state.activeConnection?.id === action.payload) {
          state.activeConnection = null;
        }
        const index = state.connections.findIndex(conn => conn.id === action.payload);
        if (index !== -1) {
          state.connections[index] = {
            ...state.connections[index],
            status: 'disconnected',
            disconnectedAt: new Date().toISOString(),
          };
        }
      })
      .addCase(disconnectPeer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to disconnect peer';
      })

      // Delete Peer
      .addCase(deletePeer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePeer.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = state.connections.filter(conn => conn.id !== action.payload);
        if (state.activeConnection?.id === action.payload) {
          state.activeConnection = null;
        }
      })
      .addCase(deletePeer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete peer';
      });
  },
});

export const { clearError, resetState } = peerSlice.actions;

// Selectors
export const selectPeerConnections = (state: RootState) => state.appPeer.connections;
export const selectActivePeerConnection = (state: RootState) => state.appPeer.activeConnection;
export const selectPeerLoading = (state: RootState) => state.appPeer.loading;
export const selectPeerError = (state: RootState) => state.appPeer.error;

export default peerSlice.reducer;
