import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ApiEndpoints } from '@/enums/api.enum';
import { RootState } from '../store';
import { replaceUrlParams } from '../../utils/api.utils';

export interface PluginFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  status: 'active' | 'inactive' | 'pending';
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  features: PluginFeature[];
  configSchema?: Record<string, any>;
  config?: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  applicationModuleId?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PluginsState {
  plugins: Record<string, Plugin>;
  applicationPlugins: Record<string, Record<string, Plugin>>;
  pluginFeatures: Record<string, Record<string, PluginFeature[]>>;
  pluginDetails: Record<string, Record<string, any>>;
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  publishing: boolean;
  verifying: boolean;
  deleting: boolean;
}

const initialState: PluginsState = {
  plugins: {},
  applicationPlugins: {},
  pluginFeatures: {},
  pluginDetails: {},
  loading: false,
  error: null,
  creating: false,
  updating: false,
  publishing: false,
  verifying: false,
  deleting: false,
};

// Global Plugin Actions
export const fetchPlugins = createAsyncThunk(
  'plugins/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ApiEndpoints.PLUGINS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plugins');
    }
  }
);

export const createPlugin = createAsyncThunk(
  'plugins/create',
  async (pluginData: Partial<Plugin>, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.PLUGIN_CREATE, pluginData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create plugin');
    }
  }
);

export const removePlugin = createAsyncThunk(
  'plugins/remove',
  async (pluginId: string, { rejectWithValue }) => {
    try {
      await api.delete(
        replaceUrlParams(ApiEndpoints.PLUGIN_REMOVE, { id: pluginId })
      );
      return pluginId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove plugin');
    }
  }
);

// Application Plugin Actions
export const fetchApplicationPlugins = createAsyncThunk(
  'plugins/fetchApplicationPlugins',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.APP_PLUGINS, { applicationId })
      );
      return { applicationId, plugins: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch application plugins');
    }
  }
);

export const createApplicationPlugin = createAsyncThunk(
  'plugins/createApplicationPlugin',
  async ({
    applicationId,
    pluginData,
  }: {
    applicationId: string;
    pluginData: Partial<Plugin>;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_CREATE, { applicationId }),
        pluginData
      );
      return { applicationId, plugin: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create application plugin');
    }
  }
);

export const updatePluginConfig = createAsyncThunk(
  'plugins/updateConfig',
  async ({
    applicationId,
    pluginId,
    config,
  }: {
    applicationId: string;
    pluginId: string;
    config: Record<string, any>;
  }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_UPDATE_CONFIG, { 
          applicationId, 
          id: pluginId 
        }),
        { config }
      );
      return { applicationId, pluginId, config: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update plugin configuration');
    }
  }
);

export const verifyPluginConfig = createAsyncThunk(
  'plugins/verifyConfig',
  async ({
    applicationId,
    pluginId,
    config,
  }: {
    applicationId: string;
    pluginId: string;
    config: Record<string, any>;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_VERIFY_CONFIG, {
          applicationId,
          id: pluginId,
        }),
        { config }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify plugin configuration');
    }
  }
);

export const publishPlugin = createAsyncThunk(
  'plugins/publish',
  async ({
    applicationId,
    pluginId,
  }: {
    applicationId: string;
    pluginId: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_PUBLISH, {
          applicationId,
          id: pluginId,
        })
      );
      return { applicationId, pluginId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish plugin');
    }
  }
);

export const updatePluginFeature = createAsyncThunk(
  'plugins/updateFeature',
  async ({
    applicationId,
    applicationModuleId,
    featureId,
    updateData,
  }: {
    applicationId: string;
    applicationModuleId: string;
    featureId: string;
    updateData: Partial<PluginFeature>;
  }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_FEATURE_UPDATE, {
          applicationId,
          applicationModuleId,
          id: featureId,
        }),
        updateData
      );
      return { applicationId, applicationModuleId, featureId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update plugin feature');
    }
  }
);

// Additional Plugin Actions
export const getPluginFeaturesByApp = createAsyncThunk(
  'plugins/getFeaturesByApp',
  async ({
    pluginId,
    applicationId,
  }: {
    pluginId: string;
    applicationId: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.PLUGIN_FEATURES_BY_APP, {
          id: pluginId,
          applicationId,
        })
      );
      return { pluginId, applicationId, features: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plugin features');
    }
  }
);

export const getPluginById = createAsyncThunk(
  'plugins/getPluginById',
  async ({
    applicationId,
    pluginId,
  }: {
    applicationId: string;
    pluginId: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_BY_ID, {
          applicationId,
          id: pluginId,
        })
      );
      return { applicationId, plugin: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plugin details');
    }
  }
);

