'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // SUPER_ADMIN auto-redirect to /admin immediately after auth completes
  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.role === 'SUPER_ADMIN' &&
      pathname === '/'
    ) {
      // Immediately redirect without delay
      router.push('/admin');
    }
  }, [session?.user?.role, status, pathname, router]);

  return <>{children}</>;
}
