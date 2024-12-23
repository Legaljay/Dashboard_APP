import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

export interface AppMemoryFile {
  id: string;
  name: string;
  content: string;
  status: 'draft' | 'published' | 'training';
  fileType: string;
  file_url: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

interface TrainingStatus {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}

interface AppMemoryState {
  memoryFiles: AppMemoryFile[];
  selectedMemoryFile: AppMemoryFile | null;
  applicationId: string;
  trainingStatus: TrainingStatus | null;
  loading: {
    fetchMemoryFiles: boolean;
    fetchMemoryFile: boolean;
    createMemoryFile: boolean;
    deleteMemoryFile: boolean;
    publishMemoryFile: boolean;
    trainMemory: boolean;
  };
  error: {
    fetchMemoryFiles: string | null;
    fetchMemoryFile: string | null;
    createMemoryFile: string | null;
    deleteMemoryFile: string | null;
    publishMemoryFile: string | null;
    trainMemory: string | null;
  };
}

const initialState: AppMemoryState = {
  memoryFiles: [],
  selectedMemoryFile: null,
  applicationId: "",
  trainingStatus: null,
  loading: {
    fetchMemoryFiles: false,
    fetchMemoryFile: false,
    createMemoryFile: false,
    deleteMemoryFile: false,
    publishMemoryFile: false,
    trainMemory: false,
  },
  error: {
    fetchMemoryFiles: null,
    fetchMemoryFile: null,
    createMemoryFile: null,
    deleteMemoryFile: null,
    publishMemoryFile: null,
    trainMemory: null,
  },
};

export const fetchMemoryFiles = createAsyncThunk(
  'appMemory/fetchMemoryFiles',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_MEMORY.replace(':applicationId', applicationId)
      );
      return {applicationId, data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch memory files');
    }
  }
);

export const fetchMemoryFileById = createAsyncThunk(
  'appMemory/fetchMemoryFileById',
  async (
    { applicationId, fileId }: { applicationId: string; fileId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_MEMORY_BY_ID
          .replace(':applicationId', applicationId)
          .replace(':applicationAssistantFileId', fileId)
      );
      return {applicationId, data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch memory file');
    }
  }
);

export const createMemoryFile = createAsyncThunk(
  'appMemory/createMemoryFile',
  async (
    { 
      applicationId, 
      fileData 
    }: { 
      applicationId: string; 
      fileData: FormData; // Using FormData for file upload
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_MEMORY_CREATE.replace(':applicationId', applicationId),
        fileData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return {applicationId, data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create memory file');
    }
  }
);

export const deleteMemoryFile = createAsyncThunk(
  'appMemory/deleteMemoryFile',
  async (
    { applicationId, fileId }: { applicationId: string; fileId: string },
    { rejectWithValue }
  ) => {
    try {
      await api.delete(
        ApiEndpoints.APP_MEMORY_DELETE
          .replace(':applicationId', applicationId)
          .replace(':applicationAssistantFileId', fileId)
      );
      return { applicationId, fileId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete memory file');
    }
  }
);

export const publishMemoryFile = createAsyncThunk(
  'appMemory/publishMemoryFile',
  async (
    { applicationId, fileId }: { applicationId: string; fileId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_MEMORY_PUBLISH
          .replace(':applicationId', applicationId)
          .replace(':applicationAssistantFileId', fileId)
      );
      return {applicationId, data: response.data.data};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish memory file');
    }
  }
);

export const trainMemory = createAsyncThunk(
  'appMemory/trainMemory',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_MEMORY_TRAIN.replace(':applicationId', applicationId)
      );
      return {applicationId,data: response.data.data};
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to train memory');
    }
  }
);

