import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, User } from '@/types/auth';
import { HARDCODED_CREDENTIALS, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/constants/auth';

const AUTH_COOKIE_KEY = 'auth_token';
const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

function setAuthCookie(token: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_KEY}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

// SSR-safe initial state - NEVER read localStorage during module init
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (
        credentials.email === HARDCODED_CREDENTIALS.email &&
        credentials.password === HARDCODED_CREDENTIALS.password
      ) {
        const user: User = {
          email: credentials.email,
          name: 'Admin User',
        };

        const token = btoa(`${credentials.email}:${Date.now()}`);

        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
          setAuthCookie(token);
        }

        return { user, token };
      }

      return rejectWithValue('Invalid email or password');
    } catch (error) {
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    clearAuthCookie();
  }
  return null;
});

export const restoreAuth = createAsyncThunk('auth/restore', async () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userStr = localStorage.getItem(AUTH_USER_KEY);

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr) as User;
      return { user, token };
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  return { user: null, token: null };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(restoreAuth.fulfilled, (state, action) => {
        if (action.payload.token && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.loading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
