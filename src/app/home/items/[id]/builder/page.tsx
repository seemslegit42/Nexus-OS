// src/app/home/items/[id]/builder/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  FloppyDisk as Save,
  Play,
  Palette,
  GearSix as Settings2,
} from '@phosphor-icons/react';
import Link from 'next/link';

export default function ItemBuilderPage({
  params,
}: {
  params: { id: string };
}) {
  // Placeholder item name
  const itemName = `Item ${params.id.substring(0, 5)} Builder`;

  return (
    <div className="flex h-full flex-col p-1 md:p-2">
      <header className="mb-2 flex items-center justify-between rounded-xl border-b border-primary/25 bg-background/80 p-2 shadow-[0_2px_15px_hsl(var(--primary)/0.1)] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link href={`/home/items/${params.id}`} legacyBehavior>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8">
              <a>
                <ArrowLeft />
              </a>
            </Button>
          </Link>
          <h1 className="font-headline text-xl text-foreground">{itemName}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Play className="mr-2 h-4 w-4" /> Run/Preview
          </Button>
        </div>
      </header>

      <div className="flex flex-grow gap-2 overflow-hidden">
        {/* Palette / Components Panel */}
        <Card className="h-full w-1/4 flex-shrink-0 lg:w-1/5">
          <CardHeader className="border-b border-primary/25 p-2">
            <CardTitle className="flex items-center font-headline text-sm">
              <Palette className="mr-2 h-4 w-4 text-primary" /> Components
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto p-2">
            <p className="text-xs text-muted-foreground">
              Drag & drop UI elements, logic blocks, data sources...
            </p>
            {/* Placeholder component items */}
            {[
              'Button',
              'Input Field',
              'Data Table',
              'API Connector',
              'Logic Flow',
            ].map(comp => (
              <div
                key={comp}
                className="my-1 cursor-grab rounded-lg border border-primary/20 bg-card/50 p-2 text-xs shadow-sm backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-accent/15 hover:shadow-md"
              >
                {comp}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Canvas Area */}
        <Card className="flex h-full flex-grow items-center justify-center">
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Visual Builder Canvas for "{itemName}"
            </p>
            <p className="text-xs text-muted-foreground">
              Drag components here to build your item.
            </p>
          </CardContent>
        </Card>

        {/* Inspector / Properties Panel */}
        <Card className="h-full w-1/4 flex-shrink-0 lg:w-1/5">
          <CardHeader className="border-b border-primary/25 p-2">
            <CardTitle className="flex items-center font-headline text-sm">
              <Settings2 className="mr-2 h-4 w-4 text-primary" /> Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto p-2">
            <p className="text-xs text-muted-foreground">
              Select a component on the canvas to see its properties.
            </p>
            {/* Placeholder properties */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
