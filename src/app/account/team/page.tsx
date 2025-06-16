// src/app/account/team/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Edit2, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react'; // Added React and hooks

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  dataAiHint?: string;
}

const availableRoles = ['Owner', 'Admin', 'Member', 'Billing Manager', 'Viewer'];

export default function AccountTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching team members data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setTeamMembers([
        { id: 'user_1', name: 'Alex Ryder', email: 'alex.ryder@nexos.ai', role: 'Owner', avatar: 'https://placehold.co/40x40.png?text=AR', dataAiHint:'user avatar' },
        { id: 'user_2', name: 'Devon Miles', email: 'devon@example.com', role: 'Admin', avatar: 'https://placehold.co/40x40.png?text=DM', dataAiHint:'user avatar' },
        { id: 'user_3', name: 'Casey Newton', email: 'casey@example.com', role: 'Member', avatar: 'https://placehold.co/40x40.png?text=CN', dataAiHint:'user avatar' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Placeholder for form submission
  const handleInviteMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Simulate inviting member
    alert("Member invitation logic would be here.");
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="text-3xl font-headline text-foreground">Team Management</h1>
        <p className="text-muted-foreground">Invite users to your organization and manage their roles.</p>
      </header>

      <Card>
        <form onSubmit={handleInviteMember}>
          <CardHeader>
            <CardTitle className="font-headline">Invite New Member</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 items-end">
            <div className="grid gap-1.5 md:col-span-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input id="inviteEmail" type="email" placeholder="Enter email address to invite" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="inviteRole">Role</Label>
              <Select>
                <SelectTrigger id="inviteRole">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => <SelectItem key={role} value={role.toLowerCase().replace(' ', '_')}>{role}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground"><UserPlus className="mr-2 h-4 w-4" /> Send Invitation</Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Current Team Members ({isLoading ? '...' : teamMembers.length})</CardTitle>
          <CardDescription>View and manage existing members of your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : teamMembers.length === 0 ? (
            <p className="text-sm text-center py-4 text-muted-foreground">No team members yet. Invite someone to collaborate!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.dataAiHint} />
                          <AvatarFallback>{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      <Select defaultValue={member.role.toLowerCase().replace(' ', '_')} disabled={member.role === 'Owner'}>
                          <SelectTrigger className="h-8 text-xs w-[150px] disabled:opacity-100 disabled:border-transparent disabled:bg-transparent disabled:cursor-default">
                              <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                              {availableRoles.filter(r => r !== 'Owner').map(role => <SelectItem key={role} value={role.toLowerCase().replace(' ', '_')}>{role}</SelectItem>)}
                          </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      {member.role !== 'Owner' && (
                        <>
                          <Button variant="ghost" size="icon" title="Edit Role (Placeholder - uses Select above)">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Remove Member" className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {member.role === 'Owner' && (
                          <ShieldCheck className="h-5 w-5 text-primary inline-block" title="Organization Owner"/>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
