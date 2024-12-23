import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { api } from "@/services/api";
import { ApiEndpoints } from "@/enums/api.enum";
import { replaceUrlParams } from "@/utils/api.utils";

// Types
export interface AppCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
  type: string;
  type_slug: string;
  application: null;
  business: null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppCategoryPayload {
  applicationId: string;
  categoryData: {
    name: string;
    description: string;
  };
}


interface AppCategoriesState {
  category: AppCategory;
  applicationId: string;
  // categories: Record<string, Record<string, AppCategory>>; // applicationId -> {categoryId -> category}
  categories: AppCategory[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: AppCategoriesState = {
  category: {} as AppCategory,
  applicationId: "",
  categories: [],
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
};

// Async Thunks
export const fetchAppCategories = createAsyncThunk(
  "appCategories/fetchAll",
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.APP_CATEGORIES, { applicationId })
      );
      return { applicationId, categories: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const createAppCategory = createAsyncThunk(
  "appCategories/create",
  async (
    {
      applicationId,
      categoryData,
    }: CreateAppCategoryPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        replaceUrlParams(ApiEndpoints.APP_CATEGORY_CREATE, { applicationId }),
        categoryData
      );
      return { applicationId, category: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const fetchAppCategoryById = createAsyncThunk(
  "appCategories/fetchById",
  async (
    {
      applicationId,
      categoryId,
    }: {
      applicationId: string;
      categoryId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        replaceUrlParams(ApiEndpoints.APP_CATEGORY_BY_ID, {
          applicationId,
          id: categoryId,
        })
      );
      return { applicationId, category: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category"
      );
    }
  }
);

export const updateAppCategory = createAsyncThunk(
  "appCategories/update",
  async (
    {
      applicationId,
      categoryId,
      updateData,
    }: {
      applicationId: string;
      categoryId: string;
      updateData: Partial<AppCategory>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        replaceUrlParams(ApiEndpoints.APP_CATEGORY_UPDATE, {
          applicationId,
          id: categoryId,
        }),
        updateData
      );
      return { applicationId, category: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const deleteAppCategory = createAsyncThunk(
  "appCategories/delete",
  async (
    {
      applicationId,
      categoryId,
    }: {
      applicationId: string;
      categoryId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await api.delete(
        replaceUrlParams(ApiEndpoints.APP_CATEGORY_DELETE, {
          applicationId,
          id: categoryId,
        })
      );
      return { applicationId, categoryId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

const appCategoriesSlice = createSlice({
  name: "appCategories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Categories
      .addCase(fetchAppCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories.data;
        state.applicationId = action.payload.applicationId;
        // state.categories[action.payload.applicationId] = Array.isArray(
        //   action.payload.categories.data
        // )
        //   ? action.payload.categories.data.reduce(
        //       (acc: Record<string, AppCategory>, category: AppCategory) => {
        //         acc[category.id] = category;
        //         return acc;
        //       },
        //       {}
        //     )
        //   : {};
      })
      .addCase(fetchAppCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      // Create Category
      .addCase(createAppCategory.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createAppCategory.fulfilled, (state, action) => {
        state.creating = false;
        state.categories.push(action.payload.category.data);
        state.applicationId = action.payload.applicationId;
        // if (!state.categories[action.payload.applicationId]) {
        //   state.categories[action.payload.applicationId] = {};
        // }
        // state.categories[action.payload.applicationId][
        //   action.payload.category.id
        // ] = action.payload.category;
      })
      .addCase(createAppCategory.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || "Failed to create category";
      })
      // Fetch Category By ID
      .addCase(fetchAppCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.category.data;
        state.applicationId = action.payload.applicationId;
        // if (!state.categories[action.payload.applicationId]) {
        //   state.categories[action.payload.applicationId] = {};
        // }
        // state.categories[action.payload.applicationId][
        //   action.payload.category.id
        // ] = action.payload.category;
      })
      .addCase(fetchAppCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch category";
      })
      // Update Category
      .addCase(updateAppCategory.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAppCategory.fulfilled, (state, action) => {
        state.updating = false;
        state.category = action.payload.category.data;
        state.applicationId = action.payload.applicationId;
        // if (state.categories[action.payload.applicationId]) {
        //   state.categories[action.payload.applicationId][
        //     action.payload.category.id
        //   ] = action.payload.category;
        // }
      })
      .addCase(updateAppCategory.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || "Failed to update category";
      })
      // Delete Category
      .addCase(deleteAppCategory.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAppCategory.fulfilled, (state, action) => {
        state.deleting = false;
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload.categoryId
        );
        state.applicationId = action.payload.applicationId;
        // if (state.categories[action.payload.applicationId]) {
        //   delete state.categories[action.payload.applicationId][
        //     action.payload.categoryId
        //   ];
        // }
      })
      .addCase(deleteAppCategory.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message || "Failed to delete category";
      });
  },
});

// Actions
export const { clearError, resetState } = appCategoriesSlice.actions;

// Selectors
export const selectAllCategories = (state: RootState) =>
  state.appCategories.categories;
  // (applicationId: string) => (state: RootState) =>
  //   Object.values(state.appCategories.categories[applicationId] || {});

export const selectCategoryById = (state: RootState) =>
  state.appCategories.category;
  // (applicationId: string, categoryId: string) => (state: RootState) =>
  //   state.appCategories.categories[applicationId]?.[categoryId];

export const selectCategoriesLoading = (state: RootState) =>
  state.appCategories.loading;
export const selectCategoriesCreating = (state: RootState) =>
  state.appCategories.creating;
export const selectCategoriesUpdating = (state: RootState) =>
  state.appCategories.updating;
export const selectCategoriesDeleting = (state: RootState) =>
  state.appCategories.deleting;
export const selectCategoriesError = (state: RootState) =>
  state.appCategories.error;

export default appCategoriesSlice.reducer;
