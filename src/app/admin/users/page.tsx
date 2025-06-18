// src/app/admin/users/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/lib/icons';
import React, { useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastLogin: string;
  avatar: string;
  dataAiHint?: string;
}

const availableRoles = [
  'Owner',
  'Admin',
  'Member',
  'Billing Manager',
  'Viewer',
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Remove mock data initialization - component should handle empty state
  // In a real app, this would fetch actual data from an API

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="mb-4 flex flex-col items-center justify-between gap-2 md:flex-row">
        <h1 className="font-headline text-3xl text-foreground">
          User Management
        </h1>
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <div className="relative flex-grow sm:min-w-[250px] sm:flex-grow-0">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users (name, email, role)..."
              className="w-full border-input bg-input pl-9 focus:ring-primary"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full border-input bg-input focus:ring-primary sm:w-[150px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {availableRoles.map(role => (
                <SelectItem
                  key={role}
                  value={role.toLowerCase().replace(' ', '_')}
                >
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({isLoading ? '...' : users.length})</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and status within the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No users found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar}
                            alt={user.name}
                            data-ai-hint={user.dataAiHint}
                          />
                          <AvatarFallback>
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role.toLowerCase().replace(' ', '_')}
                        disabled={user.role === 'Owner'}
                      >
                        <SelectTrigger className="h-8 w-[150px] text-xs disabled:cursor-default disabled:border-transparent disabled:bg-transparent disabled:opacity-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRoles
                            .filter(r => r !== 'Owner')
                            .map(role => (
                              <SelectItem
                                key={role}
                                value={role.toLowerCase().replace(' ', '_')}
                              >
                                {role}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          user.status === 'Active'
                            ? 'bg-green-500/20 text-green-700'
                            : user.status === 'Invited'
                              ? 'bg-blue-500/20 text-blue-700'
                              : 'bg-red-500/20 text-red-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role !== 'Owner' && (
                        <>
                          <Button variant="ghost" size="icon" title="Edit User">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={
                              user.status === 'Suspended'
                                ? 'Unsuspend User'
                                : 'Suspend User'
                            }
                            className={
                              user.status === 'Suspended'
                                ? 'text-green-500'
                                : 'text-yellow-600'
                            }
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete User"
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {user.role === 'Owner' && (
                        <ShieldCheck
                          className="inline-block h-5 w-5 text-primary"
                          title="Platform Owner"
                        />
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
