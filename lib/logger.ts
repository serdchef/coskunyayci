/**
 * Structured Logger
 * Pino ile production-ready logging
 */

// In some runtime contexts (Next.js dev server) loading the full pino
// implementation can pull in worker-based transports (thread-stream) that
// rely on bundler-emitted files and crash the server. To avoid that we only
// initialize pino when explicitly enabled. Otherwise we export a tiny
// console-based logger that is safe for serverless / Next dev.
let logger: any;
const usePino = process.env.USE_PINO === 'true';

if (usePino) {
  // Lazily require pino only when enabled to avoid pulling thread-stream into
  // the Next server process.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pino = require('pino');
  const enablePretty = process.env.ENABLE_PINO_PRETTY === 'true';

  logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    ...(enablePretty && process.env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        }
      : {}),
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
} else {
  // Minimal console-based logger for environments where we want to avoid
  // importing heavy logging libraries.
  logger = {
    info: (msg: unknown, ...args: unknown[]) => console.log('[info]', msg, ...args),
    warn: (msg: unknown, ...args: unknown[]) => console.warn('[warn]', msg, ...args),
    error: (msg: unknown, ...args: unknown[]) => console.error('[error]', msg, ...args),
    debug: (msg: unknown, ...args: unknown[]) => console.debug('[debug]', msg, ...args),
  };
}

export default logger;

// Helper fonksiyonlar
export const logRequest = (method: string, url: string, statusCode?: number) => {
  logger.info({ method, url, statusCode }, 'HTTP Request');
};

export const logError = (error: Error, context?: Record<string, unknown>) => {
  logger.error({ err: error, ...context }, error.message);
};

export const logOrder = (orderId: string, action: string, metadata?: Record<string, unknown>) => {
  logger.info({ orderId, action, ...metadata }, `Order ${action}`);
};

export const logPayment = (paymentId: string, status: string, amount: number) => {
  logger.info({ paymentId, status, amount }, 'Payment event');
};
