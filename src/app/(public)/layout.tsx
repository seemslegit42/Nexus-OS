
import type { Metadata } from 'next';
import { Comfortaa, Lexend } from 'next/font/google';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NexosLogo } from '@/components/icons/nexos-logo'; // Assuming this exists from NexOS
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'NexOS Platform',
  description: 'The Next-Generation Modular SaaS Platform.',
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
  return (
    <html lang="en" className={cn("dark", comfortaa.variable, lexend.variable)} suppressHydrationWarning>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 w-full border-b border-primary/25 bg-background/80 backdrop-blur-lg shadow-[0_2px_15px_hsl(var(--primary)/0.1)]">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2"> {/* Public layout logo links to / */}
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
              {/* Mobile Menu Trigger - Placeholder */}
              {/* <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5"/></Button> */}
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
