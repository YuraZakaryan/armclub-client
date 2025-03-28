import type { DefaultSession, DefaultUser } from 'next-auth';
import type { TUser } from './user';

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: User;
  }
}

declare module 'next-auth' {
  interface User extends TUser, DefaultUser {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: string;
  }

  interface Session extends DefaultSession {
    user: User;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}
