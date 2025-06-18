// src/app/home/items/page.tsx
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
import {
  PlusCircle,
  PencilSimple as Edit,
  Trash,
  CircleNotch as Loader2,
} from '@phosphor-icons/react';
import React, { useState, useEffect } from 'react'; // Added React and hooks

interface UserItem {
  id: string;
  name: string;
  type: string;
  lastModified: string;
}

export default function ItemsListPage() {
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Remove mock data initialization - component should handle empty state
  // In a real app, this would fetch actual data from an API

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex items-center justify-between">
        <h1 className="font-headline text-3xl text-foreground">My Items</h1>
        <Link href="/home/items/new" legacyBehavior>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Item
            </a>
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : userItems.length === 0 ? (
        <Card className="py-10 text-center">
          <CardContent>
            <h2 className="mb-2 text-xl font-semibold">No items yet!</h2>
            <p className="mb-4 text-muted-foreground">
              Start by creating your first item.
            </p>
            <Link href="/home/items/new" legacyBehavior>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a>Create New Item</a>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userItems.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="font-headline">{item.name}</CardTitle>
                <CardDescription>
                  Type: {item.type} | Last Modified: {item.lastModified}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Placeholder content for item summary or stats. Real data would
                  be fetched.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link href={`/home/items/${item.id}`} legacyBehavior>
                  <Button asChild variant="outline" size="sm">
                    <a>
                      <Edit className="mr-2 h-3.5 w-3.5" /> Manage
                    </a>
                  </Button>
                </Link>
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-3.5 w-3.5" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
