import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // Populated after login or /me check
    isAuthenticated: false,
    isCheckingAuth: true, // Used to show a loading spinner on refresh
  },
  reducers: {
    setLogin: (state, action) => {
      // Backend returns { user } after successful cookie placement
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isCheckingAuth = false;
    },
    setLogout: (state) => {
      state.user = null;
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