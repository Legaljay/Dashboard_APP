// //TODO: to be returned to especially the onUploadprogress

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '@/services/api';
// import { ApiEndpoints } from '@/enums/api.enum';

// interface FileItem {
//   id: string;
//   name: string;
//   size: number;
//   type: string;
//   url: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface FilesState {
//   files: FileItem[];
//   uploadProgress: Record<string, number>;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: FilesState = {
//   files: [],
//   uploadProgress: {},
//   loading: false,
//   error: null,
// };

// export const fetchFiles = createAsyncThunk(
//   'files/fetchFiles',
//   async () => {
//     const response = await api.get(ApiEndpoints.FILE_LIST);
//     return response.data;
//   }
// );

// export const uploadFile = createAsyncThunk(
//   'files/uploadFile',
//   async (file: File, { dispatch }) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     const response = await api.post(ApiEndpoints.FILE_UPLOAD, formData, {
//       onUploadProgress: (progressEvent) => {
//         const progress = Math.round(
//           (progressEvent.loaded * 100) / (progressEvent.total || 100)
//         );
//         dispatch(updateUploadProgress({ fileId: file.name, progress }));
//       },
//     });

//     return response.data;
//   }
// );

// export const deleteFile = createAsyncThunk(
//   'files/deleteFile',
//   async (fileId: string) => {
//     await api.delete(`${ApiEndpoints.FILE_DELETE}/${fileId}`);
//     return fileId;
//   }
// );

// const filesSlice = createSlice({
//   name: 'files',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     updateUploadProgress: (state, action) => {
//       const { fileId, progress } = action.payload;
//       state.uploadProgress[fileId] = progress;
//     },
//     clearUploadProgress: (state, action) => {
//       const { fileId } = action.payload;
//       delete state.uploadProgress[fileId];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFiles.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchFiles.fulfilled, (state, action) => {
//         state.loading = false;
//         state.files = action.payload;
//       })
//       .addCase(fetchFiles.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch files';
//       })
//       .addCase(uploadFile.fulfilled, (state, action) => {
//         state.files.push(action.payload);
//         delete state.uploadProgress[action.payload.name];
//       })
//       .addCase(deleteFile.fulfilled, (state, action) => {
//         state.files = state.files.filter(file => file.id !== action.payload);
//       });
//   },
// });

// export const { clearError, updateUploadProgress, clearUploadProgress } = filesSlice.actions;
// export default filesSlice.reducer;
