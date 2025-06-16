// src/app/admin/reviews/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Eye, MessageCircle, Filter, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("pending");

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching submissions
    setTimeout(() => {
      const allSubmissions: Submission[] = [
        { id: 'sub_001', itemName: 'AI Powered Note Taker Module', itemType: 'Module', submitter: 'DevUser123', submittedDate: '2023-10-25', status: 'Pending' },
        { id: 'sub_002', itemName: 'E-commerce Site Template', itemType: 'Template', submitter: 'DesignerPro', submittedDate: '2023-10-24', status: 'Approved' },
        { id: 'sub_003', itemName: 'Automated Billing Service', itemType: 'Item', submitter: 'SaaSBuilder', submittedDate: '2023-10-23', status: 'Rejected', reason: 'Security concerns' },
        { id: 'sub_004', itemName: 'Social Media Scheduler', itemType: 'Item', submitter: 'MarketerGuru', submittedDate: '2023-10-22', status: 'Pending' },
      ];
      if (filterStatus === 'all') {
        setSubmissions(allSubmissions);
      } else {
        setSubmissions(allSubmissions.filter(sub => sub.status.toLowerCase() === filterStatus));
      }
      setIsLoading(false);
    }, 1000);
  }, [filterStatus]);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <h1 className="text-3xl font-headline text-foreground">Submission Reviews</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px] bg-input border-input focus:ring-primary">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto"><Filter className="mr-2 h-4 w-4" /> More Filters</Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Pending & Reviewed Submissions</CardTitle>
          <CardDescription>Approve or reject community contributions to the NexOS ecosystem.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <p className="text-sm text-center py-4 text-muted-foreground">No submissions matching current filters.</p>
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
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.itemName}</TableCell>
                    <TableCell>{sub.itemType}</TableCell>
                    <TableCell className="text-muted-foreground">{sub.submitter}</TableCell>
                    <TableCell className="text-muted-foreground">{sub.submittedDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        sub.status === 'Approved' ? 'bg-green-500/20 text-green-700' :
                        sub.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-700' :
                        'bg-red-500/20 text-red-700'
                      }`}>{sub.status}</span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Link href={`/explore/submit?id=${sub.id}`} passHref legacyBehavior> 
                          <Button asChild variant="ghost" size="icon" title="View Submission Details"><a target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4"/></a></Button>
                      </Link>
                      {sub.status === 'Pending' && (
                        <>
                          <Button variant="ghost" size="icon" title="Approve" className="text-green-500 hover:text-green-600"><CheckCircle2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" title="Reject" className="text-red-500 hover:text-red-600"><XCircle className="h-4 w-4" /></Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" title="Add Comment/Reason"><MessageCircle className="h-4 w-4" /></Button>
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
