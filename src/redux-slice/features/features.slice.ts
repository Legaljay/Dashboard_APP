import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ApiEndpoints } from '@/enums/api.enum';
import { api } from '@/services/api';
import { replaceUrlParams } from '@/utils/api.utils';
import { ApplicationFeature } from '@/types/application.types';


interface ApplicationResponse<T = void> {
  message: string;
  status: string;
  data: T;
}

// State interface
interface FeaturesState {
  features: ApplicationFeature[];
  loading: {
    features: boolean;
  };
  error: {
    features: string | null;
  };
  lastSync: string | null;
}

// Initial state
const initialState: FeaturesState = {
  features: [],
  loading: {
    features: false,
  },
  error: {
    features: null,
  },
  lastSync: null,
};

// Thunks
export const fetchFeatures = createAsyncThunk(
  'features/fetchFeatures',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApplicationResponse<ApplicationFeature[]>>(
        replaceUrlParams(ApiEndpoints.APP_FEATURES, { applicationId })
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch features');
    }
  }
);

export const updateFeature = createAsyncThunk(
  'features/updateFeature',
  async ({ applicationId, featureId, data }: { applicationId: string; featureId: string; data: Partial<ApplicationFeature> }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApplicationResponse<ApplicationFeature>>(
        replaceUrlParams(ApiEndpoints.APP_FEATURE_UPDATE, { applicationId, id: featureId }),
        data
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update feature');
    }
  }
);

export const publishFeature = createAsyncThunk(
  'features/publishFeature',
  async ({ applicationId, featureId }: { applicationId: string; featureId: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApplicationResponse<ApplicationFeature>>(
        replaceUrlParams(ApiEndpoints.APP_FEATURE_PUBLISH, { applicationId, id: featureId })
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish feature');
    }
  }
);

// export const batchUpdateFeatures = createAsyncThunk(
//   'features/batchUpdateFeatures',
//   async ({ appId, updates }: { appId: string; updates: { featureId: string; enabled: boolean }[] }, { rejectWithValue }) => {
//     try {
//       const response = await api.put<ApplicationResponse<ApplicationFeature[]>>(
//         replaceUrlParams(ApiEndpoints.APPLICATION_FEATURES_BATCH, { id: appId }),
//         { updates }
//       );
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to batch update features');
//     }
//   }
// );

// Slice
const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error.features = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.loading.features = true;
        state.error.features = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.features = action.payload;
        state.loading.features = false;
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading.features = false;
        state.error.features = action.error.message || 'Failed to fetch features';
      })
      .addCase(updateFeature.fulfilled, (state, action) => {
        const index = state.features.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.features[index] = action.payload;
        }
        state.lastSync = new Date().toISOString();
      })
      .addCase(publishFeature.fulfilled, (state, action) => {
        const index = state.features.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.features[index] = action.payload;
        }
        state.lastSync = new Date().toISOString();
      })
      // .addCase(batchUpdateFeatures.fulfilled, (state, action) => {
      //   state.features = action.payload;
      //   state.lastSync = new Date().toISOString();
      // });
  },
});

// Actions
export const { clearError } = featuresSlice.actions;

// Selectors
export const selectFeatures = (state: RootState) => state.features.features;
export const selectFeaturesLoading = (state: RootState) => state.features.loading.features;
export const selectFeaturesError = (state: RootState) => state.features.error.features;
export const selectLastSync = (state: RootState) => state.features.lastSync;

// Reducer
export default featuresSlice.reducer;
