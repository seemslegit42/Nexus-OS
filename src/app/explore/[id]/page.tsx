
// src/app/explore/[id]/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Download, MessageSquare, Star, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ExploreItemDetailPage({ params }: { params: { id: string } }) {
  // Placeholder data - fetch item details based on params.id
  const item = {
    id: params.id,
    name: `Explorable Item ${params.id}`,
    type: 'Template',
    author: 'Community Contributor',
    description: 'This is a detailed placeholder description for the explorable item. It showcases features, use cases, and other relevant information. This could be a module, a template, or a fully built item shared by the community. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    longDescription: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. This section can contain markdown, more images, usage instructions, etc.',
    image: 'https://placehold.co/800x450.png',
    dataAiHint: 'detailed item preview',
    tags: ['Productivity', 'AI', 'Automation', 'SaaS'],
    rating: 4.5,
    reviews: 23,
    version: '1.1.0',
    lastUpdated: '2023-10-15',
  };

  return (
    <div className="p-4 md:p-6">
      <Link href="/explore" legacyBehavior>
        <Button asChild variant="outline" className="mb-6">
          <a><ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore</a>
        </Button>
      </Link>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-headline">{item.name}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span>By: <span className="text-primary">{item.author}</span></span>
                <span>Type: {item.type}</span>
                <span>Version: {item.version}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image src={item.image} alt={item.name} width={800} height={450} className="rounded-md mb-6 w-full object-cover" data-ai-hint={item.dataAiHint} />
              <h2 className="text-xl font-semibold mb-2 font-headline">Description</h2>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <h2 className="text-xl font-semibold mb-2 font-headline">Details</h2>
              <p className="text-muted-foreground whitespace-pre-line">{item.longDescription}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Action Panel */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"><Download className="mr-2 h-4 w-4"/> Use This {item.type}</Button>
              <Button variant="outline" className="w-full"><MessageSquare className="mr-2 h-4 w-4" /> Contact Author</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating:</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" /> {item.rating} ({item.reviews} reviews)
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{item.lastUpdated}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.map(tag => <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{tag}</span>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
