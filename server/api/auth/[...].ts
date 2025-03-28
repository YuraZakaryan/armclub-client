import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { TLoginPayload } from '~/components/auth/types';
import { fetchMe, googleSignIn, refresh, signIn } from '~/services/auth';
import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret || 'my-auth-secret',
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR
    CredentialsProvider.default({
      name: 'Credentials',
      async authorize(credentials: TLoginPayload) {
        if (!credentials?.login || !credentials?.password) return null;

        const { login, password } = credentials;

        try {
          const data: User = await signIn(login, password);
          return {
            ...data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error('Authorization failed:', error);
          return null;
        }
      },
    }),

    // @ts-expect-error You need to use .default here for it to work during SSR
    GoogleProvider.default({
      clientId: useRuntimeConfig().public.GOOGLE_CLIENT_ID,
      clientSecret: useRuntimeConfig().public.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user: User; account: any }) {
      if (user) {
        token.user = user;
        if (account?.provider === 'credentials') {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.accessTokenExpires = new Date(user.accessTokenExpires as string).getTime();
        } else if (account?.provider === 'google') {
          token.accessToken = account.access_token;
          token.idToken = account.id_token;

          if (account.access_token && account.id_token) {
            try {
              const googleUserData = await googleSignIn(account.access_token, account.id_token);
              token.user = googleUserData.user;
              token.accessToken = googleUserData.accessToken;
              token.refreshToken = googleUserData.refreshToken;
              token.accessTokenExpires = new Date(googleUserData.accessTokenExpires as string).getTime();
            } catch (error) {
              console.error('Failed to authenticate Google user on backend:', error);
            }
          } else {
            console.error('Missing access_token or id_token from Google account');
          }
        }
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      try {
        const refreshedData = await refresh(token.refreshToken as string);

        token.accessToken = refreshedData.accessToken;
        token.refreshToken = refreshedData.refreshToken;
        token.accessTokenExpires = new Date(refreshedData.accessTokenExpires).getTime();
      } catch (error) {
        console.error('Error refreshing token:', error);
        return token;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;

      try {
        const userData = await fetchMe(token.accessToken as string);
        session.user = { ...session.user, ...userData };
      } catch (error) {
        console.error('Error fetching user data during session creation:', error);
      }

      return session;
    },
  },
  pages: {
    signIn: '/404',
    error: '/404',
    signOut: '/404',
    newUser: '/404',
    verifyRequest: '/404',
  },
});
