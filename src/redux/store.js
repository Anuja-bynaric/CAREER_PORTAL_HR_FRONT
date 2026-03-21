
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import applicationReducer from './ApplicationSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    application: applicationReducer,
  },
});