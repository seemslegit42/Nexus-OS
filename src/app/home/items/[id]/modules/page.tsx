
// src/app/home/items/[id]/modules/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PlusCircle, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Placeholder data
const attachedModules = [
  { id: 'module_A', name: 'Authentication Module', version: '1.2.0', status: 'Active' },
  { id: 'module_B', name: 'Data Processing Unit', version: '0.9.5', status: 'Needs Configuration' },
  { id: 'module_C', name: 'Real-time Analytics Engine', version: '2.1.0', status: 'Active' },
];

export default function ItemModulesPage({ params }: { params: { id: string } }) {
  const itemName = `Item ${params.id.substring(0,5)}`;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Link href={`/home/items/${params.id}`} legacyBehavior>
        <Button asChild variant="outline" className="mb-2 self-start">
            <a><ArrowLeft className="mr-2 h-4 w-4" /> Back to {itemName}</a>
        </Button>
      </Link>

      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-headline text-foreground">Manage Modules for {itemName}</h1>
        <Link href={`/home/items/${params.id}/modules/add`} legacyBehavior>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <a><PlusCircle className="mr-2 h-4 w-4" /> Add Module</a>
          </Button>
        </Link>
      </header>

      {attachedModules.length === 0 ? (
         <Card className="text-center py-10">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">No modules attached yet.</h2>
            <p className="text-muted-foreground mb-4">Enhance your item by adding modules.</p>
            <Link href={`/home/items/${params.id}/modules/add`} legacyBehavior>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a>Add Module</a>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {attachedModules.map(mod => (
            <Card key={mod.id}>
              <CardHeader>
                <CardTitle className="font-headline">{mod.name}</CardTitle>
                <CardDescription>Version: {mod.version} | Status: <span className={mod.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}>{mod.status}</span></CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Placeholder description for the module and its function within this item.</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm"><Settings className="mr-2 h-3.5 w-3.5" /> Configure</Button>
                <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-3.5 w-3.5" /> Remove</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
