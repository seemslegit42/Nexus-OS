
// src/app/home/items/[id]/builder/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Play, Palette, Settings2 } from 'lucide-react';
import Link from 'next/link';

export default function ItemBuilderPage({ params }: { params: { id: string } }) {
  // Placeholder item name
  const itemName = `Item ${params.id.substring(0,5)} Builder`;

  return (
    <div className="flex flex-col h-full p-1 md:p-2">
      <header className="flex justify-between items-center p-2 mb-2 border-b border-primary/25 bg-background/80 backdrop-blur-md rounded-xl shadow-[0_2px_15px_hsl(var(--primary)/0.1)]">
        <div className="flex items-center gap-2">
            <Link href={`/home/items/${params.id}`} legacyBehavior>
                <Button asChild variant="ghost" size="icon" className="h-8 w-8"><a><ArrowLeft /></a></Button>
            </Link>
            <h1 className="text-xl font-headline text-foreground">{itemName}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Save className="mr-2 h-4 w-4" /> Save</Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm"><Play className="mr-2 h-4 w-4" /> Run/Preview</Button>
        </div>
      </header>

      <div className="flex flex-grow gap-2 overflow-hidden">
        {/* Palette / Components Panel */}
        <Card className="w-1/4 lg:w-1/5 flex-shrink-0 h-full">
          <CardHeader className="p-2 border-b border-primary/25">
            <CardTitle className="text-sm font-headline flex items-center"><Palette className="mr-2 h-4 w-4 text-primary"/> Components</CardTitle>
          </CardHeader>
          <CardContent className="p-2 overflow-y-auto">
            <p className="text-xs text-muted-foreground">Drag & drop UI elements, logic blocks, data sources...</p>
            {/* Placeholder component items */}
            {['Button', 'Input Field', 'Data Table', 'API Connector', 'Logic Flow'].map(comp => (
              <div key={comp} className="p-2 my-1 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg text-xs cursor-grab hover:bg-accent/15 hover:border-accent/40 shadow-sm hover:shadow-md transition-all">{comp}</div>
            ))}
          </CardContent>
        </Card>

        {/* Canvas Area */}
        <Card className="flex-grow h-full flex items-center justify-center">
          <CardContent className="text-center">
            <p className="text-muted-foreground">Visual Builder Canvas for "{itemName}"</p>
            <p className="text-xs text-muted-foreground">Drag components here to build your item.</p>
          </CardContent>
        </Card>

        {/* Inspector / Properties Panel */}
        <Card className="w-1/4 lg:w-1/5 flex-shrink-0 h-full">
          <CardHeader className="p-2 border-b border-primary/25">
            <CardTitle className="text-sm font-headline flex items-center"><Settings2 className="mr-2 h-4 w-4 text-primary"/> Properties</CardTitle>
          </CardHeader>
          <CardContent className="p-2 overflow-y-auto">
            <p className="text-xs text-muted-foreground">Select a component on the canvas to see its properties.</p>
            {/* Placeholder properties */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
