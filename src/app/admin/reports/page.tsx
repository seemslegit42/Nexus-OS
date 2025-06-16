// src/app/admin/reports/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Filter, MessageSquare, ShieldOff, CheckSquare, Loader2 } from 'lucide-react'; // Added CheckSquare
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface ReportedContent {
  id: string;
  itemId: string;
  itemName: string;
  itemType: 'Module' | 'Template' | 'User Profile' | 'Item';
  reporter: string;
  reason: string;
  reportedDate: string;
  status: 'Open' | 'In Progress' | 'Resolved - Action Taken' | 'Resolved - User Suspended' | 'Resolved - No Action';
}

export default function AdminReportsPage() {
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("open");

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching reported content based on filterStatus
    setTimeout(() => {
      const allReports: ReportedContent[] = [
        { id: 'report_1', itemId: 'item_X', itemName: 'Suspicious AI Module', itemType: 'Module', reporter: 'UserAlpha', reason: 'Potential malware detected.', reportedDate: '2023-10-26', status: 'Open' },
        { id: 'report_2', itemId: 'item_Y', itemName: 'Misleading Template Description', itemType: 'Template', reporter: 'UserBeta', reason: 'Template does not match preview.', reportedDate: '2023-10-25', status: 'Resolved - Action Taken' },
        { id: 'report_3', itemId: 'user_Z', itemName: 'Spam Activity from UserZ', itemType: 'User Profile', reporter: 'AdminSys', reason: 'Multiple spam submissions.', reportedDate: '2023-10-24', status: 'Resolved - User Suspended' },
        { id: 'report_4', itemId: 'item_A', itemName: 'Copyright Infringement', itemType: 'Item', reporter: 'UserGamma', reason: 'Uses copyrighted assets without permission.', reportedDate: '2023-10-27', status: 'In Progress' },
      ];
      if (filterStatus === 'all') {
        setReportedContent(allReports);
      } else {
        setReportedContent(allReports.filter(report => report.status.toLowerCase().replace(/\s+/g, '_').startsWith(filterStatus)));
      }
      setIsLoading(false);
    }, 1000);
  }, [filterStatus]);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <h1 className="text-3xl font-headline text-foreground">Content Reports</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px] bg-input border-input focus:ring-primary">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved (All)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto"><Filter className="mr-2 h-4 w-4" /> More Filters</Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Content & User Reports</CardTitle>
          <CardDescription>Review and take action on reported items, modules, templates, or users.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : reportedContent.length === 0 ? (
            <p className="text-sm text-center py-4 text-muted-foreground">No reports matching current filters.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reported Item/User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reported On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportedContent.map((report) => (
                  <TableRow key={report.id} className={report.status === 'Open' ? 'bg-yellow-500/10' : ''}>
                    <TableCell className="font-medium">{report.itemName}</TableCell>
                    <TableCell>{report.itemType}</TableCell>
                    <TableCell className="text-muted-foreground">{report.reporter}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate" title={report.reason}>{report.reason}</TableCell>
                    <TableCell className="text-muted-foreground">{report.reportedDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        report.status === 'Open' ? 'bg-yellow-500/20 text-yellow-700' :
                        report.status.startsWith('Resolved') ? 'bg-green-500/20 text-green-700' :
                        'bg-blue-500/20 text-blue-700' // In Progress
                      }`}>{report.status}</span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Link href={report.itemType !== 'User Profile' ? `/explore/${report.itemId}` : `/admin/users?search=${report.itemName}`} passHref legacyBehavior>
                          <Button asChild variant="ghost" size="icon" title="View Item/User"><a target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4"/></a></Button>
                      </Link>
                      {report.status === 'Open' && (
                        <>
                          <Button variant="ghost" size="icon" title="Mark as Resolved" className="text-green-500 hover:text-green-600"><CheckSquare className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" title="Take Down Content / Suspend User" className="text-red-500 hover:text-red-600"><ShieldOff className="h-4 w-4" /></Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" title="Add Internal Note"><MessageSquare className="h-4 w-4" /></Button>
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
