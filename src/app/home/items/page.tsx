
// src/app/home/items/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

// Placeholder data
const userItems = [
  { id: 'item_1', name: 'My First Project', type: 'Application', lastModified: '2023-10-26' },
  { id: 'item_2', name: 'Cool API Service', type: 'Service', lastModified: '2023-10-25' },
  { id: 'item_3', name: 'Automated Workflow', type: 'Workflow', lastModified: '2023-10-24' },
];

export default function ItemsListPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-headline text-foreground">My Items</h1>
        <Link href="/home/items/new" legacyBehavior>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <a><PlusCircle className="mr-2 h-4 w-4" /> Create New Item</a>
          </Button>
        </Link>
      </header>

      {userItems.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">No items yet!</h2>
            <p className="text-muted-foreground mb-4">Start by creating your first item.</p>
            <Link href="/home/items/new" legacyBehavior>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a>Create New Item</a>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userItems.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="font-headline">{item.name}</CardTitle>
                <CardDescription>Type: {item.type} | Last Modified: {item.lastModified}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Placeholder content for item summary or stats.</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/home/items/${item.id}`} legacyBehavior>
                  <Button asChild variant="outline" size="sm"><a><Edit className="mr-2 h-3.5 w-3.5" /> Manage</a></Button>
                </Link>
                <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
