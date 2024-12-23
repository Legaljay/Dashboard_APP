import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface ChannelConfig {
  webhookUrl?: string;
  apiKey?: string;
  customFields?: Record<string, any>;
}

interface Channel {
  id: string;
  applicationId: string;
  name: string;
  type: 'slack' | 'email' | 'sms' | 'webhook' | 'custom';
  status: 'active' | 'inactive' | 'pending';
  config: ChannelConfig;
  createdAt: string;
  updatedAt: string;
}

interface ChannelState {
  channels: Channel[];
  selectedChannel: string | null;
  loading: {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: {
    list: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
}

const initialState: ChannelState = {
  channels: [],
  selectedChannel: null,
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },
  error: {
    list: null,
    create: null,
    update: null,
    delete: null,
  },
};

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_CHANNELS.replace(':applicationId', applicationId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channels');
    }
  }
);

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async ({ applicationId, channelData }: { applicationId: string; channelData: Partial<Channel> }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_CHANNELS.replace(':applicationId', applicationId),
        channelData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create channel');
    }
  }
);

export const updateChannel = createAsyncThunk(
  'channels/updateChannel',
  async ({ applicationId, channelId, channelData }: { 
    applicationId: string; 
    channelId: string; 
    channelData: Partial<Channel> 
  }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        ApiEndpoints.APP_CHANNEL.replace(':applicationId', applicationId).replace(':channelId', channelId),
        channelData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update channel');
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'channels/deleteChannel',
  async ({ applicationId, channelId }: { applicationId: string; channelId: string }, { rejectWithValue }) => {
    try {
      await api.delete(
        ApiEndpoints.APP_CHANNEL.replace(':applicationId', applicationId).replace(':channelId', channelId)
      );
      return channelId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete channel');
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setSelectedChannel: (state, action) => {
      state.selectedChannel = action.payload;
    },
    clearErrors: (state) => {
      state.error = {
        list: null,
        create: null,
        update: null,
        delete: null,
      };
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Channels
      .addCase(fetchChannels.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading.list = false;
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload as string;
      })

      // Create Channel
      .addCase(createChannel.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading.create = false;
        state.channels.push(action.payload);
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload as string;
      })

      // Update Channel
      .addCase(updateChannel.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.channels.findIndex(channel => channel.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload as string;
      })

      // Delete Channel
      .addCase(deleteChannel.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.channels = state.channels.filter(channel => channel.id !== action.payload);
        if (state.selectedChannel === action.payload) {
          state.selectedChannel = null;
        }
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload as string;
      });
  },
});

export const { setSelectedChannel, clearErrors, resetState } = channelsSlice.actions;

// Basic selectors
export const selectChannelsState = (state: RootState) => state.channels;
export const selectAllChannels = (state: RootState) => state.channels.channels;
export const selectSelectedChannel = (state: RootState) => state.channels.selectedChannel;
export const selectChannelsLoading = (state: RootState) => state.channels.loading;
export const selectChannelsError = (state: RootState) => state.channels.error;

// Computed selectors
export const selectSelectedChannelData = (state: RootState) => {
  const selectedChannelId = state.channels.selectedChannel;
  return selectedChannelId 
    ? state.channels.channels.find(channel => channel.id === selectedChannelId)
    : null;
};

export const selectChannelsByType = (type: Channel['type']) => (state: RootState) =>
  state.channels.channels.filter(channel => channel.type === type);

export const selectActiveChannels = (state: RootState) =>
  state.channels.channels.filter(channel => channel.status === 'active');

export default channelsSlice.reducer;
