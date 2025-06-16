// src/app/(public)/blog/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, UserCircle, ArrowRight, Clock } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NexOS Platform Blog | Insights & Tutorials',
  description: 'Explore the latest articles, insights, tutorials, and updates from the NexOS team and community. Stay informed about the future of SaaS and AI.',
};

interface PostFrontmatter {
  title: string;
  date: string;
  author: string;
  image: string;
  dataAiHint?: string;
  tags: string[];
  excerpt: string;
  readingTime?: string;
}

interface BlogPost {
  slug: string;
  frontmatter: PostFrontmatter;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

async function getSortedPostsData(): Promise<BlogPost[]> {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map((fileName): BlogPost | null => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents) as { data: PostFrontmatter; content: string };

        // Basic reading time calculation
        const wordsPerMinute = 200;
        const numberOfWords = content.split(/\s/g).length;
        const minutes = numberOfWords / wordsPerMinute;
        data.readingTime = `${Math.ceil(minutes)} min read`;

        if (!data.title || !data.date || !data.author || !data.image || !data.excerpt) {
          console.warn(`Skipping ${fileName}: missing one or more required frontmatter fields (title, date, author, image, excerpt).`);
          return null;
        }
        data.tags = data.tags || [];


        return {
          slug,
          frontmatter: data,
        };
      }).filter(post => post !== null) as BlogPost[]; // Filter out nulls (skipped files)

    return allPostsData.sort((a, b) => {
      if (new Date(a.frontmatter.date) < new Date(b.frontmatter.date)) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return []; // Return empty array on error
  }
}


export default async function BlogIndexPage() {
  const blogPosts = await getSortedPostsData();

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

        {blogPosts.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p className="text-xl">No blog posts found.</p>
            <p>Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(({ slug, frontmatter }) => (
              <Card key={slug} className="flex flex-col overflow-hidden">
                <Link href={`/blog/${slug}`} className="block">
                  <Image 
                    src={frontmatter.image} 
                    alt={frontmatter.title} 
                    width={600} 
                    height={338} 
                    className="w-full h-auto object-cover aspect-video" 
                    data-ai-hint={frontmatter.dataAiHint || 'blog preview'} />
                </Link>
                <CardHeader className="flex-grow">
                  <div className="mb-2 text-xs text-muted-foreground flex items-center gap-x-4 gap-y-1 flex-wrap">
                    <span className="flex items-center"><CalendarDays className="mr-1.5 h-3.5 w-3.5" /> {new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="flex items-center"><UserCircle className="mr-1.5 h-3.5 w-3.5" /> {frontmatter.author}</span>
                    {frontmatter.readingTime && <span className="flex items-center"><Clock className="mr-1.5 h-3.5 w-3.5" /> {frontmatter.readingTime}</span>}
                  </div>
                  <Link href={`/blog/${slug}`} className="hover:underline">
                    <CardTitle className="text-xl font-headline line-clamp-2">{frontmatter.title}</CardTitle>
                  </Link>
                  <CardDescription className="mt-1 text-sm line-clamp-3">{frontmatter.excerpt}</CardDescription>
                </CardHeader>
                 <CardFooter className="pt-0 mt-auto flex justify-between items-center">
                  <div className="flex flex-wrap gap-1.5">
                    {frontmatter.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-muted/70 text-muted-foreground">{tag}</Badge>
                    ))}
                    {frontmatter.tags.length > 2 && <Badge variant="secondary" className="text-xs bg-muted/70 text-muted-foreground">+{frontmatter.tags.length - 2}</Badge>}
                  </div>
                  <Link href={`/blog/${slug}`} legacyBehavior>
                    <Button asChild variant="link" className="p-0 text-primary text-xs">
                      <a>Read More <ArrowRight className="ml-1 h-3.5 w-3.5" /></a>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const revalidate = 3600; // Revalidate blog index page every hour
