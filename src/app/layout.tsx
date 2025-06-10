
import type { Metadata } from 'next';
import './globals.css';
import { TopBar } from '@/components/core/top-bar';
import { Toaster } from "@/components/ui/toaster";
import { Zone } from '@/components/core/zone';

export const metadata: Metadata = {
  title: 'NexOS',
  description: 'The Next-Gen, Agent-Native, Security-Saturated OS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
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
