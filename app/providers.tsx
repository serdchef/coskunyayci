'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/context/CartContext';
import { Toaster } from 'sonner';
import { LayoutClient } from './layout-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <LayoutClient>{children}</LayoutClient>
        <Toaster position="top-right" richColors />
      </CartProvider>
    </SessionProvider>
  );
}
