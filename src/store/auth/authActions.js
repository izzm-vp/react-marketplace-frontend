import { createAsyncThunk } from '@reduxjs/toolkit';
import apiActions from '../../api/apiActions';

// Login action
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiActions.login(credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed. Please try again.'
            );
        }
    }
);

// Register action
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiActions.register(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Registration failed. Please try again.'
            );
        }
    }
);


// Logout action
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await apiActions.logout();
            return true;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Logout failed. Please try again.'
            );
        }
    }
);

// Fetch current user action
export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiActions.fetchUser();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch user data.'
            );
        }
    }
);

