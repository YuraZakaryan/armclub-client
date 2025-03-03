import type { TReturnItem } from '~/types';

export type TRole = 'ADMIN' | 'MODERATOR' | 'USER';

export type TUser = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  countryCode: string;
  phone: string;
  activated: boolean;
  banned: false;
  role: TRole;
  createdAt: string;
  updatedAt: string;
};

export type TAuthMode =
  | 'LOGIN'
  | 'REGISTRATION'
  | 'REQUEST_PASSWORD_RESET'
  | 'VERIFY_PASSWORD_RESET'
  | 'SET_PASSWORD_RESET';

export enum ERoles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export type TResetPassword = {
  email?: string;
  otp?: string;
};

export type TUserState = {
  authMode: TAuthMode;
  session: null;
  user: TUser | null;
  currentUser: TUser | null;
  isRequestLoading: boolean;
  isPasswordRequestLoading: boolean;
  resetPassword: TResetPassword;
  users: TReturnItem<TUser[]>;
};

export type TLoginFormData = {
  username: string;
  password: string;
};

export type TRegistrationFormData = {
  username: string;
  password: string;
  firstName: string;
};

export interface IFormCustomProps {
  label: string;
  name: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'tel' | 'url' | 'search';
  required?: boolean;
  validation?: string;
  messages?: {
    required?: string;
    length?: string;
    email?: string;
    min?: string;
    same?: string;
  };
}

export type TTokensRes = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: string;
};

export type TFetchUsersBody = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  userBanStatuses?: boolean[];
};
