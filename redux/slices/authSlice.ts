import { AuthService } from '@/api/Auth';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getToken, removeToken, storeToken } from '../helperFunctions/authslice-functions';
import { removeUserData } from '../helperFunctions/userSlice-functions';
import { setUser } from './userSlice';



interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
   error: string | null;
}


const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
   error: null,
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



export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: { email: string; password: string; name: string },
    { rejectWithValue,dispatch }
  ) => {
    try {
      const response = await AuthService.register(userData);
      console.log('Registration response: in authslice', response);

      if (response?.data.token) {
        await storeToken(response.data.token);
        console.log('User token stored', response.data.token);
      }

      // Set user data after successful signup
      if (response?.data.newUser) {
        console.log('New user data:', response.data.newUser);
        dispatch(setUser(response.data.newUser));
      }
      return response.data;

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.response?.data?.message,
      });
    }
  }
);





export const googleOauth = createAsyncThunk(
  'auth/googleLogin',
  async (
    { idToken, user }: { idToken: string; user: any },{dispatch}
  ) => {
    try {
      const response = await AuthService.googleLogin(idToken, user);
      console.log("response data",response)
      await storeToken(response.data.token);
      dispatch(setUser(response.data.user));
      return { token: response.data.token, user: response.data.user };
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Google Sigin Failed',
        text2: error.response?.data?.message,
      });
      }
  }
)


export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token  = await getToken();
      if(token){
        await removeToken();
        await removeUserData();
      }
      return;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Logout',
        text2: error.response?.data?.message,
      });
    }
  }
);



export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = await getToken();
      console.log("token in checkauth", token)
      if (!token) return rejectWithValue('No token found');

      const response = await AuthService.checkAuthentication();

      console.log("auth check response",response)

      if (response.success) {
        dispatch(setUser(response.data))
        await storeToken(token)
        router.replace('/(tabs)')
        return token;
      }
      else {
        router.replace('/(auth)/login')
        return;
      }
    } catch (error: any) {
      const token = await getToken();
      if(token){
        await removeToken();
        await removeUserData();
      }   
      router.replace('/(auth)/login') 
      return;
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
     .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(googleOauth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleOauth.fulfilled, (state, action) => {
        state.token = action.payload?.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(googleOauth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

     
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })

     
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.token = action.payload as string;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state,action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
    }

});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;