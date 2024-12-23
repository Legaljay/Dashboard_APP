import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { replaceUrlParams } from '@/utils/api.utils';

// Types
interface Contact {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  conversationId: string;
}

interface Conversation {
  id: string;
  title: string;
  applicationId?: string;
  userId?: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

interface WidgetState {
  conversations: Record<string, Conversation>;
  messages: Record<string, Message[]>;
  loading: boolean;
  creating: boolean;
  error: string | null;
}

const initialState: WidgetState = {
  conversations: {},
  messages: {},
  loading: false,
  creating: false,
  error: null,
};

// Async Thunks
export const createContact = createAsyncThunk(
  'widget/createContact',
  async (contactData: Partial<Contact>, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.WIDGET_CREATE_CONTACT, contactData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create contact');
    }
  }
);

export const validateWidget = createAsyncThunk(
  'widget/validate',
  async (validationData: any, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.WIDGET_VALIDATE, validationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to validate widget');
    }
  }
);

export const createConversation = createAsyncThunk(
  'widget/createConversation',
  async (conversationData: Partial<Conversation>, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.WIDGET_CREATE_CONVERSATION, conversationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create conversation');
    }
  }
);

export const fetchDashboardConversations = createAsyncThunk(
  'widget/fetchDashboardConversations',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.WIDGET_DASHBOARD_CONVERSATIONS, { applicationId })
      );
      return { applicationId, conversations: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard conversations');
    }
  }
);

export const fetchConversationById = createAsyncThunk(
  'widget/fetchConversationById',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.WIDGET_CONVERSATION_BY_ID, { conversationId })
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation');
    }
  }
);

export const fetchUserConversations = createAsyncThunk(
  'widget/fetchUserConversations',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.WIDGET_USER_CONVERSATIONS, { userId })
      );
      return { userId, conversations: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user conversations');
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'widget/fetchConversationMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.WIDGET_CONVERSATION_MESSAGES, { conversationId })
      );
      return { conversationId, messages: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation messages');
    }
  }
);

const widgetSlice = createSlice({
  name: 'widget',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create Contact
      .addCase(createContact.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create contact';
      })
      // Validate Widget
      .addCase(validateWidget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateWidget.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(validateWidget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to validate widget';
      })
      // Create Conversation
      .addCase(createConversation.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.creating = false;
        state.conversations[action.payload.id] = action.payload;
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create conversation';
      })
      // Fetch Dashboard Conversations
      .addCase(fetchDashboardConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardConversations.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.conversations.forEach((conversation: Conversation) => {
          state.conversations[conversation.id] = conversation;
        });
      })
      .addCase(fetchDashboardConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard conversations';
      })
      // Fetch Conversation By ID
      .addCase(fetchConversationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations[action.payload.id] = action.payload;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch conversation';
      })
      // Fetch User Conversations
      .addCase(fetchUserConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.conversations.forEach((conversation: Conversation) => {
          state.conversations[conversation.id] = conversation;
        });
      })
      .addCase(fetchUserConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user conversations';
      })
      // Fetch Conversation Messages
      .addCase(fetchConversationMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch conversation messages';
      });
  },
});

// Actions
export const { clearError, resetState } = widgetSlice.actions;

// Selectors
export const selectAllConversations = (state: RootState) => 
  Object.values(state.widget.conversations);

export const selectConversationById = (conversationId: string) => 
  (state: RootState) => state.widget.conversations[conversationId];

export const selectConversationsByApplication = (applicationId: string) => 
  (state: RootState) => Object.values(state.widget.conversations)
    .filter(conversation => conversation.applicationId === applicationId);

export const selectConversationsByUser = (userId: string) => 
  (state: RootState) => Object.values(state.widget.conversations)
    .filter(conversation => conversation.userId === userId);

export const selectConversationMessages = (conversationId: string) => 
  (state: RootState) => state.widget.messages[conversationId] || [];

export const selectWidgetLoading = (state: RootState) => state.widget.loading;
export const selectWidgetCreating = (state: RootState) => state.widget.creating;
export const selectWidgetError = (state: RootState) => state.widget.error;

export default widgetSlice.reducer;
