import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null, // Add token to state if needed
    isAuthenticated: false,
    isCheckingAuth: true, 
  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token; // Store token
      state.isAuthenticated = !!action.payload.user;
      state.isCheckingAuth = false;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null; // Clear token from state
      state.isAuthenticated = false;
      state.isCheckingAuth = false;
    },
    setCheckingAuth: (state, action) => {
      state.isCheckingAuth = action.payload;
    }
  },
});

export const { setLogin, setLogout, setCheckingAuth } = authSlice.actions;
export default authSlice.reducer;