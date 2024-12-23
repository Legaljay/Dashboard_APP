import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';

interface AppFeature {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published';
  configuration: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface AppFeaturesState {
  features: AppFeature[];
  selectedFeature: AppFeature | null;
  loading: {
    fetchFeatures: boolean;
    fetchFeature: boolean;
    updateFeature: boolean;
    publishFeature: boolean;
  };
  error: {
    fetchFeatures: string | null;
    fetchFeature: string | null;
    updateFeature: string | null;
    publishFeature: string | null;
  };
}

const initialState: AppFeaturesState = {
  features: [],
  selectedFeature: null,
  loading: {
    fetchFeatures: false,
    fetchFeature: false,
    updateFeature: false,
    publishFeature: false,
  },
  error: {
    fetchFeatures: null,
    fetchFeature: null,
    updateFeature: null,
    publishFeature: null,
  },
};

export const fetchFeatures = createAsyncThunk(
  'appFeatures/fetchFeatures',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.APP_FEATURES.replace(':applicationId', applicationId));
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch features');
    }
  }
);

export const fetchFeatureById = createAsyncThunk(
  'appFeatures/fetchFeatureById',
  async ({ applicationId, featureId }: { applicationId: string; featureId: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        ApiEndpoints.APP_FEATURE_BY_ID
          .replace(':applicationId', applicationId)
          .replace(':id', featureId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feature');
    }
  }
);

export const updateFeature = createAsyncThunk(
  'appFeatures/updateFeature',
  async (
    { 
      applicationId, 
      featureId, 
      updateData 
    }: { 
      applicationId: string; 
      featureId: string; 
      updateData: Partial<AppFeature>; 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        ApiEndpoints.APP_FEATURE_UPDATE
          .replace(':applicationId', applicationId)
          .replace(':id', featureId),
        updateData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update feature');
    }
  }
);

export const publishFeature = createAsyncThunk(
  'appFeatures/publishFeature',
  async (
    { applicationId, featureId }: { applicationId: string; featureId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        ApiEndpoints.APP_FEATURE_PUBLISH
          .replace(':applicationId', applicationId)
          .replace(':id', featureId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish feature');
    }
  }
);

const appFeaturesSlice = createSlice({
  name: 'appFeatures',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        fetchFeatures: null,
        fetchFeature: null,
        updateFeature: null,
        publishFeature: null,
      };
    },
    resetState: () => initialState,
    clearSelectedFeature: (state) => {
      state.selectedFeature = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Features
      .addCase(fetchFeatures.pending, (state) => {
        state.loading.fetchFeatures = true;
        state.error.fetchFeatures = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.loading.fetchFeatures = false;
        state.features = action.payload;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading.fetchFeatures = false;
        state.error.fetchFeatures = action.payload as string;
      })

      // Fetch Feature By Id
      .addCase(fetchFeatureById.pending, (state) => {
        state.loading.fetchFeature = true;
        state.error.fetchFeature = null;
      })
      .addCase(fetchFeatureById.fulfilled, (state, action) => {
        state.loading.fetchFeature = false;
        state.selectedFeature = action.payload;
      })
      .addCase(fetchFeatureById.rejected, (state, action) => {
        state.loading.fetchFeature = false;
        state.error.fetchFeature = action.payload as string;
      })

      // Update Feature
      .addCase(updateFeature.pending, (state) => {
        state.loading.updateFeature = true;
        state.error.updateFeature = null;
      })
      .addCase(updateFeature.fulfilled, (state, action) => {
        state.loading.updateFeature = false;
        state.selectedFeature = action.payload;
        const index = state.features.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })
      .addCase(updateFeature.rejected, (state, action) => {
        state.loading.updateFeature = false;
        state.error.updateFeature = action.payload as string;
      })

      // Publish Feature
      .addCase(publishFeature.pending, (state) => {
        state.loading.publishFeature = true;
        state.error.publishFeature = null;
      })
      .addCase(publishFeature.fulfilled, (state, action) => {
        state.loading.publishFeature = false;
        state.selectedFeature = action.payload;
        const index = state.features.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })
      .addCase(publishFeature.rejected, (state, action) => {
        state.loading.publishFeature = false;
        state.error.publishFeature = action.payload as string;
      });
  },
});

export const { clearErrors, resetState, clearSelectedFeature } = appFeaturesSlice.actions;

// Selectors
export const selectAppFeaturesState = (state: RootState) => state.appFeatures;
export const selectFeatures = (state: RootState) => state.appFeatures.features;
export const selectSelectedFeature = (state: RootState) => state.appFeatures.selectedFeature;
export const selectAppFeaturesLoading = (state: RootState) => state.appFeatures.loading;
export const selectAppFeaturesError = (state: RootState) => state.appFeatures.error;

export default appFeaturesSlice.reducer;
