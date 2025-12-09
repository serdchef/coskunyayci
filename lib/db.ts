/**
 * Prisma Database Client
 * Global singleton pattern ile connection pool yönetimi
 */

let PrismaClient: any;
try {
  const module = require('@prisma/client');
  PrismaClient = module.PrismaClient;
} catch (e) {
  console.warn('⚠️ Prisma client not available, using stub mode');
  PrismaClient = null;
}

/**
 * Safe Prisma export
 *
 * Some developer machines may not have a reachable Postgres instance or the
 * generated Prisma client may fail to initialize. To avoid crashing the whole
 * Next.js server for pages that only read data, we export a `prisma` object
 * that falls back to a harmless proxy when initialization fails.
 */

declare global {
  // eslint-disable-next-line no-var
  var prisma: any | undefined;
}

const createPrisma = () => {
  if (!PrismaClient) {
    throw new Error('Prisma client not available');
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });
};

// Minimal stub handler: any method returns a safe default to keep pages working
const makeStub = (): any => {
  const noopAsync = async (..._args: any[]) => {
    // default neutral return values
    return undefined;
  };

  const handler: ProxyHandler<any> = {
    get(_target, _prop) {
      // Common chained access patterns like prisma.product.findMany
      return new Proxy(noopAsync, {
        get() {
          return noopAsync;
        },
        apply(_t, _thisArg, _args) {
          return noopAsync();
        },
      });
    },
  };

  return new Proxy({}, handler);
};

let prismaInstance: any;
try {
  prismaInstance = globalThis.prisma ?? createPrisma();
  // assign globally in dev to prevent hot-reload duplicates
  if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismaInstance;
} catch (err) {
  // If Prisma client failed to initialize (no DB, wrong schema, etc.),
  // fall back to a stub that won't throw when pages call methods like
  // prisma.product.findMany(). This keeps the UI usable with fallback data.
  // eslint-disable-next-line no-console
  console.error('Prisma initialization failed, using stubbed client:', err);
  prismaInstance = makeStub();
}

// Graceful shutdown for real Prisma client
if (typeof window === 'undefined' && prismaInstance && typeof prismaInstance.$disconnect === 'function') {
  process.on('beforeExit', async () => {
    try {
      await prismaInstance.$disconnect();
    } catch (e) {
      // ignore
    }
  });
}

// Export with the PrismaClient type so editor/tsserver can infer model types
export const prisma: any = prismaInstance;
export default prisma;
