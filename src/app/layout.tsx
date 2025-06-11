
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
      <head>
        {/* Removed direct font links, next/font handles this */}
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background">
        <TopBar />
        {/* main provides top padding for TopBar and flex context. Added overflow-hidden */}
        <main className="flex-grow flex flex-col pt-[4rem] overflow-hidden"> 
          <Zone
            title="" // No title for the main app canvas, header should hide
            // No icon for the main app canvas
            className="flex-grow !border-none !shadow-none !bg-transparent !rounded-none" // Zone takes available space, removes card-like appearance
            // All controls are disabled for the main app canvas, so header effectively hides
            canPin={false}
            canMaximize={false}
            canMinimize={false}
            canClose={false}
          >
            {/* 
              Children (page content, typically a WorkspaceGrid) will be rendered 
              inside Zone's CardContent. CardContent has p-4 by default and overflow-auto.
            */}
            {children}
          </Zone>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
