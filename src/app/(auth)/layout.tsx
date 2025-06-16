
import type { Metadata } from 'next';
import '../globals.css'; 
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
// Fonts are now inherited from RootLayout, direct import here not needed if relying on CSS variables

export const metadata: Metadata = {
  title: 'NexOS Platform - Authentication',
  description: 'Secure authentication for NexOS Platform.',
  openGraph: {
    title: 'NexOS Platform - Secure Sign-in',
    description: 'Access your NexOS account securely or register for the next-generation platform.',
  },
  twitter: {
    title: 'NexOS Platform - Secure Sign-in',
    description: 'Access your NexOS account securely or register for the next-generation platform.',
  }
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // HTML and body structure is handled by RootLayout. This layout just provides the auth-specific structure.
    // Font variables (--font-main, --font-headline-comfortaa) are applied from RootLayout.
    <>
        <main className="flex-grow flex flex-col items-center justify-center p-[var(--spacing-sm)]"> {/* Use new spacing token */}
          {children}
        </main>
        <Toaster />
    </>
  );
}
