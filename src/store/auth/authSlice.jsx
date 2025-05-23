import { createSlice } from '@reduxjs/toolkit';
import {
    loginUser,
    registerUser,
    logoutUser,
    fetchCurrentUser
} from './authActions';

const initialState = {
    isAuthenticated: false,
    userRole: null,
    isLoading: true,
    user: null,
    error: null,
    status: 'idle' // 'inactif' | 'chargement' | 'réussi' | 'échec'
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Les cas d'auth
            // login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user.user; 
                state.userRole = action.payload.user.user.roles[0]; 
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.payload;
            })
            // register
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.payload;
            })
            // logout
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                return {
                    ...initialState,
                    isLoading: false,
                    status: 'idle'
                };
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.error = action.payload;
            })
            // utilisateur actuel
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user; 
                state.userRole = action.payload.user.roles[0]; 
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.userRole = null;
                state.error = action.payload;
            });
    }
});

export default authSlice.reducer;