export const getPluginFeatures = createAsyncThunk(
  'plugins/getFeatures',
  async ({
    applicationId,
    pluginId,
  }: {
    applicationId: string;
    pluginId: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_FEATURES, {
          applicationId,
          id: pluginId,
        })
      );
      return { applicationId, pluginId, features: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plugin features');
    }
  }
);

export const getPluginDetail = createAsyncThunk(
  'plugins/getDetail',
  async ({
    applicationId,
    applicationModuleId,
    pluginId,
  }: {
    applicationId: string;
    applicationModuleId: string;
    pluginId: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_DETAIL, {
          applicationId,
          applicationModuleId,
          id: pluginId,
        })
      );
      return { applicationId, applicationModuleId, pluginId, detail: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plugin details');
    }
  }
);

export const publishPluginFeature = createAsyncThunk(
  'plugins/publishFeature',
  async ({
    applicationId,
    applicationModuleId,
    featureId,
  }: {
    applicationId: string;
    applicationModuleId: string;
    featureId: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_FEATURE_PUBLISH, {
          applicationId,
          applicationModuleId,
          id: featureId,
        })
      );
      return { applicationId, applicationModuleId, featureId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish plugin feature');
    }
  }
);

export const deletePlugin = createAsyncThunk(
  'plugins/delete',
  async ({
    applicationId,
    pluginId,
  }: {
    applicationId: string;
    pluginId: string;
  }, { rejectWithValue }) => {
    try {
      await api.delete(
        replaceUrlParams(ApiEndpoints.APP_PLUGIN_DELETE, {
          applicationId,
          id: pluginId,
        })
      );
      return { applicationId, pluginId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete plugin');
    }
  }
);

const pluginsSlice = createSlice({
  name: 'plugins',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Global Plugins
      .addCase(fetchPlugins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlugins.fulfilled, (state, action) => {
        state.loading = false;
        state.plugins = action.payload.reduce((acc: Record<string, Plugin>, plugin: Plugin) => {
          acc[plugin.id] = plugin;
          return acc;
        }, {});
      })
      .addCase(fetchPlugins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plugins';
      })
      // Create Global Plugin
      .addCase(createPlugin.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createPlugin.fulfilled, (state, action) => {
        state.creating = false;
        state.plugins[action.payload.id] = action.payload;
      })
      .addCase(createPlugin.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create plugin';
      })
      // Remove Global Plugin
      .addCase(removePlugin.fulfilled, (state, action) => {
        delete state.plugins[action.payload];
      })
      // Fetch Application Plugins
      .addCase(fetchApplicationPlugins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationPlugins.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationPlugins[action.payload.applicationId] = action.payload.plugins.reduce(
          (acc: Record<string, Plugin>, plugin: Plugin) => {
            acc[plugin.id] = plugin;
            return acc;
          },
          {}
        );
      })
      .addCase(fetchApplicationPlugins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch application plugins';
      })
      // Create Application Plugin
      .addCase(createApplicationPlugin.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createApplicationPlugin.fulfilled, (state, action) => {
        state.creating = false;
        if (!state.applicationPlugins[action.payload.applicationId]) {
          state.applicationPlugins[action.payload.applicationId] = {};
        }
        state.applicationPlugins[action.payload.applicationId][action.payload.plugin.id] = 
          action.payload.plugin;
      })
      .addCase(createApplicationPlugin.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create application plugin';
      })
      // Update Plugin Config
      .addCase(updatePluginConfig.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updatePluginConfig.fulfilled, (state, action) => {
        state.updating = false;
        if (state.applicationPlugins[action.payload.applicationId]?.[action.payload.pluginId]) {
          state.applicationPlugins[action.payload.applicationId][action.payload.pluginId].config = 
            action.payload.config;
        }
      })
      .addCase(updatePluginConfig.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to update plugin configuration';
      })
      // Verify Plugin Config
      .addCase(verifyPluginConfig.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyPluginConfig.fulfilled, (state) => {
        state.verifying = false;
      })
      .addCase(verifyPluginConfig.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.error.message || 'Failed to verify plugin configuration';
      })
      // Publish Plugin
      .addCase(publishPlugin.pending, (state) => {
        state.publishing = true;
        state.error = null;
      })
      .addCase(publishPlugin.fulfilled, (state, action) => {
        state.publishing = false;
        if (state.applicationPlugins[action.payload.applicationId]?.[action.payload.pluginId]) {
          state.applicationPlugins[action.payload.applicationId][action.payload.pluginId] = {
            ...state.applicationPlugins[action.payload.applicationId][action.payload.pluginId],
            ...action.payload.data,
            published: true,
          };
        }
      })
      .addCase(publishPlugin.rejected, (state, action) => {
        state.publishing = false;
        state.error = action.error.message || 'Failed to publish plugin';
      })
      // Update Plugin Feature
      .addCase(updatePluginFeature.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updatePluginFeature.fulfilled, (state, action) => {
        state.updating = false;
        const plugin = state.applicationPlugins[action.payload.applicationId]?.[action.payload.applicationModuleId];
        if (plugin) {
          const featureIndex = plugin.features.findIndex(f => f.id === action.payload.featureId);
          if (featureIndex !== -1) {
            plugin.features[featureIndex] = {
              ...plugin.features[featureIndex],
              ...action.payload.data,
            };
          }
        }
      })
      .addCase(updatePluginFeature.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to update plugin feature';
      })
      // Get Plugin Features By App
      .addCase(getPluginFeaturesByApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPluginFeaturesByApp.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.pluginFeatures[action.payload.pluginId]) {
          state.pluginFeatures[action.payload.pluginId] = {};
        }
        state.pluginFeatures[action.payload.pluginId][action.payload.applicationId] = 
          action.payload.features;
      })
      .addCase(getPluginFeaturesByApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plugin features';
      })
      // Get Plugin By ID
      .addCase(getPluginById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPluginById.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.applicationPlugins[action.payload.applicationId]) {
          state.applicationPlugins[action.payload.applicationId] = {};
        }
        state.applicationPlugins[action.payload.applicationId][action.payload.plugin.id] = 
          action.payload.plugin;
      })
      .addCase(getPluginById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plugin details';
      })
      // Get Plugin Features
      .addCase(getPluginFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPluginFeatures.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.pluginFeatures[action.payload.pluginId]) {
          state.pluginFeatures[action.payload.pluginId] = {};
        }
        state.pluginFeatures[action.payload.pluginId][action.payload.applicationId] = 
          action.payload.features;
      })
      .addCase(getPluginFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plugin features';
      })
      // Get Plugin Detail
      .addCase(getPluginDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPluginDetail.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.pluginDetails[action.payload.applicationId]) {
          state.pluginDetails[action.payload.applicationId] = {};
        }
        const key = `${action.payload.applicationModuleId}_${action.payload.pluginId}`;
        state.pluginDetails[action.payload.applicationId][key] = action.payload.detail;
      })
      .addCase(getPluginDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plugin details';
      })
      // Publish Plugin Feature
      .addCase(publishPluginFeature.pending, (state) => {
        state.publishing = true;
        state.error = null;
      })
      .addCase(publishPluginFeature.fulfilled, (state, action) => {
        state.publishing = false;
        const plugin = state.applicationPlugins[action.payload.applicationId]?.[action.payload.applicationModuleId];
        if (plugin) {
          const featureIndex = plugin.features.findIndex(f => f.id === action.payload.featureId);
          if (featureIndex !== -1) {
            plugin.features[featureIndex] = {
              ...plugin.features[featureIndex],
              ...action.payload.data,
            };
          }
        }
      })
      .addCase(publishPluginFeature.rejected, (state, action) => {
        state.publishing = false;
        state.error = action.error.message || 'Failed to publish plugin feature';
      })
      // Delete Plugin
      .addCase(deletePlugin.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deletePlugin.fulfilled, (state, action) => {
        state.deleting = false;
        if (state.applicationPlugins[action.payload.applicationId]) {
          delete state.applicationPlugins[action.payload.applicationId][action.payload.pluginId];
        }
      })
      .addCase(deletePlugin.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message || 'Failed to delete plugin';
      });
  },
});

