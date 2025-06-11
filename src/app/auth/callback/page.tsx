
// src/app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Placeholder: In a real app, you would verify the callback parameters (e.g., code, state)
    // with your backend, exchange for tokens, and then redirect.
    const provider = searchParams.get('provider');
    console.log('Auth callback for provider:', provider);
    console.log('Query params:', Object.fromEntries(searchParams.entries()));

    // Simulate backend processing and token exchange
    setTimeout(() => {
      // On success, redirect to home or intended destination
      router.push('/home'); 
    }, 2000); 
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Authenticating...</CardTitle>
        </CardHeader>
        <CardContent>
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Please wait while we securely log you in.</p>
          <p className="text-xs text-muted-foreground mt-2">You will be redirected shortly.</p>
        </CardContent>
      </Card>
    </div>
  );
}
