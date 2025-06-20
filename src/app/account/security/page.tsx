// src/app/account/security/page.tsx
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
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icons } from '@/lib/icons';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

interface ActiveSession {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  location: string;
}

export default function AccountSecurityPage() {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Remove mock data initialization - component should handle empty state
  // In a real app, this would fetch actual data from an API

  const innerCardClassName =
    'bg-card/70 backdrop-blur-sm border-primary/20 rounded-xl p-3 shadow-lg hover:border-primary/30 transition-all';

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="font-headline text-3xl text-foreground">
          Security Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your password, two-factor authentication, and active sessions.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center font-headline">
            <KeyRound className="mr-2 h-5 w-5 text-primary" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input id="confirmNewPassword" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
            Update Password
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center font-headline">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Two-Factor
            Authentication (2FA)
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              innerCardClassName,
              'flex items-center justify-between'
            )}
          >
            <div>
              <Label htmlFor="2fa-status" className="font-medium">
                Authenticator App
              </Label>
              <p className="text-xs text-muted-foreground">
                Status: <span className="text-green-400">Enabled</span> (Google
                Authenticator)
              </p>
            </div>
            <Switch id="2fa-status" defaultChecked />
          </div>
          <div
            className={cn(
              innerCardClassName,
              'flex items-center justify-between'
            )}
          >
            <div>
              <Label htmlFor="sms-status" className="font-medium">
                SMS Backup
              </Label>
              <p className="text-xs text-muted-foreground">
                Status: <span className="text-muted-foreground">Disabled</span>
              </p>
            </div>
            <Switch id="sms-status" />
          </div>
          <Button variant="outline">
            <Smartphone className="mr-2 h-4 w-4" /> Manage 2FA Devices
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center font-headline">
            <History className="mr-2 h-5 w-5 text-primary" /> Active Sessions
          </CardTitle>
          <CardDescription>
            Review and manage devices logged into your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeSessions.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No active sessions found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location / IP</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeSessions.map(session => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.device}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {session.location} ({session.ip})
                    </TableCell>
                    <TableCell>{session.lastActive}</TableCell>
                    <TableCell className="text-right">
                      {session.lastActive !== 'Current session' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                        >
                          Log Out
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="ml-auto">
            <LogOut className="mr-2 h-4 w-4" /> Log Out All Other Sessions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
