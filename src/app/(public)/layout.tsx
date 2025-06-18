import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NexosLogo } from '@/components/icons/nexos-logo';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'NexOS Platform',
  description:
    'Discover NexOS, the next-generation modular SaaS platform for developers and innovators.',
  openGraph: {
    title: 'NexOS Platform: Build, Automate, Scale',
    description:
      'Explore the NexOS Platform, designed for modern SaaS development with AI-powered agents and modular architecture.',
  },
  twitter: {
    title: 'NexOS Platform: Build, Automate, Scale',
    description:
      'Explore the NexOS Platform, designed for modern SaaS development with AI-powered agents and modular architecture.',
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NexOS Platform',
    url: 'https://nexos.app',
  };

  return (
    <>
      <Script
        id="website-schema-public"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <header className="backdrop-filter-[var(--panel-backdrop-filter)] sticky top-0 z-40 w-full border-b border-[var(--border-color-main)] bg-[var(--panel-background-color)] shadow-[var(--panel-box-shadow)]">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <NexosLogo className="h-7 w-7 text-[var(--accent-primary-color)]" />
            <span className="font-headline text-xl text-text-primary-custom">
              NexOS Platform
            </span>
          </Link>
          <nav className="hidden items-center gap-[var(--spacing-sm)] md:flex">
            <Link
              href="/plans"
              className="text-sm font-medium text-text-secondary-custom transition-colors hover:text-text-primary-custom"
            >
              Pricing
            </Link>
            <Link
              href="/explore"
              className="text-sm font-medium text-text-secondary-custom transition-colors hover:text-text-primary-custom"
            >
              Explore
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-text-secondary-custom transition-colors hover:text-text-primary-custom"
            >
              Blog
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-text-secondary-custom transition-colors hover:text-text-primary-custom"
            >
              Docs
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-text-secondary-custom transition-colors hover:text-text-primary-custom"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-text-secondary-custom transition-colors hover:text-text-primary-custom"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-[var(--spacing-xs)]">
            <Link href="/login" legacyBehavior>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <a>Login</a>
              </Button>
            </Link>
            <Link href="/register" legacyBehavior>
              <Button asChild size="sm">
                <a>Sign Up</a>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="backdrop-filter-[var(--panel-backdrop-filter)] border-t border-[var(--border-color-main)] bg-[var(--panel-background-color)] py-[var(--spacing-md)] text-center text-text-secondary-custom">
        <div className="container text-size-small">
          © {new Date().getFullYear()} NexOS Platform. All rights reserved.
          <div className="mt-[var(--spacing-sm)] space-x-[var(--spacing-sm)]">
            <Link href="/privacy" className="hover:text-text-primary-custom">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-text-primary-custom">
              Terms of Service
            </Link>
            <Link
              href="/contact-sales"
              className="hover:text-text-primary-custom"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </footer>
      <Toaster />
    </>
  );
}
