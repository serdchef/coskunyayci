import { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
  // Lightweight augmentation so TypeScript in the editor recognizes
  // `prisma.notification` when the generated client isn't picked up
  // yet by the TS server. Keep it `any` to avoid over-typing here.
  interface PrismaClient {
    notification: any;
  }
}

export {};
