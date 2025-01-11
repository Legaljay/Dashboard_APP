import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { replaceUrlParams } from '@/utils/api.utils';
import {
  MemoryTemplate,
  MemoryTemplateState,
  MemoryTemplateCreateDTO,
  MemoryTemplateUpdateDTO,
  MemoryTemplateResponse,
  MemoryTEmplate,
} from './memory-template.types';
import { RootState } from '../store';

const initialState: MemoryTemplateState = {
  templates: {},
  loading: false,
  error: null,
};

// Fetch all memory templates for an application
export const fetchMemoryTemplates = createAsyncThunk(
  'memoryTemplate/fetchAll',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<MemoryTemplateResponse<MemoryTEmplate[]>>(
        replaceUrlParams(ApiEndpoints.APP_MEMORY_TEMPLATE, { applicationId })
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch memory templates');
    }
  }
);

// Create a new memory template
export const createMemoryTemplate = createAsyncThunk(
  'memoryTemplate/create',
  async ({ applicationId, template }: { applicationId: string; template: MemoryTemplateCreateDTO }, { rejectWithValue }) => {
    try {
      const response = await api.post<MemoryTemplateResponse<MemoryTEmplate>>(
        replaceUrlParams(ApiEndpoints.APP_MEMORY_TEMPLATE_CREATE, { applicationId }),
        template
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create memory template');
    }
  }
);

// Fetch a single memory template
export const fetchMemoryTemplateById = createAsyncThunk(
  'memoryTemplate/fetchById',
  async ({ applicationId, templateId }: { applicationId: string; templateId: string }, { rejectWithValue }) => {
    try {
      const response = await api.get<MemoryTemplateResponse<MemoryTEmplate>>(
        replaceUrlParams(ApiEndpoints.APP_MEMORY_TEMPLATE_BY_ID, { applicationId, id: templateId })
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch memory template');
    }
  }
);

// Update a memory template
export const updateMemoryTemplate = createAsyncThunk(
  'memoryTemplate/update',
  async (
    {
      applicationId,
      templateId,
      template,
    }: { applicationId: string; templateId: string; template: MemoryTemplateUpdateDTO },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<MemoryTemplateResponse<MemoryTEmplate>>(
        replaceUrlParams(ApiEndpoints.APP_MEMORY_TEMPLATE_BY_ID, { applicationId, id: templateId }),
        template
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update memory template');
    }
  }
);

// Delete a memory template
export const deleteMemoryTemplate = createAsyncThunk(
  'memoryTemplate/delete',
  async ({ applicationId, templateId }: { applicationId: string; templateId: string }, { rejectWithValue }) => {
    try {
      await api.delete(
        replaceUrlParams(ApiEndpoints.APP_MEMORY_TEMPLATE_DELETE, { applicationId, id: templateId })
      );
      return templateId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete memory template');
    }
  }
);

const memoryTemplateSlice = createSlice({
  name: 'memoryTemplate',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch all templates
      .addCase(fetchMemoryTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemoryTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.reduce((acc, template) => {
          acc[template.category] = template;
          return acc;
        }, {} as Record<string, MemoryTEmplate>);
      })
      .addCase(fetchMemoryTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch memory templates';
      })

      // Create template
      .addCase(createMemoryTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMemoryTemplate.fulfilled, (state, action) => {
        state.loading = false;

        // state.templates[action.payload.category] = action.payload;
      })
      .addCase(createMemoryTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create memory template';
      })

      // Fetch single template
      .addCase(fetchMemoryTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemoryTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.templates[action.payload.category] = action.payload;
      })
      .addCase(fetchMemoryTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch memory template';
      })

      // Update template
      .addCase(updateMemoryTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMemoryTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates[action.payload.category] = action.payload;
      })
      .addCase(updateMemoryTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update memory template';
      })

      // Delete template
      .addCase(deleteMemoryTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMemoryTemplate.fulfilled, (state, action) => {
        state.loading = false;
        delete state.templates[action.payload];
      })
      .addCase(deleteMemoryTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete memory template';
      });
  },
});

// Selectors
export const selectAllMemoryTemplates = (state: RootState) => Object.values(state.memoryTemplate.templates);
export const selectMemoryTemplateById = (id: string) => (state: RootState) => state.memoryTemplate.templates[id];
// export const selectMemoryTemplatesByApplication = (applicationId: string) => (state: RootState) =>
//   Object.values(state.memoryTemplate.templates).filter(template => template.applicationId === applicationId);
export const selectMemoryTemplateLoading = (state: RootState) => state.memoryTemplate.loading;
export const selectMemoryTemplateError = (state: RootState) => state.memoryTemplate.error;

export const { clearError, resetState } = memoryTemplateSlice.actions;
export default memoryTemplateSlice.reducer;
