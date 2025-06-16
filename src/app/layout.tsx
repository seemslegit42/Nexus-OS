
import type { Metadata } from 'next';
import { Comfortaa, Lexend } from 'next/font/google';
import Script from 'next/script'; // Added for JSON-LD
import './globals.css';
import { TopBar } from '@/components/core/top-bar';
import { Toaster } from "@/components/ui/toaster";
import { Zone } from '@/components/core/zone';
import { cn } from '@/lib/utils';
import { LogProvider } from '@/contexts/LogContext';
import { BottomNav } from '@/components/core/bottom-nav';
import { FirebaseAnalytics } from '@/components/core/FirebaseAnalytics';

export const metadata: Metadata = {
  title: 'NexOS',
  description: 'The Next-Gen, Agent-Native, Security-Saturated OS.',
  icons: {
    icon: '/favicon.ico', // Standard favicon
    apple: '/apple-icon.png', // Apple touch icon
  },
  openGraph: {
    title: 'NexOS: The Future of Operating Systems',
    description: 'Experience the next-generation, agent-native, security-saturated OS designed for innovation.',
    url: 'https://nexos.app', // Replace with actual domain
    siteName: 'NexOS',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=NexOS+Platform+OG', // Replace with actual OG image URL
        width: 1200,
        height: 630,
        alt: 'NexOS Platform - The Next-Generation OS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexOS: The Future of Operating Systems',
    description: 'Experience the next-generation, agent-native, security-saturated OS designed for innovation.',
    images: ['https://placehold.co/1200x630.png?text=NexOS+Platform+Twitter'], // Replace with actual OG image URL
    // creator: '@nexosapp', // Example twitter handle
  },
  // manifest: '/site.webmanifest', // If you have a web app manifest
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NexOS",
    "url": "https://nexos.app", // Replace with actual domain
    "logo": "https://nexos.app/logo.png", // Replace with actual logo URL
    // "sameAs": [ /* Add social links here */ ]
  };

  return (
    <html lang="en" className={cn("dark", comfortaa.variable, lexend.variable)} suppressHydrationWarning>
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <FirebaseAnalytics />
        <LogProvider>
          <TopBar />
          <main className="flex-grow flex flex-col pt-[4rem] overflow-hidden pb-[70px] md:pb-0">
            <Zone
              id="root-content-zone"
              title="" 
              className="flex-grow !border-none !shadow-none !bg-transparent !p-0 !rounded-none" 
              canPin={false}
              canMaximize={false}
              canMinimize={false}
              canClose={false}
              canSettings={false}
            >
              {children}
            </Zone>
          </main>
          <BottomNav />
          <Toaster />
        </LogProvider>
      </body>
    </html>
  );
}
