
import type { Metadata } from 'next';
import { Comfortaa, Lexend } from 'next/font/google';
import './globals.css';
import { TopBar } from '@/components/core/top-bar';
import { Toaster } from "@/components/ui/toaster";
import { Zone } from '@/components/core/zone';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'NexOS',
  description: 'The Next-Gen, Agent-Native, Security-Saturated OS.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", comfortaa.variable, lexend.variable)} suppressHydrationWarning>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <TopBar />
        <main className="flex-grow flex flex-col pt-[4rem] overflow-hidden"> 
          <Zone
            title="" 
            className="flex-grow !border-none !shadow-none !bg-transparent !p-0 !rounded-none" 
            canPin={false}
            canMaximize={false}
            canMinimize={false}
            canClose={false}
          >
            {children}
          </Zone>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
