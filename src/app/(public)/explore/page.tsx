// src/app/(public)/explore/page.tsx
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  MagnifyingGlass as Search,
  FunnelSimple as Filter,
  Sparkle as Sparkles,
  CloudArrowUp as UploadCloud,
} from '@phosphor-icons/react';
import Image from 'next/image';

// Placeholder data
const exploreItems = [
  {
    id: 'tpl_agency_site',
    name: 'Modern Agency Template',
    type: 'Template',
    author: 'CreativeStudio',
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'website template agency',
  },
  {
    id: 'mod_ai_writer',
    name: 'AI Content Writer Module',
    type: 'Module',
    author: 'AIBuilders',
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'ai writing module',
  },
  {
    id: 'item_portfolio_gallery',
    name: 'Photography Portfolio Site',
    type: 'Item',
    author: 'PhotoPro',
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'photo gallery website',
  },
  {
    id: 'tpl_saas_dashboard',
    name: 'SaaS Admin Dashboard',
    type: 'Template',
    author: 'SaaSWorks',
    image: 'https://placehold.co/400x300.png',
    dataAiHint: 'dashboard template saas',
  },
];

export default function ExplorePage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="font-headline text-3xl text-foreground">
          Explore NexOS Ecosystem
        </h1>
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <div className="relative flex-grow sm:min-w-[300px] sm:flex-grow-0">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items, modules, templates..."
              className="w-full pl-9"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Link href="/explore/submit" legacyBehavior>
            <Button
              asChild
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
            >
              <a>
                <UploadCloud className="mr-2 h-4 w-4" /> Submit Your Creation
              </a>
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {exploreItems.map(item => (
          <Card
            key={item.id}
            className="overflow-hidden transition-all hover:border-primary/40 hover:shadow-[0_6px_35px_hsl(var(--primary)/0.18)]"
          >
            <Link href={`/explore/${item.id}`} className="block">
              <Image
                src={item.image}
                alt={item.name}
                width={400}
                height={225}
                className="aspect-video h-auto w-full rounded-t-2xl object-cover"
                data-ai-hint={item.dataAiHint}
              />
            </Link>
            <CardHeader className="pb-2 pt-3">
              <Link href={`/explore/${item.id}`} className="hover:underline">
                <CardTitle className="line-clamp-1 font-headline text-lg">
                  {item.name}
                </CardTitle>
              </Link>
              <CardDescription className="text-xs">
                By {item.author} | Type: {item.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                Placeholder short description for {item.name}. Click to learn
                more about this amazing creation.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end py-3">
              <Link href={`/explore/${item.id}`} legacyBehavior>
                <Button asChild variant="outline" size="sm">
                  <a>View Details</a>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
