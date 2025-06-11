
// src/app/home/items/new/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewItemPage() {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Link href="/home/items" legacyBehavior>
        <Button asChild variant="outline" className="mb-4">
          <a><ArrowLeft className="mr-2 h-4 w-4" /> Back to Items</a>
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create New Item</CardTitle>
          <CardDescription>Configure your new item for the NexOS platform.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input id="itemName" placeholder="e.g., My Awesome App" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="itemType">Item Type</Label>
            <Select>
              <SelectTrigger id="itemType">
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="workflow">Workflow</SelectItem>
                <SelectItem value="agent_skill">Agent Skill</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="itemDescription">Description (Optional)</Label>
            <Input id="itemDescription" placeholder="A brief description of your item" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Create Item</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
