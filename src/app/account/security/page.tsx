
// src/app/account/security/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KeyRound, ShieldCheck, Smartphone, History, LogOut } from 'lucide-react';

// Placeholder data
const activeSessions = [
  { id: 'session_1', device: 'Chrome on macOS', ip: '192.168.1.101', lastActive: 'Current session', location: 'New York, USA' },
  { id: 'session_2', device: 'NexOS Mobile App on iOS', ip: '10.0.0.5', lastActive: '2 hours ago', location: 'Remote' },
];

export default function AccountSecurityPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-3xl font-headline text-foreground">Security Settings</h1>
        <p className="text-muted-foreground">Manage your password, two-factor authentication, and active sessions.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary"/> Change Password</CardTitle>
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
          <Button className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground">Update Password</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/> Two-Factor Authentication (2FA)</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor="2fa-status" className="font-medium">Authenticator App</Label>
              <p className="text-xs text-muted-foreground">Status: <span className="text-green-400">Enabled</span> (Google Authenticator)</p>
            </div>
            <Switch id="2fa-status" defaultChecked />
          </div>
           <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label htmlFor="sms-status" className="font-medium">SMS Backup</Label>
              <p className="text-xs text-muted-foreground">Status: <span className="text-muted-foreground">Disabled</span></p>
            </div>
            <Switch id="sms-status" />
          </div>
          <Button variant="outline"><Smartphone className="mr-2 h-4 w-4" /> Manage 2FA Devices</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><History className="mr-2 h-5 w-5 text-primary"/> Active Sessions</CardTitle>
          <CardDescription>Review and manage devices logged into your account.</CardDescription>
        </CardHeader>
        <CardContent>
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
              {activeSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.device}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{session.location} ({session.ip})</TableCell>
                  <TableCell>{session.lastActive}</TableCell>
                  <TableCell className="text-right">
                    {session.lastActive !== 'Current session' && 
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">Log Out</Button>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <Button variant="destructive" className="ml-auto"><LogOut className="mr-2 h-4 w-4" /> Log Out All Other Sessions</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
