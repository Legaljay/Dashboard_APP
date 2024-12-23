import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';
import { replaceUrlParams } from '../../utils/api.utils';

interface ChatRating {
  id: string;
  rating: number;
  feedback?: string;
  conversationId: string;
  messageId: string;
  createdAt: string;
}

interface ChatRatingState {
  ratings: Record<string, ChatRating>;
  loading: boolean;
  error: string | null;
}

const initialState: ChatRatingState = {
  ratings: {},
  loading: false,
  error: null,
};

export const submitChatRating = createAsyncThunk(
  'chatRating/submitRating',
  async ({
    applicationId,
    chatId,
    messageId,
    rating,
    feedback,
  }: {
    applicationId: string;
    chatId: string;
    messageId: string;
    rating: number;
    feedback?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APP_CHAT_CONVERSATION_RATING, {
          applicationId,
          askAgentChatId: chatId,
          askAgentChatConversationMessageId: messageId,
        }),
        { rating, feedback }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit chat rating');
    }
  }
);

const chatRatingSlice = createSlice({
  name: 'chatRating',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitChatRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitChatRating.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings[action.payload.messageId] = action.payload;
      })
      .addCase(submitChatRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit chat rating';
      });
  },
});

export const { clearError, resetState } = chatRatingSlice.actions;

// Selectors
export const selectChatRatings = (state: RootState) => state.chatRating.ratings;
export const selectChatRatingByMessageId = (messageId: string) => (state: RootState) => 
  state.chatRating.ratings[messageId];
export const selectChatRatingLoading = (state: RootState) => state.chatRating.loading;
export const selectChatRatingError = (state: RootState) => state.chatRating.error;

export default chatRatingSlice.reducer;
