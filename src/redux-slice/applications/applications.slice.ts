import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Application, ApplicationSetupData, IApplicationResponse, IUpdateApplication } from '@/types/applications.types';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { replaceUrlParams } from '@/utils/api.utils';

// Types
interface ApplicationsState {
  applications: Application[];
  selectedApplication: string | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  selectedApplication: null,
  loading: false,
  creating: false,
  updating: false,
  error: null,
};

// Async Thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<IApplicationResponse>(ApiEndpoints.APPLICATIONS);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

// Legacy Applications create
export const createApplication = createAsyncThunk(
  'applications/create',
  async (applicationData: Partial<Application>, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.APPLICATION_CREATE, applicationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create application');
    }
  }
);

// new applications create
export const setupApplication = createAsyncThunk(
  'applications/setup',
  async (setupData: ApplicationSetupData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(setupData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await api.post(ApiEndpoints.APPLICATION_SETUP, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to setup application');
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchById',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.APPLICATION_BY_ID, { id: applicationId })
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch application');
    }
  }
);

export const updateApplicationById = createAsyncThunk(
  'applications/updateById',
  async ({ applicationId, updatedData }: { applicationId: string; updatedData: IUpdateApplication }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      const response = await api.put(
        replaceUrlParams(ApiEndpoints.APPLICATION_BY_ID, { id: applicationId }),
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update application');
    }
  }
);

export const updateApplicationConfig = createAsyncThunk(
  'applications/updateConfig',
  async ({ 
    applicationId, 
    config 
  }: { 
    applicationId: string; 
    config: Record<string, any> 
  }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        replaceUrlParams(ApiEndpoints.APPLICATION_CONFIG, { id: applicationId }),
        { config }
      );
      return { applicationId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update application config');
    }
  }
);

export const resetApplicationType = createAsyncThunk(
  'applications/resetType',
  async ({ 
    applicationId, 
    type 
  }: { 
    applicationId: string; 
    type: string 
  }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APPLICATION_RESET_TYPE, { id: applicationId }),
        { type }
      );
      return { applicationId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset application type');
    }
  }
);

export const deactivateApplication = createAsyncThunk(
  'applications/deactivate',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      await api.put(
        replaceUrlParams(ApiEndpoints.APPLICATION_DEACTIVATE, { id: applicationId })
      );
      return applicationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate application');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setSelectedApplication: (state, action) => {
      state.selectedApplication = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action: PayloadAction<Application[]>) => {
        state.applications = action.payload;
        state.selectedApplication = action.payload[0]?.id || null;
        state.loading = false;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch applications';
      })
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.creating = false;
        state.applications[action.payload.id] = action.payload;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create application';
      })
      // Setup Application
      .addCase(setupApplication.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(setupApplication.fulfilled, (state, action) => {
        state.updating = false;
        state.applications = [...state.applications, action.payload.data];
      })
      .addCase(setupApplication.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to setup application';
      })
      // Fetch Application By ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.applications[action.payload.id] = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch application';
      })
      // Update Application By ID
      .addCase(updateApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        // state.applications[action.payload.id] = action.payload.data;
        state.applications = state.applications.map(app => app.id === action.payload.applicationId ? { ...app, ...action.payload.data } : app);
      })
      .addCase(updateApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update application';
      })
      // Update Application Config
      .addCase(updateApplicationConfig.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateApplicationConfig.fulfilled, (state, action) => {
        state.updating = false;
        state.applications = state.applications.map(app => 
          app.id === action.payload.applicationId
            ? { ...app, config: action.payload.data.config }
            : app
        );
      })
      .addCase(updateApplicationConfig.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to update application config';
      })
      // Reset Application Type
      .addCase(resetApplicationType.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(resetApplicationType.fulfilled, (state, action) => {
        state.updating = false;
        state.applications = state.applications.map(app => 
          app.id === action.payload.applicationId
            ? { ...app, ...action.payload.data }
            : app
        );
      })
      .addCase(resetApplicationType.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to reset application type';
      })
      // Deactivate Application
      .addCase(deactivateApplication.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(deactivateApplication.fulfilled, (state, action) => {
        state.updating = false;
        state.applications = state.applications.map(app => 
          app.id === action.payload
            ? { ...app, status: 'inactive' }
            : app
        );
      })
      .addCase(deactivateApplication.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to deactivate application';
      });
  },
});

// Actions
export const { setSelectedApplication, clearError, resetState } = applicationsSlice.actions;

// Selectors
export const selectApplications = (state: RootState) => state.applications.applications;
export const selectSelectedApplication = (state: RootState) => {
  const { applications, selectedApplication } = state.applications;
  return applications.find(app => app.id === selectedApplication) || applications[0] || null;
};
export const selectApplicationsLoading = (state: RootState) => state.applications.loading;
export const selectApplicationsError = (state: RootState) => state.applications.error;

export default applicationsSlice.reducer;
