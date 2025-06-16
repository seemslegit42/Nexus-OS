
// src/app/(public)/docs/page.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Code, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const docCategories = [
  { name: "Getting Started", icon: <BookOpen className="h-5 w-5 text-primary"/>, description: "Installation, setup, and your first project.", link: "/docs/getting-started" },
  { name: "Core Concepts", icon: <Layers className="h-5 w-5 text-primary"/>, description: "Understand items, modules, agents, and workflows.", link: "/docs/core-concepts" },
  { name: "API Reference", icon: <Code className="h-5 w-5 text-primary"/>, description: "Detailed information about NexOS Platform APIs.", link: "/docs/api" },
  { name: "Security Guide", icon: <ShieldCheck className="h-5 w-5 text-primary"/>, description: "Best practices for securing your applications.", link: "/docs/security" },
  { name: "Module Development", icon: <Code className="h-5 w-5 text-primary"/>, description: "Learn how to build and contribute modules.", link: "/docs/module-development" },
  { name: "Troubleshooting", icon: <BookOpen className="h-5 w-5 text-primary"/>, description: "Common issues and how to resolve them.", link: "/docs/troubleshooting" },
];

export default function DocsPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4">
            NexOS Platform Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Everything you need to build, automate, and scale with NexOS.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search documentation (e.g., API keys, module creation)..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border-primary/25 text-base h-12 focus:shadow-[0_0_12px_-2px_hsl(var(--primary)/0.4)]" 
            />
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docCategories.map(category => (
            <Link key={category.name} href={category.link} legacyBehavior>
              <Card asChild className="hover:shadow-[0_6px_35px_hsl(var(--primary)/0.18)] hover:border-primary/40 transition-all cursor-pointer">
                <a>
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                    {category.icon}
                    <CardTitle className="font-headline text-xl">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </a>
              </Card>
            </Link>
          ))}
        </div>
        
        <Card className="mt-16 min-h-[500px] flex items-center justify-center">
            <CardContent className="text-center">
                <p className="text-muted-foreground">
                    Detailed documentation content for the selected category will appear here.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    (This area could embed an external documentation site or render markdown content.)
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

