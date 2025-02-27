import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

export const config = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminUsername !== credentials.username) {
          console.log('Invalid username:', credentials.username);
          return null;
        }

        if (adminPassword !== credentials.password) {
          console.log('Invalid password for user:', credentials.username);
          return null;
        }

        return {
          id: '1',
          username: adminUsername,
          role: 'admin',
        };
      }
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLoginPage = nextUrl.pathname.startsWith('/admin/login');
      
      if (isOnAdmin && !isLoggedIn && !isOnLoginPage) {
        return false;
      }
      
      if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl));
      }
      
      return true;
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.sub } };
    },
  },
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET, 
} satisfies NextAuthConfig;
