import { PrismaClient } from '@prisma/client';

declare global {
  // allow global prisma during hot reloads in development
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    // 🔧 Optimized for Supabase Session Pooler on Vercel
    errorFormat: 'pretty',
    // Disable relation mode for now to avoid connection issues
    // Use direct connections with pooling instead
  });
};

export const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

