// ApplicationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        appToken: null,
        isVerified: false,
    },
    reducers: {
        setApplicationSession: (state, action) => {
            // Log this to see if it's actually getting the token
            console.log("Redux Setting Token:", action.payload);
            state.appToken = action.payload;
            state.isVerified = true;
        },
        clearApplicationSession: (state) => {
            state.appToken = null;
            state.isVerified = false;
        },
    },
});

export const { setApplicationSession, clearApplicationSession } = applicationSlice.actions;
export default applicationSlice.reducer;