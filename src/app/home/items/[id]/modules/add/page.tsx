// src/app/home/items/[id]/modules/add/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  MagnifyingGlass as Search,
  PlusCircle,
  Eye,
  CircleNotch as Loader2,
} from '@phosphor-icons/react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'; // Added React and hooks

interface AvailableModule {
  id: string;
  name: string;
  category: string;
  description: string;
}

export default function AddModulesPage({ params }: { params: { id: string } }) {
  const [availableModules, setAvailableModules] = useState<AvailableModule[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const itemName = `Item ${params.id.substring(0, 5)}`; // Keep simple name generation

  // Remove mock data initialization - component should handle empty state
  // In a real app, this would fetch actual data from an API

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Link href={`/home/items/${params.id}/modules`} legacyBehavior>
        <Button asChild variant="outline" className="mb-2 self-start">
          <a>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Manage Modules for{' '}
            {itemName}
          </a>
        </Button>
      </Link>

      <header className="mb-4 flex flex-col items-center justify-between gap-2 md:flex-row">
        <h1 className="font-headline text-3xl text-foreground">
          Add Modules to {itemName}
        </h1>
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search modules (e.g., Auth, Payments)..."
            className="border-input bg-input pl-9 focus:ring-primary"
          />
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : availableModules.length === 0 ? (
        <Card className="py-10 text-center">
          <CardContent>
            <h2 className="mb-2 text-xl font-semibold">
              No modules available in the marketplace.
            </h2>
            <p className="text-muted-foreground">
              Check back later or ensure the module registry is populated.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {availableModules.map(mod => (
            <Card key={mod.id}>
              <CardHeader>
                <CardTitle className="font-headline">{mod.name}</CardTitle>
                <CardDescription>Category: {mod.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {mod.description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                >
                  <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                  Add to Item
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
