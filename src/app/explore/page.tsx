
// src/app/explore/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search, Filter, Sparkles, UploadCloud } from "lucide-react";
import Image from "next/image";

// Placeholder data
const exploreItems = [
  { id: 'tpl_agency_site', name: 'Modern Agency Template', type: 'Template', author: 'CreativeStudio', image: 'https://placehold.co/400x300.png', dataAiHint: 'website template agency' },
  { id: 'mod_ai_writer', name: 'AI Content Writer Module', type: 'Module', author: 'AIBuilders', image: 'https://placehold.co/400x300.png', dataAiHint: 'ai writing module' },
  { id: 'item_portfolio_gallery', name: 'Photography Portfolio Site', type: 'Item', author: 'PhotoPro', image: 'https://placehold.co/400x300.png', dataAiHint: 'photo gallery website' },
  { id: 'tpl_saas_dashboard', name: 'SaaS Admin Dashboard', type: 'Template', author: 'SaaSWorks', image: 'https://placehold.co/400x300.png', dataAiHint: 'dashboard template saas' },
];

export default function ExplorePage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-3xl font-headline text-foreground">Explore NexOS Ecosystem</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:min-w-[300px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search items, modules, templates..." className="pl-9 w-full" />
            </div>
            <Button variant="outline" className="w-full sm:w-auto"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
            <Link href="/explore/submit" legacyBehavior>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
                    <a><UploadCloud className="mr-2 h-4 w-4" /> Submit Your Creation</a>
                </Button>
            </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {exploreItems.map(item => (
          <Card key={item.id} className="overflow-hidden hover:shadow-[0_6px_35px_hsl(var(--primary)/0.18)] hover:border-primary/40 transition-all">
            <Link href={`/explore/${item.id}`} className="block">
              <Image src={item.image} alt={item.name} width={400} height={225} className="w-full h-auto object-cover aspect-video rounded-t-2xl" data-ai-hint={item.dataAiHint} />
            </Link>
            <CardHeader className="pt-3 pb-2">
              <Link href={`/explore/${item.id}`} className="hover:underline">
                <CardTitle className="font-headline text-lg line-clamp-1">{item.name}</CardTitle>
              </Link>
              <CardDescription className="text-xs">By {item.author} | Type: {item.type}</CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-muted-foreground line-clamp-2">Placeholder short description for {item.name}. Click to learn more about this amazing creation.</p>
            </CardContent>
            <CardFooter className="py-3 flex justify-end">
              <Link href={`/explore/${item.id}`} legacyBehavior>
                <Button asChild variant="outline" size="sm"><a>View Details</a></Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
