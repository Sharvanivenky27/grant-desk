import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const DEMO_MODE = !process.env.DATABASE_URL;

const DEMO_EMAIL = process.env.DEMO_EMAIL ?? 'demo@grantdesk.ca';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? 'Password123!';

const DEMO_USERS = [
  {
    id: 'demo-1',
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    name: 'Demo User',
    roles: ['applicant'],
  },
];

const buildProviders = () => {
  const providers: NextAuthOptions['providers'] = [
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

        // Demo credentials only work in demo mode (no DATABASE_URL)
        if (DEMO_MODE) {
          const demoUser = DEMO_USERS.find(
            (u) =>
              u.email === credentials.email &&
              u.password === credentials.password
          );
          if (demoUser) {
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              roles: demoUser.roles,
            };
          }
          return null;
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
  ];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const GoogleProvider = require('next-auth/providers/google').default;
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  return providers;
};

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),

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
