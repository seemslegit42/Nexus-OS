// src/app/admin/reviews/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Icons } from '@/lib/icons';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface Submission {
  id: string;
  itemName: string;
  itemType: 'Module' | 'Template' | 'Item';
  submitter: string;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string; // Only for rejected status
}

export default function AdminReviewsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  // Remove mock data initialization - component should handle empty state
  // In a real app, this would fetch actual data from an API based on filterStatus

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="mb-4 flex flex-col items-center justify-between gap-2 md:flex-row">
        <h1 className="font-headline text-3xl text-foreground">
          Submission Reviews
        </h1>
        <div className="flex w-full gap-2 md:w-auto">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full border-input bg-input focus:ring-primary md:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Pending & Reviewed Submissions</CardTitle>
          <CardDescription>
            Approve or reject community contributions to the NexOS ecosystem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No submissions matching current filters.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.itemName}
                    </TableCell>
                    <TableCell>{sub.itemType}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {sub.submitter}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sub.submittedDate}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          sub.status === 'Approved'
                            ? 'bg-green-500/20 text-green-700'
                            : sub.status === 'Pending'
                              ? 'bg-yellow-500/20 text-yellow-700'
                              : 'bg-red-500/20 text-red-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-1 text-right">
                      <Link
                        href={`/explore/submit?id=${sub.id}`}
                        passHref
                        legacyBehavior
                      >
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          title="View Submission Details"
                        >
                          <a target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </Link>
                      {sub.status === 'Pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Approve"
                            className="text-green-500 hover:text-green-600"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Reject"
                            className="text-red-500 hover:text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Add Comment/Reason"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
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
