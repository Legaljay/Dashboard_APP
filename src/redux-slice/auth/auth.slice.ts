import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  IAuthResponse,
  ILoginResponse,
  IMFASetup,
  IMFAVerification,
  IUser,
  ApiError,
} from "@/types";
import { api } from "@/services/api";
import { ApiEndpoints } from "@/enums/api.enum";
import TokenService from "@/utils/token";

export interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
  mfaEnabled: boolean;
  mfaSetup: IMFASetup | null;
  loading: boolean;
  error: string | null;
  tempPassword: string | null;
  tempEmail: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  mfaEnabled: false,
  mfaSetup: null,
  loading: false,
  error: null,
  tempPassword: null,
  tempEmail: null,
};

// Auth Thunks
export const loginUser = createAsyncThunk<
  ILoginResponse,
  { email: string; password: string; mfaCode?: string },
  { rejectValue: ApiError }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<ILoginResponse>(
      ApiEndpoints.LOGIN,
      credentials
    );
    if (response.data.data.token) {
      TokenService.setToken(response.data.data.token);
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data as ApiError);
    }
    throw new Error("Network error");
  }
});

export const registerUser = createAsyncThunk<
  IAuthResponse,
  {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    country: string;
    phone_number: string;
  },
  { rejectValue: ApiError }
>("auth/register", async ( data , { rejectWithValue }) => {
  try {
    const response = await api.post<IAuthResponse>(
      ApiEndpoints.REGISTER,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data as ApiError);
    }
    throw new Error("Registration failed");
  }
});

export const verifyEmail = createAsyncThunk<
  IAuthResponse,
  { code: string },
  { rejectValue: ApiError }
>("auth/verifyEmail", async (token, { rejectWithValue }) => {
  try {
    const response = await api.post(ApiEndpoints.VERIFY_EMAIL, token);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data as ApiError);
    }
    throw new Error("Email verification failed");
  }
});

export const forgotPassword = createAsyncThunk<
  IAuthResponse,
  { email: string },
  { rejectValue: ApiError }
>(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.FORGOT_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data as ApiError);
      }
      throw new Error("Password reset request failed");
    }
  }
);

export const resendEmail = createAsyncThunk<
  IAuthResponse,
  { email: string, purpose: string },
  { rejectValue: ApiError }
>(
  "auth/resendEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.RESEND_EMAIL, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data as ApiError);
      }
      throw new Error("Password reset request failed");
    }
  }
);

export const resetPassword = createAsyncThunk<
  IAuthResponse,
  { code: string; password: string },
  { rejectValue: ApiError }
>(
  "auth/resetPassword",
  async (data: { code: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.RESET_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data as ApiError);
      }
      throw new Error("Password reset failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    data: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(ApiEndpoints.CHANGE_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data as ApiError);
      }
      throw new Error("Password change failed");
    }
  }
);

export const setupMFA = createAsyncThunk(
  "auth/setupMFA",
  async (type: "email" | "authenticator", { rejectWithValue }) => {
    try {
      const response = await api.post<IMFASetup>(ApiEndpoints.MFA_SETUP, {
        type,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data as ApiError);
      }
      throw new Error("MFA setup failed");
    }
  }
);

export const verifyMFA = createAsyncThunk(
  "auth/verifyMFA",
  async (data: IMFAVerification, { rejectWithValue }) => {
    try {
      const response = await api.post(ApiEndpoints.MFA_VERIFY, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data as ApiError);
      }
      throw new Error("MFA verification failed");
    }
  }
);

export const refreshAuthToken = createAsyncThunk(
  "auth/refreshToken",
  async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await api.post(ApiEndpoints.REFRESH_TOKEN, {
        refreshToken,
      });
      if (response.data.data.token) {
        TokenService.setToken(response.data.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Token refresh failed");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post(ApiEndpoints.LOGOUT);
    TokenService.removeToken();
    // localStorage.removeItem('refreshToken');
  } catch (error: any) {
    // if (error.response?.data) {
    //   return rejectWithValue(error.response.data as ApiError);
    // }
    throw new Error("Logout Failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<ILoginResponse>) => {
      state.user = action.payload.data.user;
      state.token = action.payload.data.token;
      state.isAuthenticated = true;
    },
    setTempEmail: (state, action: PayloadAction<string>) => {
      state.tempEmail = action.payload;
    },
    clearTempEmail: (state) => {
      state.tempEmail = null;
    },
    setTempPassword: (state, action: PayloadAction<string>) => {
      state.tempPassword = action.payload;
    },
    clearTempPassword: (state) => {
      state.tempPassword = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.mfaEnabled = false;
      state.mfaSetup = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true; //new
        state.user = action.payload.data.user;
        state.token = action.payload.data.token; //new
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      });

    // MFA Setup
    builder
      .addCase(setupMFA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setupMFA.fulfilled, (state, action) => {
        state.loading = false;
        state.mfaSetup = action.payload;
      })
      .addCase(setupMFA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "MFA setup failed";
      });

    // MFA Verify
    builder
      .addCase(verifyMFA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMFA.fulfilled, (state) => {
        state.loading = false;
        state.mfaEnabled = true;
      })
      .addCase(verifyMFA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "MFA verification failed";
      });

    // Token Refresh
    builder
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.mfaEnabled = false;
        state.mfaSetup = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Logout failed";
      });
  },
});

export const { setCredentials, clearCredentials, setError, clearError, setTempPassword, clearTempPassword, setTempEmail, clearTempEmail } =
  authSlice.actions;
export default authSlice.reducer;
