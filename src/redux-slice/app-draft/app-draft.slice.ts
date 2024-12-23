import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';
import { Application } from '@/types/applications.types';
import { Instruction } from '../app-instructions/app-instructions.slice';
import { AppMemoryFile } from '../app-memory/app-memory.slice';
import { Plugin } from '../plugins/plugins.slice';

export interface AppDraft {
  application: Application[];
  instructions: Instruction[];
  features: any[];
  integrations: any[];
  widgets: any[];
  conversations: any[];
  memory: AppMemoryFile[];
  plugins: Plugin[];
}

interface AppDraftState {
  draft: AppDraft | null;
  loading: {
    fetch: boolean;
    publish: boolean;
  };
  error: {
    fetch: string | null;
    publish: string | null;
  };
}

const initialState: AppDraftState = {
  draft: null,
  loading: {
    fetch: false,
    publish: false,
  },
  error: {
    fetch: null,
    publish: null,
  },
};

export const fetchDraft = createAsyncThunk(
  'appDraft/fetchDraft',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_DRAFT.replace(':applicationId', applicationId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch draft');
    }
  }
);

export const publishDraft = createAsyncThunk(
  'appDraft/publishDraft',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_DRAFT_PUBLISH.replace(':applicationId', applicationId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish draft');
    }
  }
);

const appDraftSlice = createSlice({
  name: 'appDraft',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        fetch: null,
        publish: null,
      };
    },
    resetState: () => initialState,
    clearDraft: (state) => {
      state.draft = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Draft
      .addCase(fetchDraft.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchDraft.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.draft = action.payload;
      })
      .addCase(fetchDraft.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload as string;
      })

      // Publish Draft
      .addCase(publishDraft.pending, (state) => {
        state.loading.publish = true;
        state.error.publish = null;
      })
      .addCase(publishDraft.fulfilled, (state, action) => {
        state.loading.publish = false;
        // state.draft = action.payload;
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.loading.publish = false;
        state.error.publish = action.payload as string;
      });
  },
});

export const { clearErrors, resetState, clearDraft } = appDraftSlice.actions;

// Selectors
export const selectAppDraftState = (state: RootState) => state.appDraft;
export const selectDraft = (state: RootState) => state.appDraft.draft;
export const selectAppDraftLoading = (state: RootState) => state.appDraft.loading;
export const selectAppDraftError = (state: RootState) => state.appDraft.error;

export default appDraftSlice.reducer;
