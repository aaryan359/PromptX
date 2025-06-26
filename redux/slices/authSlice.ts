import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getToken, removeToken, storeToken } from '../helperFunctions/authslice-functions';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
};



// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = { token: 'sample-token', user: { id: '1', name: 'Test User' } };
      await storeToken(response.token);
      return { token: response.token, user: response.user };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token: string, { rejectWithValue }) => {
    try {
      // Replace with actual Google auth API call
      const response = { token, user: { id: '1', name: 'Google User' } };
      await storeToken(response.token);
      return { token: response.token, user: response.user };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Google login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await removeToken();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getToken();
      if (!token) return rejectWithValue('No token found');
      
      // Replace with actual token validation API call
      const isValid = true; // Mock validation
      if (!isValid) {
        await removeToken();
        return rejectWithValue('Invalid token');
      }
      
      return token;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Authentication check failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(googleLogin.rejected, (state) => {
        state.loading = false;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Check Authentication
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;