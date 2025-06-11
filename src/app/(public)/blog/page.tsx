
// src/app/(public)/blog/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, UserCircle, ArrowRight } from "lucide-react";

// Placeholder data
const blogPosts = [
  {
    slug: 'getting-started-with-nexos-modules',
    title: 'Getting Started with NexOS Modules',
    excerpt: 'Learn how to leverage the power of modules to extend your NexOS applications and automate complex workflows.',
    author: 'NexOS Team',
    date: 'October 20, 2023',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'coding modules abstract',
    tags: ['Modules', 'Development', 'Tutorial'],
  },
  {
    slug: 'the-future-of-ai-agents-in-saas',
    title: 'The Future of AI Agents in SaaS',
    excerpt: 'Explore the transformative potential of intelligent agents in the software-as-a-service landscape and how NexOS is leading the charge.',
    author: 'Dr. AI Visionary',
    date: 'October 15, 2023',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'ai brain network',
    tags: ['AI', 'SaaS', 'Future Tech'],
  },
  {
    slug: 'building-scalable-applications-on-nexos',
    title: 'Building Scalable Applications on NexOS Platform',
    excerpt: 'A deep dive into the architectural principles and best practices for creating robust and scalable applications using NexOS.',
    author: 'Lead Architect',
    date: 'October 10, 2023',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'server infrastructure cloud',
    tags: ['Scalability', 'Architecture', 'Best Practices'],
  },
];

export default function BlogIndexPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4">
            NexOS Platform Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Insights, tutorials, and updates from the NexOS team and community.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col overflow-hidden">
              <Link href={`/blog/${post.slug}`} className="block">
                <Image src={post.image} alt={post.title} width={600} height={338} className="w-full h-auto object-cover aspect-video" data-ai-hint={post.dataAiHint} />
              </Link>
              <CardHeader className="flex-grow">
                <div className="mb-2 text-xs text-muted-foreground flex items-center gap-4">
                  <span className="flex items-center"><CalendarDays className="mr-1.5 h-3.5 w-3.5" /> {post.date}</span>
                  <span className="flex items-center"><UserCircle className="mr-1.5 h-3.5 w-3.5" /> {post.author}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  <CardTitle className="text-xl font-headline line-clamp-2">{post.title}</CardTitle>
                </Link>
                <CardDescription className="mt-1 text-sm line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link href={`/blog/${post.slug}`} legacyBehavior>
                  <Button asChild variant="link" className="p-0 text-primary">
                    <a>Read More <ArrowRight className="ml-1 h-4 w-4" /></a>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
