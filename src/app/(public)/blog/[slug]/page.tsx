
// src/app/(public)/blog/[slug]/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, UserCircle, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Placeholder data - fetch post details based on params.slug
  const post = {
    slug: params.slug,
    title: `Understanding ${params.slug.replace(/-/g, ' ')}`,
    author: 'NexOS Expert Contributor',
    date: 'October 22, 2023',
    image: 'https://placehold.co/1200x600.png',
    dataAiHint: 'technology article abstract',
    tags: ['NexOS', 'Deep Dive', params.slug.split('-')[0] || 'Tech'],
    content: `
This is placeholder content for the blog post titled "${params.slug.replace(/-/g, ' ')}". 
In a real application, this content would be fetched from a CMS or database based on the slug.

## Section 1: Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Subsection 1.1

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Section 2: Core Concepts

- Feature A
- Benefit B
- Implementation Detail C

\`\`\`javascript
// Example code snippet
function helloNexOS() {
  console.log("Welcome to the NexOS Platform blog!");
}
helloNexOS();
\`\`\`

## Section 3: Conclusion

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

---

Thank you for reading! We hope you found this post on ${params.slug.replace(/-/g, ' ')} insightful.
    `,
  };

  return (
    <article className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/blog" legacyBehavior>
          <Button asChild variant="outline" className="mb-8">
            <a><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</a>
          </Button>
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-foreground mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" /> Published on {post.date}</span>
            <span className="flex items-center"><UserCircle className="mr-1.5 h-4 w-4" /> By {post.author}</span>
            <span className="flex items-center"><MessageSquare className="mr-1.5 h-4 w-4" /> 3 Comments (Placeholder)</span>
          </div>
          <div className="mt-4">
            {post.tags.map(tag => (
              <span key={tag} className="mr-2 mb-2 inline-block text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </header>

        <Image src={post.image} alt={post.title} width={1200} height={600} className="rounded-lg shadow-md mb-10 w-full object-cover aspect-[16/8]" data-ai-hint={post.dataAiHint} />

        {/* Using prose for basic markdown-like styling */}
        <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none prose-headings:font-headline prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:underline prose-strong:text-foreground prose-code:text-sm prose-code:bg-muted/50 prose-code:p-1 prose-code:rounded-sm prose-pre:bg-muted/50 prose-pre:p-4 prose-pre:rounded-md">
          {/* In a real app, you'd use a Markdown renderer here */}
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />').replace(/## (.*?)<br \/>/g, '<h2>$1</h2>').replace(/### (.*?)<br \/>/g, '<h3>$1</h3>').replace(/```javascript<br \/>([\s\S]*?)<br \/>```/g, '<pre><code>$1</code></pre>') }} />
        </div>

        {/* Placeholder for Comments Section */}
        <section className="mt-16 border-t border-border/60 pt-8">
          <h2 className="text-2xl font-headline font-semibold text-foreground mb-6">Comments (3)</h2>
          <div className="space-y-6">
            {/* Example Comment */}
            <div className="bg-card p-4 rounded-lg shadow">
              <div className="flex items-center mb-2">
                <UserCircle className="h-6 w-6 mr-2 text-muted-foreground" />
                <span className="font-semibold text-foreground">Reader One</span>
                <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
              </div>
              <p className="text-sm text-muted-foreground">Great article, very insightful. Thanks for sharing!</p>
            </div>
            {/* Add Comment Form Placeholder */}
            <div>
              <textarea placeholder="Write a comment..." className="w-full p-2 rounded-md bg-input border-border min-h-[80px] text-sm"></textarea>
              <Button className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">Post Comment</Button>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
