/**
 * NextAuth Configuration
 * Email/Password + OAuth authentication
 */

import { NextAuthOptions, Session } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './db';
import { verifyPassword } from './security';
// Lazy-load logger where needed to avoid pino/thread-stream in server bundles.

// User roles enum
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      phone?: string | null;
      role: UserRole;
      locale: string;
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    role: UserRole;
    locale: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    locale: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Email/Password authentication
    CredentialsProvider({
      id: 'credentials',
      name: 'Email ve Şifre',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('E-posta ve şifre gerekli');
        }

        // FALLBACK: Test user for development (Prisma stub mode)
        if (credentials.email === 'test@example.com' && credentials.password === 'test123') {
          return {
            id: 'test-user-1',
            email: 'test@example.com',
            name: 'Test Kullanıcı',
            phone: '+905551234567',
            role: UserRole.CUSTOMER,
            locale: 'tr',
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Kullanıcı bulunamadı');
        }

        if (!user.isActive) {
          throw new Error('Hesabınız devre dışı');
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Geçersiz şifre');
        }

        // Son giriş zamanını güncelle
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        (async () => {
          const { default: logger } = await import('./logger');
          logger.info({ userId: user.id, email: user.email }, 'User logged in');
        })();

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          locale: user.locale,
        };
      },
    }),

    // Google OAuth (Admin için)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
      profile(_profile) {
        return {
          id: _profile.sub,
          email: _profile.email,
          name: _profile.name,
          phone: null,
          role: UserRole.CUSTOMER, // Varsayılan - admin manuel olarak yükseltilmeli
          locale: _profile.locale?.startsWith('tr') ? 'tr' : 'en',
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },

  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // İlk giriş
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.locale = user.locale;
      }

      // Session güncellemesi
      if (trigger === 'update' && session) {
        token.name = session.user?.name;
        token.email = session.user?.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.locale = token.locale;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      // OAuth ile giriş yapan kullanıcıları kontrol et
      // Mark profile as referenced to avoid unused var TS error when not needed
      void profile;
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser && !existingUser.isActive) {
          return false; // Devre dışı hesaplar giremez
        }
      }

      return true;
    },
  },

  events: {
    async signIn({ user, isNewUser }) {
      (async () => {
        const { default: logger } = await import('./logger');
        logger.info({ userId: user.id, isNewUser }, 'User sign in event');
      })();

      // TODO: Yeni kullanıcı için analitik event (analyticsEvent modeli eklendiğinde)
      // if (isNewUser) {
      //   await prisma.analyticsEvent.create({
      //     data: {
      //       eventName: 'user_signed_up',
      //       userId: user.id,
      //       properties: {
      //         email: user.email,
      //         provider: 'credentials',
      //       },
      //     },
      //   });
      // }
    },

    async signOut({ token }) {
      (async () => {
        const { default: logger } = await import('./logger');
        logger.info({ userId: token.id }, 'User sign out event');
      })();
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// ============================================================================
// AUTHORIZATION HELPERS
// ============================================================================

export function isAdmin(session: Session | null): boolean {
  return (
    session?.user?.role === UserRole.ADMIN ||
    session?.user?.role === UserRole.SUPER_ADMIN
  );
}

export function isSuperAdmin(session: Session | null): boolean {
  return session?.user?.role === UserRole.SUPER_ADMIN;
}

export function isOperator(session: Session | null): boolean {
  return (
    session?.user?.role === UserRole.OPERATOR ||
    session?.user?.role === UserRole.ADMIN ||
    session?.user?.role === UserRole.SUPER_ADMIN
  );
}

export function hasRole(session: Session | null, roles: UserRole[]): boolean {
  return session?.user?.role ? roles.includes(session.user.role) : false;
}

// API route authorization check
export function requireAuth(session: Session | null, allowedRoles?: UserRole[]) {
  if (!session) {
    throw new Error('Yetkisiz erişim');
  }

  if (allowedRoles && !hasRole(session, allowedRoles)) {
    throw new Error('Bu işlem için yetkiniz yok');
  }

  return session;
}
