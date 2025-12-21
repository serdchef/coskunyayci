import { PrismaClient } from '@prisma/client';

declare global {
  // allow global prisma during hot reloads in development
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: any;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
