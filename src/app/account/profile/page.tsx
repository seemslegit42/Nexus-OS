
// src/app/account/profile/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save, Camera } from 'lucide-react';

export default function AccountProfilePage() {
  // Placeholder data
  const userProfile = {
    fullName: 'Alex Ryder',
    email: 'alex.ryder@nexos.ai',
    bio: 'AI enthusiast and developer building the future with NexOS. Passionate about modular systems and intelligent agents.',
    avatarUrl: 'https://placehold.co/128x128.png',
    dataAiHint: 'user avatar placeholder',
    username: 'alex_ryder_nexos',
    location: 'Cyberspace',
    website: 'https://nexos.ai',
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-3xl font-headline text-foreground">Account Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.fullName} data-ai-hint={userProfile.dataAiHint} />
              <AvatarFallback>{userProfile.fullName?.substring(0,2).toUpperCase() || 'NX'}</AvatarFallback>
            </Avatar>
            <Button variant="outline"><Camera className="mr-2 h-4 w-4" /> Change Avatar</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={userProfile.fullName} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue={userProfile.username} />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={userProfile.email} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support for assistance.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" defaultValue={userProfile.bio} placeholder="Tell us a little about yourself..." className="min-h-[100px]" />
          </div>

           <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue={userProfile.location} placeholder="e.g., San Francisco, CA" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website URL</Label>
              <Input id="website" type="url" defaultValue={userProfile.website} placeholder="https://your-website.com" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        </CardFooter>
      </Card>

      {/* Placeholder for Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Preferences</CardTitle>
          <CardDescription>Customize your NexOS experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Placeholder for theme settings, notification preferences, language, etc. These would typically link to or be part of the main `/settings` page sections.</p>
        </CardContent>
      </Card>
    </div>
  );
}
