import type { Metadata } from 'next';
import { Comfortaa, Lexend } from 'next/font/google';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import './globals.css';
import { cn } from '@/lib/utils';
import { LogProvider } from '@/contexts/LogContext';

// Lazy load heavy components for better performance
const TopBar = dynamic(
  () =>
    import('@/components/core/top-bar').then(mod => ({ default: mod.TopBar })),
  {
    loading: () => (
      <div className="h-16 animate-pulse border-b border-border bg-background" />
    ),
  }
);

const BottomNav = dynamic(
  () =>
    import('@/components/core/bottom-nav').then(mod => ({
      default: mod.BottomNav,
    })),
  {
    loading: () => (
      <div className="h-[70px] animate-pulse border-t border-border bg-background md:hidden" />
    ),
  }
);

const Zone = dynamic(
  () => import('@/components/core/zone').then(mod => ({ default: mod.Zone })),
  {
    loading: () => <div className="flex-grow animate-pulse bg-muted/20" />,
  }
);

import { ClientProviders } from '@/components/core/ClientProviders';

export const metadata: Metadata = {
  title: {
    default: 'ΛΞVOS - The Next-Gen OS',
    template: '%s | ΛΞVOS',
  },
  description: 'The Next-Gen, Agent-Native, Security-Saturated OS.',
  keywords: [
    'ΛΞVOS',
    'operating system',
    'ai',
    'agents',
    'productivity',
    'security',
  ],
  authors: [{ name: 'ΛΞVOS Team' }],
  creator: 'ΛΞVOS',
  publisher: 'ΛΞVOS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'ΛΞVOS',
    title: 'ΛΞVOS: The Future of Operating Systems',
    description:
      'Experience the next-generation, agent-native, security-saturated OS designed for innovation.',
    url: 'https://nexos.app',
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=ΛΞVOS+Platform+OG',
        width: 1200,
        height: 630,
        alt: 'ΛΞVOS Platform - The Next-Generation OS',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ΛΞVOS: The Future of Operating Systems',
    description:
      'Experience the next-generation, agent-native, security-saturated OS designed for innovation.',
    images: ['https://placehold.co/1200x630.png?text=ΛΞVOS+Platform+Twitter'],
  },
  alternates: {
    canonical: 'https://nexos.app',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// Optimize font loading with preload and display swap
const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-main',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const comfortaa = Comfortaa({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ΛΞVOS',
    url: 'https://nexos.app',
    logo: 'https://nexos.app/logo.png',
    description: 'The Next-Gen, Agent-Native, Security-Saturated OS',
  };

  return (
    <html
      lang="en"
      className={cn('dark', lexend.variable, comfortaa.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://placehold.co" />

        {/* Structured data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
          strategy="beforeInteractive"
        />

        {/* Performance monitoring */}
        <Script id="web-vitals" strategy="afterInteractive">
          {`
            window.addEventListener('load', () => {
              import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(console.log);
                getFID(console.log);
                getFCP(console.log);
                getLCP(console.log);
                getTTFB(console.log);
              });
            });
          `}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col bg-background font-main text-size-base font-weight-regular text-foreground antialiased">
        <LogProvider>
          <TopBar />
          <main className="flex flex-grow flex-col overflow-hidden pb-[70px] pt-[4rem] md:pb-0">
            <Zone
              id="root-content-zone"
              title=""
              className="flex-grow !rounded-none !border-none !bg-transparent !p-0 !shadow-none"
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
          <ClientProviders />
        </LogProvider>

        {/* Service worker registration for caching */}
        <Script id="sw-registration" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').catch(console.error);
            }
          `}
        </Script>
      </body>
    </html>
  );
}
