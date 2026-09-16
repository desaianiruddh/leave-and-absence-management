import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient, TOKEN_STORAGE_KEY } from '../../api/apiClient';

const USER_STORAGE_KEY = 'lam_user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialState = {
  user: readStoredUser(),
  token: localStorage.getItem(TOKEN_STORAGE_KEY) || null,
  status: 'idle', // 'idle' | 'loading' | 'failed'
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      return data; // expected shape: { token, user: { id, name, email, role, managerId } }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Unable to sign in. Please try again.';
      return rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(action.payload.user),
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