const appMemorySlice = createSlice({
  name: 'appMemory',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        fetchMemoryFiles: null,
        fetchMemoryFile: null,
        createMemoryFile: null,
        deleteMemoryFile: null,
        publishMemoryFile: null,
        trainMemory: null,
      };
    },
    resetState: () => initialState,
    clearSelectedMemoryFile: (state) => {
      state.selectedMemoryFile = null;
    },
    updateTrainingStatus: (state, action) => {
      state.trainingStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Memory Files
      .addCase(fetchMemoryFiles.pending, (state) => {
        state.loading.fetchMemoryFiles = true;
        state.error.fetchMemoryFiles = null;
      })
      .addCase(fetchMemoryFiles.fulfilled, (state, action) => {
        state.loading.fetchMemoryFiles = false;
        state.memoryFiles = action.payload.data;
        state.applicationId = action.payload.applicationId;
      })
      .addCase(fetchMemoryFiles.rejected, (state, action) => {
        state.loading.fetchMemoryFiles = false;
        state.error.fetchMemoryFiles = action.payload as string;
      })

      // Fetch Memory File By Id
      .addCase(fetchMemoryFileById.pending, (state) => {
        state.loading.fetchMemoryFile = true;
        state.error.fetchMemoryFile = null;
      })
      .addCase(fetchMemoryFileById.fulfilled, (state, action) => {
        state.loading.fetchMemoryFile = false;
        state.selectedMemoryFile = action.payload.data;
        state.applicationId = action.payload.applicationId;
      })
      .addCase(fetchMemoryFileById.rejected, (state, action) => {
        state.loading.fetchMemoryFile = false;
        state.error.fetchMemoryFile = action.payload as string;
      })

      // Create Memory File
      .addCase(createMemoryFile.pending, (state) => {
        state.loading.createMemoryFile = true;
        state.error.createMemoryFile = null;
      })
      .addCase(createMemoryFile.fulfilled, (state, action) => {
        state.loading.createMemoryFile = false;
        state.memoryFiles.unshift(action.payload.data);
        state.applicationId = action.payload.applicationId;
      })
      .addCase(createMemoryFile.rejected, (state, action) => {
        state.loading.createMemoryFile = false;
        state.error.createMemoryFile = action.payload as string;
      })

      // Delete Memory File
      .addCase(deleteMemoryFile.pending, (state) => {
        state.loading.deleteMemoryFile = true;
        state.error.deleteMemoryFile = null;
      })
      .addCase(deleteMemoryFile.fulfilled, (state, action) => {
        state.loading.deleteMemoryFile = false;
        state.applicationId = action.payload.applicationId;
        state.memoryFiles = state.memoryFiles.filter(f => f.id !== action.payload.fileId);
        if (state.selectedMemoryFile?.id === action.payload.fileId) {
          state.selectedMemoryFile = null;
        }
      })
      .addCase(deleteMemoryFile.rejected, (state, action) => {
        state.loading.deleteMemoryFile = false;
        state.error.deleteMemoryFile = action.payload as string;
      })

      // Publish Memory File
      .addCase(publishMemoryFile.pending, (state) => {
        state.loading.publishMemoryFile = true;
        state.error.publishMemoryFile = null;
      })
      .addCase(publishMemoryFile.fulfilled, (state, action) => {
        state.loading.publishMemoryFile = false;
        state.applicationId = action.payload.applicationId;
        state.selectedMemoryFile = action.payload.data;
        const index = state.memoryFiles.findIndex(f => f.id === action.payload.data.id);
        if (index !== -1) {
          state.memoryFiles[index] = action.payload.data;
        }
      })
      .addCase(publishMemoryFile.rejected, (state, action) => {
        state.loading.publishMemoryFile = false;
        state.error.publishMemoryFile = action.payload as string;
      })

      // Train Memory
      .addCase(trainMemory.pending, (state) => {
        state.loading.trainMemory = true;
        state.error.trainMemory = null;
        state.trainingStatus = { status: 'pending' };
      })
      .addCase(trainMemory.fulfilled, (state, action) => {
        state.loading.trainMemory = false;
        state.applicationId = action.payload.applicationId;
        state.trainingStatus = { 
          status: 'completed',
          progress: 100
        };
      })
      .addCase(trainMemory.rejected, (state, action) => {
        state.loading.trainMemory = false;
        state.error.trainMemory = action.payload as string;
        state.trainingStatus = { 
          status: 'failed',
          error: action.payload as string
        };
      });
  },
});

export const { 
  clearErrors, 
  resetState, 
  clearSelectedMemoryFile,
  updateTrainingStatus 
} = appMemorySlice.actions;

// Selectors
export const selectAppMemoryState = (state: RootState) => state.memory;
export const selectMemoryFiles = (state: RootState) => state.memory.memoryFiles;
export const selectSelectedMemoryFile = (state: RootState) => state.memory.selectedMemoryFile;
export const selectTrainingStatus = (state: RootState) => state.memory.trainingStatus;
export const selectAppMemoryLoading = (state: RootState) => state.memory.loading;
export const selectAppMemoryError = (state: RootState) => state.memory.error;

export default appMemorySlice.reducer;
