import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Company } from '../types/common';

interface AppState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_COMPANY'; payload: Company | null }
  | { type: 'SET_AUTH'; payload: boolean }
  | { type: 'TOGGLE_THEME' };

const initialState: AppState = {
  user: null,
  company: null,
  isAuthenticated: false,
  theme: 'light',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_COMPANY':
      return { ...state, company: action.payload };
    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
