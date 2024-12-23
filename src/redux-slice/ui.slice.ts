import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITheme, IUIState } from '../types';

const initialTheme: ITheme = {
  mode: 'light',
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    accent: '#82b1ff',
    background: '#ffffff',
    surface: '#f5f5f5',
    error: '#f44336',
    text: {
      primary: '#000000',
      secondary: '#757575',
      disabled: '#9e9e9e',
    },
    border: '#e0e0e0',
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
    lg: '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  zIndex: {
    modal: 1000,
    popup: 900,
    tooltip: 800,
    dropdown: 700,
  },
};

const initialState: IUIState = {
  theme: initialTheme,
  sidebar: {
    isOpen: true,
    width: 240,
  },
  modal: {
    isOpen: false,
  },
  toast: {
    isOpen: false,
    type: 'info',
    message: '',
  },
  loading: {
    isLoading: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme.mode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebar.width = action.payload;
    },
    openModal: (state, action: PayloadAction<{ component: string; props?: Record<string, any> }>) => {
      state.modal = { isOpen: true, ...action.payload };
    },
    closeModal: (state) => {
      state.modal = { isOpen: false };
    },
    showToast: (state, action: PayloadAction<{ type: IUIState['toast']['type']; message: string; duration?: number }>) => {
      state.toast = { isOpen: true, ...action.payload };
    },
    hideToast: (state) => {
      state.toast = { ...state.toast, isOpen: false };
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string }>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setThemeMode,
  toggleSidebar,
  setSidebarWidth,
  openModal,
  closeModal,
  showToast,
  hideToast,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
