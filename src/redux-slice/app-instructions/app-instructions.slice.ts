import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

export interface Instruction {
  id: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface AppInstructionsState {
  instructions: Instruction[];
  archivedInstructions: Instruction[];
  selectedInstruction: Instruction | null;
  loading: {
    fetchInstructions: boolean;
    fetchArchivedInstructions: boolean;
    fetchInstruction: boolean;
    createInstruction: boolean;
    updateInstruction: boolean;
    deleteInstruction: boolean;
    publishInstruction: boolean;
  };
  error: {
    fetchInstructions: string | null;
    fetchArchivedInstructions: string | null;
    fetchInstruction: string | null;
    createInstruction: string | null;
    updateInstruction: string | null;
    deleteInstruction: string | null;
    publishInstruction: string | null;
  };
}

const initialState: AppInstructionsState = {
  instructions: [],
  archivedInstructions: [],
  selectedInstruction: null,
  loading: {
    fetchInstructions: false,
    fetchArchivedInstructions: false,
    fetchInstruction: false,
    createInstruction: false,
    updateInstruction: false,
    deleteInstruction: false,
    publishInstruction: false,
  },
  error: {
    fetchInstructions: null,
    fetchArchivedInstructions: null,
    fetchInstruction: null,
    createInstruction: null,
    updateInstruction: null,
    deleteInstruction: null,
    publishInstruction: null,
  },
};

export const fetchAppInstructions = createAsyncThunk(
  'appInstructions/fetchInstructions',
  async ({ applicationId, categoryId }: { applicationId: string; categoryId: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_CATEGORY_INSTRUCTIONS
          .replace(':applicationId', applicationId)
          .replace(':categoryId', categoryId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch instructions');
    }
  }
);

export const fetchArchivedInstructions = createAsyncThunk(
  'appInstructions/fetchArchivedInstructions',
  async ({ applicationId, categoryId }: { applicationId: string; categoryId: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_CATEGORY_ARCHIVED_INSTRUCTIONS
          .replace(':applicationId', applicationId)
          .replace(':categoryId', categoryId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch archived instructions');
    }
  }
);

export const fetchAppInstructionById = createAsyncThunk(
  'appInstructions/fetchInstructionById',
  async (
    { applicationId, categoryId, instructionId }: 
    { applicationId: string; categoryId: string; instructionId: string }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_CATEGORY_INSTRUCTION_BY_ID
          .replace(':applicationId', applicationId)
          .replace(':categoryId', categoryId)
          .replace(':id', instructionId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch instruction');
    }
  }
);

export const createAppInstruction = createAsyncThunk(
  'appInstructions/createInstruction',
  async (
    { 
      applicationId, 
      categoryId, 
      instructionData 
    }: { 
      applicationId: string; 
      categoryId: string; 
      instructionData: Partial<Instruction>; 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_CATEGORY_INSTRUCTIONS_CREATE
          .replace(':applicationId', applicationId)
          .replace(':categoryId', categoryId),
        instructionData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create instruction');
    }
  }
);

export const updateAppInstruction = createAsyncThunk(
  'appInstructions/updateInstruction',
  async (
    { 
      applicationId, 
      categoryId, 
      instructionId, 
      updateData 
    }: { 
      applicationId: string; 
      categoryId: string; 
      instructionId: string; 
      updateData: Partial<Instruction>; 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        ApiEndpoints.APP_CATEGORY_INSTRUCTION_UPDATE
          .replace(':applicationId', applicationId)
          .replace(':categoryId', categoryId)
          .replace(':id', instructionId),
        updateData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update instruction');
    }
  }
);

export const deleteAppInstruction = createAsyncThunk(
  'appInstructions/deleteInstruction',
  async (
    { applicationId, categoryId, instructionId }: 
    { applicationId: string; categoryId: string; instructionId: string }, 
    { rejectWithValue }
  ) => {
    try {
      await api.delete(
        ApiEndpoints.APP_CATEGORY_INSTRUCTION_DELETE
          .replace(':applicationId', applicationId)
          .replace(':categoryId', categoryId)
          .replace(':id', instructionId)
      );
      return instructionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete instruction');
    }
  }
);

export const publishAppInstruction = createAsyncThunk(
  'appInstructions/publishInstruction',
  async (
    { applicationId, categoryId, instructionId }: 
    { applicationId: string; categoryId: string; instructionId: string }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_CATEGORY_INSTRUCTION_PUBLISH
          .replace(':applicationId', applicationId)
          .replace(':categoryId', categoryId)
          .replace(':id', instructionId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish instruction');
    }
  }
);

const appInstructionsSlice = createSlice({
  name: 'appInstructions',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        fetchInstructions: null,
        fetchArchivedInstructions: null,
        fetchInstruction: null,
        createInstruction: null,
        updateInstruction: null,
        deleteInstruction: null,
        publishInstruction: null,
      };
    },
    resetState: () => initialState,
    clearSelectedInstruction: (state) => {
      state.selectedInstruction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Instructions
      .addCase(fetchAppInstructions.pending, (state) => {
        state.loading.fetchInstructions = true;
        state.error.fetchInstructions = null;
      })
      .addCase(fetchAppInstructions.fulfilled, (state, action) => {
        state.loading.fetchInstructions = false;
        state.instructions = action.payload;
      })
      .addCase(fetchAppInstructions.rejected, (state, action) => {
        state.loading.fetchInstructions = false;
        state.error.fetchInstructions = action.payload as string;
      })

      // Fetch Archived Instructions
      .addCase(fetchArchivedInstructions.pending, (state) => {
        state.loading.fetchArchivedInstructions = true;
        state.error.fetchArchivedInstructions = null;
      })
      .addCase(fetchArchivedInstructions.fulfilled, (state, action) => {
        state.loading.fetchArchivedInstructions = false;
        state.archivedInstructions = action.payload;
      })
      .addCase(fetchArchivedInstructions.rejected, (state, action) => {
        state.loading.fetchArchivedInstructions = false;
        state.error.fetchArchivedInstructions = action.payload as string;
      })

      // Fetch Instruction By Id
      .addCase(fetchAppInstructionById.pending, (state) => {
        state.loading.fetchInstruction = true;
        state.error.fetchInstruction = null;
      })
      .addCase(fetchAppInstructionById.fulfilled, (state, action) => {
        state.loading.fetchInstruction = false;
        state.selectedInstruction = action.payload;
      })
      .addCase(fetchAppInstructionById.rejected, (state, action) => {
        state.loading.fetchInstruction = false;
        state.error.fetchInstruction = action.payload as string;
      })

      // Create Instruction
      .addCase(createAppInstruction.pending, (state) => {
        state.loading.createInstruction = true;
        state.error.createInstruction = null;
      })
      .addCase(createAppInstruction.fulfilled, (state, action) => {
        state.loading.createInstruction = false;
        state.instructions.unshift(action.payload);
      })
      .addCase(createAppInstruction.rejected, (state, action) => {
        state.loading.createInstruction = false;
        state.error.createInstruction = action.payload as string;
      })

      // Update Instruction
      .addCase(updateAppInstruction.pending, (state) => {
        state.loading.updateInstruction = true;
        state.error.updateInstruction = null;
      })
      .addCase(updateAppInstruction.fulfilled, (state, action) => {
        state.loading.updateInstruction = false;
        state.selectedInstruction = action.payload;
        const index = state.instructions.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.instructions[index] = action.payload;
        }
      })
      .addCase(updateAppInstruction.rejected, (state, action) => {
        state.loading.updateInstruction = false;
        state.error.updateInstruction = action.payload as string;
      })

      // Delete Instruction
      .addCase(deleteAppInstruction.pending, (state) => {
        state.loading.deleteInstruction = true;
        state.error.deleteInstruction = null;
      })
      .addCase(deleteAppInstruction.fulfilled, (state, action) => {
        state.loading.deleteInstruction = false;
        state.instructions = state.instructions.filter(i => i.id !== action.payload);
        if (state.selectedInstruction?.id === action.payload) {
          state.selectedInstruction = null;
        }
      })
      .addCase(deleteAppInstruction.rejected, (state, action) => {
        state.loading.deleteInstruction = false;
        state.error.deleteInstruction = action.payload as string;
      })

      // Publish Instruction
      .addCase(publishAppInstruction.pending, (state) => {
        state.loading.publishInstruction = true;
        state.error.publishInstruction = null;
      })
      .addCase(publishAppInstruction.fulfilled, (state, action) => {
        state.loading.publishInstruction = false;
        state.selectedInstruction = action.payload;
        const index = state.instructions.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.instructions[index] = action.payload;
        }
      })
      .addCase(publishAppInstruction.rejected, (state, action) => {
        state.loading.publishInstruction = false;
        state.error.publishInstruction = action.payload as string;
      });
  },
});

export const { clearErrors, resetState, clearSelectedInstruction } = appInstructionsSlice.actions;

// Selectors
export const selectAppInstructionsState = (state: RootState) => state.appInstructions;
export const selectInstructions = (state: RootState) => state.appInstructions.instructions;
export const selectArchivedInstructions = (state: RootState) => state.appInstructions.archivedInstructions;
export const selectSelectedInstruction = (state: RootState) => state.appInstructions.selectedInstruction;
export const selectAppInstructionsLoading = (state: RootState) => state.appInstructions.loading;
export const selectAppInstructionsError = (state: RootState) => state.appInstructions.error;

export default appInstructionsSlice.reducer;
