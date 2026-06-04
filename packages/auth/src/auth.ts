import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

// Demo mode: use in-memory auth when no database is available
const DEMO_MODE = !process.env.DATABASE_URL;

const DEMO_USERS = [
  {
    id: 'demo-1',
    email: 'demo@grantdesk.ca',
    password: 'demo123',
    name: 'Demo User',
    roles: ['applicant'],
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Demo mode: use in-memory authentication
        if (DEMO_MODE) {
          const user = DEMO_USERS.find(
            (u) =>
              u.email === credentials.email &&
              u.password === credentials.password
          );
          if (!user) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles,
          };
        }

        // Real mode: use database
        try {
          const { prisma } = await import('@grantdesk/db');
          const bcrypt = await import('bcryptjs');

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { roles: true },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles.map((r) => r.name),
          };
        } catch (error) {
          console.error('Auth database error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email as string;
        token.name = user.name;
        token.roles = (user as any).roles ?? [];
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).roles = token.roles ?? [];
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
