
// src/app/(public)/explore/submit/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function SubmitItemPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <Link href="/explore" legacyBehavior>
        <Button asChild variant="outline" className="mb-6">
            <a><ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore</a>
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Submit Your Creation</CardTitle>
          <CardDescription>Share your item, module, or template with the NexOS community.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="creationName">Creation Name</Label>
            <Input id="creationName" placeholder="e.g., Awesome AI Assistant Module" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="creationType">Creation Type</Label>
            <Select>
              <SelectTrigger id="creationType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item">Item (Pre-built Application/Service)</SelectItem>
                <SelectItem value="module">Module (Reusable Component/Function)</SelectItem>
                <SelectItem value="template">Template (Starter Project/Configuration)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your creation, its features, and how to use it." className="min-h-[100px]" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repositoryUrl">Repository URL (e.g., GitHub)</Label>
            <Input id="repositoryUrl" placeholder="https://github.com/yourname/your-repo" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" placeholder="e.g., AI, Productivity, Utility" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="coverImage">Cover Image (URL or Upload)</Label>
            <Input id="coverImage" type="file" />
             <p className="text-xs text-muted-foreground">Or provide an image URL below:</p>
            <Input id="coverImageUrl" placeholder="https://example.com/image.png" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"><UploadCloud className="mr-2 h-4 w-4"/> Submit for Review</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

