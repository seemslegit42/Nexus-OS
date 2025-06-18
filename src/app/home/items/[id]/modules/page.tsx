// src/app/home/items/[id]/modules/page.tsx
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
import {
  ArrowLeft,
  PlusCircle,
  Gear as Settings,
  Trash,
  CircleNotch as Loader2,
} from '@phosphor-icons/react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'; // Added React and hooks

interface AttachedModule {
  id: string;
  name: string;
  version: string;
  status: string;
}

export default function ItemModulesPage({
  params,
}: {
  params: { id: string };
}) {
  const [attachedModules, setAttachedModules] = useState<AttachedModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemName = `Item ${params.id.substring(0, 5)}`; // Keep this simple name generation

  // Remove mock data initialization - component should handle empty state
  // In a real app, this would fetch actual data from an API

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Link href={`/home/items/${params.id}`} legacyBehavior>
        <Button asChild variant="outline" className="mb-2 self-start">
          <a>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {itemName}
          </a>
        </Button>
      </Link>

      <header className="flex items-center justify-between">
        <h1 className="font-headline text-3xl text-foreground">
          Manage Modules for {itemName}
        </h1>
        <Link href={`/home/items/${params.id}/modules/add`} legacyBehavior>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Module
            </a>
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : attachedModules.length === 0 ? (
        <Card className="py-10 text-center">
          <CardContent>
            <h2 className="mb-2 text-xl font-semibold">
              No modules attached yet.
            </h2>
            <p className="mb-4 text-muted-foreground">
              Enhance your item by adding modules.
            </p>
            <Link href={`/home/items/${params.id}/modules/add`} legacyBehavior>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a>Add Module</a>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {attachedModules.map(mod => (
            <Card key={mod.id}>
              <CardHeader>
                <CardTitle className="font-headline">{mod.name}</CardTitle>
                <CardDescription>
                  Version: {mod.version} | Status:{' '}
                  <span
                    className={
                      mod.status === 'Active'
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }
                  >
                    {mod.status}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Module functionality and configuration options would appear
                  here.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-3.5 w-3.5" /> Configure
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
