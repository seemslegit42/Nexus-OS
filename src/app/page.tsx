// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircleNotch as Loader2 } from '@phosphor-icons/react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main authenticated dashboard.
    // In a real app, you might check auth status here before redirecting,
    // or this page might not even be reachable if auth guards are in place at a higher level.
    router.replace('/home');
  }, [router]);

  return (
    <div className="flex h-full flex-grow flex-col items-center justify-center p-6 text-center">
      <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Redirecting to your dashboard...</p>
    </div>
  );
}
