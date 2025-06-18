// src/app/account/profile/page.tsx
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/lib/icons';
import React, { useState, useEffect } from 'react'; // Added React and hooks

interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
  avatarUrl: string;
  dataAiHint?: string;
  username: string;
  location: string;
  website: string;
}

export default function AccountProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Remove mock data initialization - component should handle empty state
  // In a real app, this would fetch actual data from an API

  if (isLoading) {
    return (
      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-6 p-4 md:p-6">
        <Icons.CircleNotch className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-6 p-4 md:p-6">
        <p className="text-destructive">Could not load user profile.</p>
      </div>
    );
  }

  // Placeholder for form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Simulate saving data
    console.log('Saving profile data:', userProfile);
    alert('Profile changes would be saved here.');
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="font-headline text-3xl text-foreground">
          Account Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={userProfile.avatarUrl}
                  alt={userProfile.fullName}
                  data-ai-hint={userProfile.dataAiHint}
                />
                <AvatarFallback>
                  {userProfile.fullName?.substring(0, 2).toUpperCase() || 'NX'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" type="button">
                <Camera className="mr-2 h-4 w-4" /> Change Avatar
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
              <Input
                id="email"
                type="email"
                defaultValue={userProfile.email}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here. Contact support for assistance.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                defaultValue={userProfile.bio}
                placeholder="Tell us a little about yourself..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  defaultValue={userProfile.location}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  defaultValue={userProfile.website}
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Preferences</CardTitle>
          <CardDescription>Customize your NexOS experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Placeholder for theme settings, notification preferences, language,
            etc. These would typically link to or be part of the main
            `/settings` page sections.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
