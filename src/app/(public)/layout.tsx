
import type { Metadata } from 'next';
import Script from 'next/script'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NexosLogo } from '@/components/icons/nexos-logo';
import '../globals.css'; // Ensure globals (and new theme vars) are applied
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
// Fonts are now inherited from RootLayout, direct import here not needed if relying on CSS variables

export const metadata: Metadata = {
  title: 'NexOS Platform', 
  description: 'Discover NexOS, the next-generation modular SaaS platform for developers and innovators.',
  openGraph: {
    title: 'NexOS Platform: Build, Automate, Scale',
    description: 'Explore the NexOS Platform, designed for modern SaaS development with AI-powered agents and modular architecture.',
  },
  twitter: {
    title: 'NexOS Platform: Build, Automate, Scale',
    description: 'Explore the NexOS Platform, designed for modern SaaS development with AI-powered agents and modular architecture.',
  }
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NexOS Platform",
    "url": "https://nexos.app", 
  };

  return (
    // HTML and body structure is handled by RootLayout. This layout just provides the public-specific structure.
    // Font variables (--font-main, --font-headline-comfortaa) are applied from RootLayout.
    <> 
      <Script
        id="website-schema-public" // Unique ID for this script tag
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color-main)] bg-[var(--panel-background-color)] backdrop-filter-[var(--panel-backdrop-filter)] shadow-[var(--panel-box-shadow)]"> {/* Use new tokens */}
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <NexosLogo className="h-7 w-7 text-[var(--accent-primary-color)]" /> {/* Use new token */}
            <span className="text-xl font-headline text-text-primary-custom">NexOS Platform</span> {/* Use custom text class or token */}
          </Link>
          <nav className="hidden md:flex items-center gap-[var(--spacing-sm)]"> {/* Use spacing token */}
            <Link href="/plans" className="text-sm font-medium text-text-secondary-custom hover:text-text-primary-custom transition-colors">Pricing</Link>
            <Link href="/explore" className="text-sm font-medium text-text-secondary-custom hover:text-text-primary-custom transition-colors">Explore</Link>
            <Link href="/blog" className="text-sm font-medium text-text-secondary-custom hover:text-text-primary-custom transition-colors">Blog</Link>
            <Link href="/docs" className="text-sm font-medium text-text-secondary-custom hover:text-text-primary-custom transition-colors">Docs</Link>
            <Link href="/about" className="text-sm font-medium text-text-secondary-custom hover:text-text-primary-custom transition-colors">About</Link>
            <Link href="/contact" className="text-sm font-medium text-text-secondary-custom hover:text-text-primary-custom transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-[var(--spacing-xs)]"> {/* Use spacing token */}
            <Link href="/login" legacyBehavior>
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex"><a>Login</a></Button>
            </Link>
            <Link href="/register" legacyBehavior>
               <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"><a>Sign Up</a></Button> {/* Button uses ShadCN vars which are now themed */}
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t border-[var(--border-color-main)] py-[var(--spacing-md)] text-center text-text-secondary-custom bg-[var(--panel-background-color)] backdrop-filter-[var(--panel-backdrop-filter)]"> {/* Use new tokens */}
        <div className="container text-size-small"> {/* Use font size token */}
          © {new Date().getFullYear()} NexOS Platform. All rights reserved.
          <div className="mt-[var(--spacing-sm)] space-x-[var(--spacing-sm)]"> {/* Use spacing token */}
              <Link href="/privacy" className="hover:text-text-primary-custom">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-text-primary-custom">Terms of Service</Link>
              <Link href="/contact-sales" className="hover:text-text-primary-custom">Contact Sales</Link>
          </div>
        </div>
      </footer>
      <Toaster />
    </>
  );
}
