// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '@/services/api';
// import { ApiEndpoints } from '@/enums/api.enum';
// import { RootState } from '../store';

// interface MFASecret {
//   secret: string;
//   qrCode: string;
// }

// interface MFASettings {
//   enabled: boolean;
//   method: 'totp' | 'sms' | 'email';
//   lastVerified?: string;
// }

// interface UserMFAState {
//   secret: MFASecret | null;
//   settings: MFASettings | null;
//   loading: {
//     generateSecret: boolean;
//     setup: boolean;
//     verify: boolean;
//     settings: boolean;
//     toggle: boolean;
//   };
//   error: {
//     generateSecret: string | null;
//     setup: string | null;
//     verify: string | null;
//     settings: string | null;
//     toggle: string | null;
//   };
// }

// const initialState: UserMFAState = {
//   secret: null,
//   settings: null,
//   loading: {
//     generateSecret: false,
//     setup: false,
//     verify: false,
//     settings: false,
//     toggle: false,
//   },
//   error: {
//     generateSecret: null,
//     setup: null,
//     verify: null,
//     settings: null,
//     toggle: null,
//   },
// };

// export const generateMFASecret = createAsyncThunk(
//   'userMFA/generateSecret',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.post(ApiEndpoints.USER_MFA_GENERATE_SECRET);
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to generate MFA secret');
//     }
//   }
// );

// export const setupMFA = createAsyncThunk(
//   'userMFA/setup',
//   async (setupData: { secret: string; code: string }, { rejectWithValue }) => {
//     try {
//       const response = await api.post(ApiEndpoints.USER_MFA_SETUP, setupData);
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to setup MFA');
//     }
//   }
// );

// export const verifyMFA = createAsyncThunk(
//   'userMFA/verify',
//   async (code: string, { rejectWithValue }) => {
//     try {
//       const response = await api.post(ApiEndpoints.USER_MFA_VERIFY, { code });
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to verify MFA code');
//     }
//   }
// );

// export const fetchMFASettings = createAsyncThunk(
//   'userMFA/fetchSettings',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get(ApiEndpoints.USER_MFA_SETTINGS);
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch MFA settings');
//     }
//   }
// );

// export const toggleMFA = createAsyncThunk(
//   'userMFA/toggle',
//   async (enabled: boolean, { rejectWithValue }) => {
//     try {
//       const response = await api.post(ApiEndpoints.USER_MFA_TOGGLE, { enabled });
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to toggle MFA');
//     }
//   }
// );

// const userMFASlice = createSlice({
//   name: 'userMFA',
//   initialState,
//   reducers: {
//     clearErrors: (state) => {
//       state.error = {
//         generateSecret: null,
//         setup: null,
//         verify: null,
//         settings: null,
//         toggle: null,
//       };
//     },
//     resetState: () => initialState,
//     clearSecret: (state) => {
//       state.secret = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Generate Secret
//       .addCase(generateMFASecret.pending, (state) => {
//         state.loading.generateSecret = true;
//         state.error.generateSecret = null;
//       })
//       .addCase(generateMFASecret.fulfilled, (state, action) => {
//         state.loading.generateSecret = false;
//         state.secret = action.payload;
//       })
//       .addCase(generateMFASecret.rejected, (state, action) => {
//         state.loading.generateSecret = false;
//         state.error.generateSecret = action.payload as string;
//       })

//       // Setup MFA
//       .addCase(setupMFA.pending, (state) => {
//         state.loading.setup = true;
//         state.error.setup = null;
//       })
//       .addCase(setupMFA.fulfilled, (state, action) => {
//         state.loading.setup = false;
//         state.settings = action.payload;
//         state.secret = null; // Clear secret after successful setup
//       })
//       .addCase(setupMFA.rejected, (state, action) => {
//         state.loading.setup = false;
//         state.error.setup = action.payload as string;
//       })

//       // Verify MFA
//       .addCase(verifyMFA.pending, (state) => {
//         state.loading.verify = true;
//         state.error.verify = null;
//       })
//       .addCase(verifyMFA.fulfilled, (state, action) => {
//         state.loading.verify = false;
//         if (state.settings) {
//           state.settings.lastVerified = new Date().toISOString();
//         }
//       })
//       .addCase(verifyMFA.rejected, (state, action) => {
//         state.loading.verify = false;
//         state.error.verify = action.payload as string;
//       })

//       // Fetch Settings
//       .addCase(fetchMFASettings.pending, (state) => {
//         state.loading.settings = true;
//         state.error.settings = null;
//       })
//       .addCase(fetchMFASettings.fulfilled, (state, action) => {
//         state.loading.settings = false;
//         state.settings = action.payload;
//       })
//       .addCase(fetchMFASettings.rejected, (state, action) => {
//         state.loading.settings = false;
//         state.error.settings = action.payload as string;
//       })

//       // Toggle MFA
//       .addCase(toggleMFA.pending, (state) => {
//         state.loading.toggle = true;
//         state.error.toggle = null;
//       })
//       .addCase(toggleMFA.fulfilled, (state, action) => {
//         state.loading.toggle = false;
//         state.settings = action.payload;
//       })
//       .addCase(toggleMFA.rejected, (state, action) => {
//         state.loading.toggle = false;
//         state.error.toggle = action.payload as string;
//       });
//   },
// });

// export const { clearErrors, resetState, clearSecret } = userMFASlice.actions;

// // Selectors
// export const selectUserMFAState = (state: RootState) => state.userMFA;
// export const selectMFASecret = (state: RootState) => state.userMFA.secret;
// export const selectMFASettings = (state: RootState) => state.userMFA.settings;
// export const selectUserMFALoading = (state: RootState) => state.userMFA.loading;
// export const selectUserMFAError = (state: RootState) => state.userMFA.error;

// export default userMFASlice.reducer;
