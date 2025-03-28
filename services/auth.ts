import type { User } from 'next-auth';
import type { RegistrationSchema } from '~/components/auth/types';
import type { TTokensRes, TUser } from '~/types/user';

const BASE_URL = `${useRuntimeConfig().public.NUXT_API_BASE_URL}/api/auth`;

export async function signIn(login: string, password: string) {
  try {
    return await $fetch<User>(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { login, password },
    });
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

export async function googleSignIn(accessToken: string, idToken: string) {
  try {
    return await $fetch<User>(`${BASE_URL}/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { accessToken, idToken },
    });
  } catch (error) {
    console.error('Error during Google login on backend:', error);
    throw error;
  }
}

export async function registration(state: RegistrationSchema) {
  try {
    return await $fetch<User>(`${BASE_URL}/registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: state,
    });
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

export async function refresh(refreshToken: string) {
  try {
    return await $fetch<TTokensRes>(`${BASE_URL}/refresh`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  } catch (error) {
    console.error('Error during token refresh:', error);
    throw error;
  }
}

export async function fetchMe(accessToken: string) {
  try {
    return await $fetch<TUser>(`${BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
