
import type { Metadata } from 'next';
import { Comfortaa, Lexend } from 'next/font/google';
import '../globals.css'; // Ensure globals are applied
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'NexOS Platform - Authentication',
  description: 'Secure authentication for NexOS Platform.',
  openGraph: {
    title: 'NexOS Platform - Secure Sign-in',
    description: 'Access your NexOS account securely or register for the next-generation platform.',
    // Images and site URL will be inherited from the root layout
  },
  twitter: {
    title: 'NexOS Platform - Secure Sign-in',
    description: 'Access your NexOS account securely or register for the next-generation platform.',
    // Images will be inherited
  }
};

const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-comfortaa',
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", comfortaa.variable, lexend.variable)} suppressHydrationWarning>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
