
// src/app/home/items/[id]/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Settings, Layers, Code, Play } from "lucide-react";

export default function ItemManagementPage({ params }: { params: { id: string } }) {
  // Placeholder data - fetch item data based on params.id in a real app
  const item = {
    id: params.id,
    name: `Managed Item ${params.id.substring(0,5)}`,
    type: 'Application',
    status: 'Active',
    createdAt: new Date().toLocaleDateString(),
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Link href="/home/items" legacyBehavior>
        <Button asChild variant="outline" className="mb-2 self-start">
            <a><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Items</a>
        </Button>
      </Link>

      <header className="mb-4">
        <h1 className="text-3xl font-headline text-foreground">{item.name}</h1>
        <p className="text-muted-foreground">Type: {item.type} | Created: {item.createdAt}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Status: <span className="text-green-400 font-semibold">{item.status}</span></p>
            <p className="text-sm">Modules Attached: 3 (Placeholder)</p>
            <p className="text-sm">Last Deployed: Yesterday (Placeholder)</p>
          </CardContent>
           <CardFooter>
             <Button variant="outline" size="sm" className="w-full"><Play className="mr-2 h-4 w-4" /> Run/Deploy Item</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Builder/Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Access the visual builder or code editor for this item.</p>
          </CardContent>
          <CardFooter>
            <Link href={`/home/items/${item.id}/builder`} legacyBehavior>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <a><Code className="mr-2 h-4 w-4" /> Open Builder</a>
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Manage modules and integrations attached to this item.</p>
          </CardContent>
          <CardFooter>
            <Link href={`/home/items/${item.id}/modules`} legacyBehavior>
                <Button asChild variant="outline" className="w-full">
                    <a><Layers className="mr-2 h-4 w-4" /> Manage Modules</a>
                </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

      <section>
        <Card>
            <CardHeader><CardTitle className="font-headline text-lg">Settings & Configuration</CardTitle></CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Placeholder for item-specific settings like environment variables, domain settings, etc.</p>
            </CardContent>
            <CardFooter>
                <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Configure Item</Button>
            </CardFooter>
        </Card>
      </section>
    </div>
  );
}
