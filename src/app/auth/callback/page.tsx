// src/app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleNotch as Loader2 } from '@phosphor-icons/react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Placeholder: In a real app, you would verify the callback parameters (e.g., code, state)
    // with your backend, exchange for tokens, and then redirect.
    const provider = searchParams.get('provider');
    console.log('Auth callback for provider:', provider);
    console.log('Query params:', Object.fromEntries(searchParams.entries()));

    // Immediately redirect instead of simulating delay
    router.push('/home');
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Authenticating...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Please wait while we securely log you in.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            You will be redirected shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
