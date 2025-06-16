
import type { Metadata } from 'next';
import Script from 'next/script'; // Added for JSON-LD
import { Comfortaa, Lexend } from 'next/font/google';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NexosLogo } from '@/components/icons/nexos-logo';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'NexOS Platform', // Default title for public pages
  description: 'Discover NexOS, the next-generation modular SaaS platform for developers and innovators.',
  openGraph: {
    title: 'NexOS Platform: Build, Automate, Scale',
    description: 'Explore the NexOS Platform, designed for modern SaaS development with AI-powered agents and modular architecture.',
    // url will be specific to each page, this acts as a default if not overridden by child page.tsx
    // images will inherit from root or be set per-page by child page.tsx
  },
  twitter: {
    title: 'NexOS Platform: Build, Automate, Scale',
    description: 'Explore the NexOS Platform, designed for modern SaaS development with AI-powered agents and modular architecture.',
    // images will inherit or be set by child page.tsx
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

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NexOS Platform",
    "url": "https://nexos.app", // Replace with actual domain
    // "potentialAction": { // Optional: For sitelinks search box
    //   "@type": "SearchAction",
    //   "target": "https://nexos.app/search?q={search_term_string}",
    //   "query-input": "required name=search_term_string"
    // }
  };

  return (
    <html lang="en" className={cn("dark", comfortaa.variable, lexend.variable)} suppressHydrationWarning>
      <head>
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 w-full border-b border-primary/25 bg-background/80 backdrop-blur-lg shadow-[0_2px_15px_hsl(var(--primary)/0.1)]">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <NexosLogo className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold font-headline">NexOS Platform</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/plans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
              <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login" legacyBehavior>
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex"><a>Login</a></Button>
              </Link>
              <Link href="/register" legacyBehavior>
                 <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><a>Sign Up</a></Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-primary/25 py-8 text-center text-muted-foreground bg-background/80 backdrop-blur-sm">
          <div className="container text-sm">
            © {new Date().getFullYear()} NexOS Platform. All rights reserved.
            <div className="mt-2 space-x-4">
                <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
                <Link href="/contact-sales" className="hover:text-foreground">Contact Sales</Link>
            </div>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}

