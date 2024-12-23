import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  sender: {
    id: string;
    type: 'user' | 'system' | 'agent';
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

interface Channel {
  id: string;
  type: string;
  name: string;
  status: 'active' | 'inactive';
  config: Record<string, any>;
}

interface MessagingState {
  messages: Message[];
  channels: Channel[];
  activeChannel: string | null;
  loading: {
    send: boolean;
    channels: boolean;
  };
  error: {
    send: string | null;
    channels: string | null;
  };
}

const initialState: MessagingState = {
  messages: [],
  channels: [],
  activeChannel: null,
  loading: {
    send: false,
    channels: false,
  },
  error: {
    send: null,
    channels: null,
  },
};

export const sendMessage = createAsyncThunk(
  'messaging/sendMessage',
  async ({ applicationId, message }: { applicationId: string; message: Partial<Message> }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_MESSAGING_SEND.replace(':applicationId', applicationId),
        message
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const fetchChannels = createAsyncThunk(
  'messaging/fetchChannels',
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

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        send: null,
        channels: null,
      };
    },
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading.send = true;
        state.error.send = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading.send = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading.send = false;
        state.error.send = action.payload as string;
      })

      // Fetch Channels
      .addCase(fetchChannels.pending, (state) => {
        state.loading.channels = true;
        state.error.channels = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading.channels = false;
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading.channels = false;
        state.error.channels = action.payload as string;
      });
  },
});

export const { clearErrors, setActiveChannel, addMessage, resetState } = messagingSlice.actions;

// Basic selectors
export const selectMessagingState = (state: RootState) => state.messaging;
export const selectMessages = (state: RootState) => state.messaging.messages;
export const selectChannels = (state: RootState) => state.messaging.channels;
export const selectActiveChannel = (state: RootState) => state.messaging.activeChannel;
export const selectMessagingLoading = (state: RootState) => state.messaging.loading;
export const selectMessagingError = (state: RootState) => state.messaging.error;

// Computed selectors
export const selectActiveChannelData = (state: RootState) => {
  const activeChannelId = state.messaging.activeChannel;
  return activeChannelId 
    ? state.messaging.channels.find(channel => channel.id === activeChannelId)
    : null;
};

export const selectMessagesByChannel = (channelId: string) => (state: RootState) => 
  state.messaging.messages.filter(message => message.metadata?.channelId === channelId);

export default messagingSlice.reducer;
