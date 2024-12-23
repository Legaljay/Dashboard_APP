import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
// import userReducer from './slices/userSlice';
// import customersReducer from './slices/customersSlice';
import analyticsReducer from './slices/analyticsSlice';
// import appStoreReducer from './slices/appStoreSlice';
// import billingReducer from './slices/billingSlice';
import { RootState } from './types';

export const store = configureStore({
  reducer: {
    // user: userReducer,
    // customers: customersReducer,
    analytics: analyticsReducer,
    // appStore: appStoreReducer,
    // billing: billingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
