// src/app/(public)/blog/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, UserCircle, MessageSquare, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card'; // For comments
import { Textarea } from '@/components/ui/textarea'; // For comments
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const postsDirectory = path.join(process.cwd(), 'content/blog');

interface PostFrontmatter {
  title: string;
  date: string;
  author: string;
  image: string;
  dataAiHint?: string;
  tags: string[];
  excerpt: string;
  readingTime?: string; // Estimated reading time
}

export async function generateStaticParams() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''),
    }));
  } catch (error) {
    console.error("Error reading blog posts directory for static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents) as { data: PostFrontmatter };

    return {
      title: `${data.title} | NexOS Blog`,
      description: data.excerpt,
      openGraph: {
        title: data.title,
        description: data.excerpt,
        type: 'article',
        publishedTime: new Date(data.date).toISOString(),
        authors: [data.author],
        images: [
          {
            url: data.image.startsWith('http') ? data.image : `https://nexos.app${data.image}`, // Assume absolute path for external, relative for local
            width: 1200,
            height: 630,
            alt: data.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: data.title,
        description: data.excerpt,
        images: [data.image.startsWith('http') ? data.image : `https://nexos.app${data.image}`],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
}

async function getPostBySlug(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents) as { data: PostFrontmatter; content: string };

    // Basic reading time calculation (words per minute)
    const wordsPerMinute = 200;
    const numberOfWords = content.split(/\s/g).length;
    const minutes = numberOfWords / wordsPerMinute;
    const readTime = Math.ceil(minutes);
    data.readingTime = `${readTime} min read`;

    const { content: compiledContent } = await compileMDX({
      source: content,
      options: { parseFrontmatter: false },
      // You can pass components here if needed for MDX rendering
      // components: { /* Custom components */ }
    });

    return { frontmatter: data, content: compiledContent, slug };
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content: postContent } = post;

  return (
    <article className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/blog" legacyBehavior>
          <Button asChild variant="outline" className="mb-8">
            <a><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</a>
          </Button>
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-foreground mb-4">{frontmatter.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" /> Published on {new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="flex items-center"><UserCircle className="mr-1.5 h-4 w-4" /> By {frontmatter.author}</span>
            {frontmatter.readingTime && <span className="flex items-center"><Clock className="mr-1.5 h-4 w-4" /> {frontmatter.readingTime}</span>}
            <span className="flex items-center"><MessageSquare className="mr-1.5 h-4 w-4" /> 0 Comments (Static)</span>
          </div>
          <div className="mt-4">
            {frontmatter.tags.map(tag => (
              <span key={tag} className="mr-2 mb-2 inline-block text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </header>

        <Image src={frontmatter.image} alt={frontmatter.title} width={1200} height={600} className="rounded-2xl shadow-lg mb-10 w-full object-cover aspect-[16/8]" data-ai-hint={frontmatter.dataAiHint || 'blog post image'} />

        <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none prose-headings:font-headline prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:underline prose-strong:text-foreground prose-code:text-sm prose-code:bg-muted/50 prose-code:p-1 prose-code:rounded-sm prose-pre:bg-muted/50 prose-pre:p-4 prose-pre:rounded-md">
          {postContent}
        </div>

        {/* Placeholder for Comments Section */}
        <section className="mt-16 border-t border-primary/25 pt-8">
          <h2 className="text-2xl font-headline font-semibold text-foreground mb-6">Comments (Static Placeholder)</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <Textarea placeholder="Write a comment... (Comments are not functional in this version)" className="w-full min-h-[80px] text-sm mb-2" disabled />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled>Post Comment</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </article>
  );
}

export const dynamic = 'force-static'; // Ensure pages are statically generated if possible
export const revalidate = 3600; // Revalidate once an hour
