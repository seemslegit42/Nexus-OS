// src/app/(public)/blog/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar as CalendarDays,
  UserCircle,
  ArrowRight,
  Clock,
} from '@phosphor-icons/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NexOS Platform Blog | Insights & Tutorials',
  description:
    'Explore the latest articles, insights, tutorials, and updates from the NexOS team and community. Stay informed about the future of SaaS and AI.',
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

// Type guard function
function isValidPostFrontmatter(data: any): data is PostFrontmatter {
  return (
    typeof data === 'object' &&
    typeof data.title === 'string' &&
    typeof data.date === 'string' &&
    typeof data.author === 'string' &&
    typeof data.image === 'string' &&
    Array.isArray(data.tags) &&
    typeof data.excerpt === 'string'
  );
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
        const { data, content } = matter(fileContents);

        // Validate and type the frontmatter data
        if (!isValidPostFrontmatter(data)) {
          console.warn(`Invalid frontmatter in ${fileName}`, data);
          return null; // Skip invalid posts
        }

        // Basic reading time calculation
        const wordsPerMinute = 200;
        const numberOfWords = content.split(/\s/g).length;
        const minutes = numberOfWords / wordsPerMinute;
        data.readingTime = `${Math.ceil(minutes)} min read`;

        if (
          !data.title ||
          !data.date ||
          !data.author ||
          !data.image ||
          !data.excerpt
        ) {
          console.warn(
            `Skipping ${fileName}: missing one or more required frontmatter fields (title, date, author, image, excerpt).`
          );
          return null;
        }
        data.tags = data.tags || [];

        return {
          slug,
          frontmatter: data as PostFrontmatter,
        };
      })
      .filter((post): post is BlogPost => post !== null); // Filter out nulls (skipped files)

    return allPostsData.sort((a, b) => {
      if (new Date(a.frontmatter.date) < new Date(b.frontmatter.date)) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return []; // Return empty array on error
  }
}

export default async function BlogIndexPage() {
  const blogPosts = await getSortedPostsData();

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="mb-4 font-headline text-4xl font-bold text-foreground md:text-5xl">
            NexOS Platform Blog
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Insights, tutorials, and updates from the NexOS team and community.
          </p>
        </header>

        {blogPosts.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <p className="text-xl">No blog posts found.</p>
            <p>Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map(({ slug, frontmatter }) => (
              <Card key={slug} className="flex flex-col overflow-hidden">
                <Link href={`/blog/${slug}`} className="block">
                  <Image
                    src={frontmatter.image}
                    alt={frontmatter.title}
                    width={600}
                    height={338}
                    className="aspect-video h-auto w-full object-cover"
                    data-ai-hint={frontmatter.dataAiHint || 'blog preview'}
                  />
                </Link>
                <CardHeader className="flex-grow">
                  <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <CalendarDays className="mr-1.5 h-3.5 w-3.5" />{' '}
                      {new Date(frontmatter.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center">
                      <UserCircle className="mr-1.5 h-3.5 w-3.5" />{' '}
                      {frontmatter.author}
                    </span>
                    {frontmatter.readingTime && (
                      <span className="flex items-center">
                        <Clock className="mr-1.5 h-3.5 w-3.5" />{' '}
                        {frontmatter.readingTime}
                      </span>
                    )}
                  </div>
                  <Link href={`/blog/${slug}`} className="hover:underline">
                    <CardTitle className="line-clamp-2 font-headline text-xl">
                      {frontmatter.title}
                    </CardTitle>
                  </Link>
                  <CardDescription className="mt-1 line-clamp-3 text-sm">
                    {frontmatter.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex items-center justify-between pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {frontmatter.tags.slice(0, 2).map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-muted/70 text-xs text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {frontmatter.tags.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="bg-muted/70 text-xs text-muted-foreground"
                      >
                        +{frontmatter.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <Link href={`/blog/${slug}`} legacyBehavior>
                    <Button
                      asChild
                      variant="link"
                      className="p-0 text-xs text-primary"
                    >
                      <a>
                        Read More <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </a>
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
