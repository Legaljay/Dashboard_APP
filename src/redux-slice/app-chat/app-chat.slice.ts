import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    type: 'user' | 'employee' | 'system';
    name: string;
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

interface Chat {
  id: string;
  applicationId: string;
  status: 'active' | 'closed';
  messages: ChatMessage[];
  participants: {
    id: string;
    type: 'user' | 'employee' | 'system';
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

interface AppChatState {
  chats: Chat[];
  activeChat: Chat | null;
  loading: {
    list: boolean;
    create: boolean;
    createDemo: boolean;
    createEmployee: boolean;
    delete: boolean;
    sendDemo: boolean;
    sendTestEmployee: boolean;
  };
  error: {
    list: string | null;
    create: string | null;
    createDemo: string | null;
    createEmployee: string | null;
    delete: string | null;
    sendDemo: string | null;
    sendTestEmployee: string | null;
  };
}

const initialState: AppChatState = {
  chats: [],
  activeChat: null,
  loading: {
    list: false,
    create: false,
    createDemo: false,
    createEmployee: false,
    delete: false,
    sendDemo: false,
    sendTestEmployee: false,
  },
  error: {
    list: null,
    create: null,
    createDemo: null,
    createEmployee: null,
    delete: null,
    sendDemo: null,
    sendTestEmployee: null,
  },
};

export const fetchChats = createAsyncThunk(
  'appChat/fetchChats',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_CHAT.replace(':applicationId', applicationId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chats');
    }
  }
);

export const createChat = createAsyncThunk(
  'appChat/createChat',
  async ({ applicationId, chatData }: { applicationId: string; chatData: Partial<Chat> }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_CHAT_CREATE.replace(':applicationId', applicationId),
        chatData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
    }
  }
);

export const createDemoChat = createAsyncThunk(
  'appChat/createDemoChat',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_CHAT_DEMO.replace(':applicationId', applicationId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create demo chat');
    }
  }
);

export const createEmployeeChat = createAsyncThunk(
  'appChat/createEmployeeChat',
  async ({ applicationId, employeeData }: { applicationId: string; employeeData: any }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_CHAT_CREATE_EMPLOYEE.replace(':applicationId', applicationId),
        employeeData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee chat');
    }
  }
);

export const deleteChat = createAsyncThunk(
  'appChat/deleteChat',
  async ({ applicationId, chatId }: { applicationId: string; chatId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        ApiEndpoints.APP_CHAT_DELETE
          .replace(':applicationId', applicationId)
          .replace(':id', chatId)
      );
      return { chatId, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete chat');
    }
  }
);

export const sendDemoMessage = createAsyncThunk(
  'appChat/sendDemoMessage',
  async (
    { applicationId, chatId, message }: { applicationId: string; chatId: string; message: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_CHAT_SEND_DEMO
          .replace(':applicationId', applicationId)
          .replace(':askAgentChatId', chatId),
        { message }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send demo message');
    }
  }
);

const appChatSlice = createSlice({
  name: 'appChat',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        list: null,
        create: null,
        createDemo: null,
        createEmployee: null,
        delete: null,
        sendDemo: null,
        sendTestEmployee: null,
      };
    },
    resetState: () => initialState,
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chats
      .addCase(fetchChats.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading.list = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload as string;
      })

      // Create Chat
      .addCase(createChat.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading.create = false;
        state.chats.unshift(action.payload);
        state.activeChat = action.payload;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload as string;
      })

      // Create Demo Chat
      .addCase(createDemoChat.pending, (state) => {
        state.loading.createDemo = true;
        state.error.createDemo = null;
      })
      .addCase(createDemoChat.fulfilled, (state, action) => {
        state.loading.createDemo = false;
        state.chats.unshift(action.payload);
        state.activeChat = action.payload;
      })
      .addCase(createDemoChat.rejected, (state, action) => {
        state.loading.createDemo = false;
        state.error.createDemo = action.payload as string;
      })

      // Create Employee Chat
      .addCase(createEmployeeChat.pending, (state) => {
        state.loading.createEmployee = true;
        state.error.createEmployee = null;
      })
      .addCase(createEmployeeChat.fulfilled, (state, action) => {
        state.loading.createEmployee = false;
        state.chats.unshift(action.payload);
        state.activeChat = action.payload;
      })
      .addCase(createEmployeeChat.rejected, (state, action) => {
        state.loading.createEmployee = false;
        state.error.createEmployee = action.payload as string;
      })

      // Delete Chat
      .addCase(deleteChat.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.chats = state.chats.filter(chat => chat.id !== action.payload.chatId);
        if (state.activeChat?.id === action.payload.chatId) {
          state.activeChat = null;
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload as string;
      })

      // Send Demo Message
      .addCase(sendDemoMessage.pending, (state) => {
        state.loading.sendDemo = true;
        state.error.sendDemo = null;
      })
      .addCase(sendDemoMessage.fulfilled, (state, action) => {
        state.loading.sendDemo = false;
        if (state.activeChat?.id === action.payload.chatId) {
          state.activeChat?.messages.push(action.payload);
        }
        const chatIndex = state.chats.findIndex(chat => chat.id === action.payload.chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].messages.push(action.payload);
        }
      })
      .addCase(sendDemoMessage.rejected, (state, action) => {
        state.loading.sendDemo = false;
        state.error.sendDemo = action.payload as string;
      });
  },
});

export const { clearErrors, resetState, setActiveChat } = appChatSlice.actions;

// Selectors
export const selectAppChatState = (state: RootState) => state.appChat;
export const selectChats = (state: RootState) => state.appChat.chats;
export const selectActiveChat = (state: RootState) => state.appChat.activeChat;
export const selectAppChatLoading = (state: RootState) => state.appChat.loading;
export const selectAppChatError = (state: RootState) => state.appChat.error;

// Memoized Selectors
export const selectChatById = (chatId: string) => (state: RootState) =>
  state.appChat.chats.find(chat => chat.id === chatId);

export const selectActiveChatMessages = (state: RootState) =>
  state.appChat.activeChat?.messages || [];

export default appChatSlice.reducer;
