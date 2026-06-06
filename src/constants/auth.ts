export const HARDCODED_CREDENTIALS = {
  email: 'admin@test.com',
  password: 'Admin@123',
} as const;

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