export const { clearError, resetState } = pluginsSlice.actions;

// Selectors
export const selectPlugins = (state: RootState) => Object.values(state.plugins.plugins);
export const selectPluginById = (pluginId: string) => (state: RootState) => 
  state.plugins.plugins[pluginId];

export const selectApplicationPlugins = (applicationId: string) => (state: RootState) =>
  Object.values(state.plugins.applicationPlugins[applicationId] || {});
export const selectApplicationPluginById = (applicationId: string, pluginId: string) => 
  (state: RootState) => state.plugins.applicationPlugins[applicationId]?.[pluginId];

export const selectPluginsLoading = (state: RootState) => state.plugins.loading;
export const selectPluginsError = (state: RootState) => state.plugins.error;
export const selectPluginsCreating = (state: RootState) => state.plugins.creating;
export const selectPluginsUpdating = (state: RootState) => state.plugins.updating;
export const selectPluginsPublishing = (state: RootState) => state.plugins.publishing;
export const selectPluginsVerifying = (state: RootState) => state.plugins.verifying;
export const selectPluginsDeleting = (state: RootState) => state.plugins.deleting;

export const selectPluginFeaturesByApp = (pluginId: string, applicationId: string) => 
  (state: RootState) => state.plugins.pluginFeatures[pluginId]?.[applicationId] || [];

export const selectPluginDetail = (
  applicationId: string,
  applicationModuleId: string,
  pluginId: string
) => (state: RootState) => {
  const key = `${applicationModuleId}_${pluginId}`;
  return state.plugins.pluginDetails[applicationId]?.[key];
};

export default pluginsSlice.reducer;