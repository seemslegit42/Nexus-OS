// src/app/account/earnings/page.tsx
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icons } from '@/lib/icons';
import React, { useState, useEffect } from 'react'; // Added React and hooks

interface EarningsSummary {
  totalEarned: number;
  pendingPayout: number;
  lastPayout: { date: string; amount: number };
}

interface EarningBreakdownItem {
  month: string;
  item: string;
  sales: number;
  revenue: number;
}

export default function AccountEarningsPage() {
  const [earningsSummary, setEarningsSummary] =
    useState<EarningsSummary | null>(null);
  const [earningsBreakdown, setEarningsBreakdown] = useState<
    EarningBreakdownItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Remove mock data initialization - component should handle empty state
  // In a real app, this would fetch actual data from an API

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 p-4 md:p-6">
        <Icons.CircleNotch className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading earnings data...</p>
      </div>
    );
  }

  if (!earningsSummary) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 p-4 md:p-6">
        <p className="text-destructive">Could not load earnings data.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="font-headline text-3xl text-foreground">
          Earnings Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your revenue from contributions to the NexOS ecosystem.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earningsSummary.totalEarned.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payout
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earningsSummary.pendingPayout.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              To be paid next cycle
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Payout</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earningsSummary.lastPayout.amount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              On {earningsSummary.lastPayout.date}
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Monthly Earnings Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center rounded-md">
          <div className="text-center text-muted-foreground">
            <BarChart2 className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>Monthly earnings chart placeholder.</p>
            <p className="text-xs">Chart integration coming soon.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Earnings Breakdown</CardTitle>
          <CardDescription>
            Revenue from your submitted items, modules, and templates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningsBreakdown.map((earning, index) => (
                <TableRow key={index}>
                  <TableCell>{earning.month}</TableCell>
                  <TableCell className="font-medium">{earning.item}</TableCell>
                  <TableCell className="text-right">{earning.sales}</TableCell>
                  <TableCell className="text-right">
                    ${earning.revenue.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {earningsBreakdown.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No earnings data available yet.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
