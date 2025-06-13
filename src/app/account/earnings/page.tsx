
// src/app/account/earnings/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, Download, CalendarDays, BarChart2 } from "lucide-react"; // Added BarChart2
// Assuming you might have chart components, import them if needed
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Placeholder data
const earningsSummary = {
  totalEarned: 1250.75,
  pendingPayout: 300.50,
  lastPayout: { date: '2023-10-15', amount: 950.25 },
};

const earningsBreakdown = [
  { month: 'Oct 2023', item: 'AI Content Writer Module', sales: 50, revenue: 175.00 },
  { month: 'Oct 2023', item: 'SaaS Admin Dashboard Template', sales: 20, revenue: 125.50 },
  { month: 'Sep 2023', item: 'AI Content Writer Module', sales: 45, revenue: 157.50 },
];

// const monthlyChartData = [
//   { name: 'Jul', earnings: 200 }, { name: 'Aug', earnings: 450 },
//   { name: 'Sep', earnings: 600 }, { name: 'Oct', earnings: 300.50 },
// ];

export default function AccountEarningsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="text-3xl font-headline text-foreground">Earnings Dashboard</h1>
        <p className="text-muted-foreground">Track your revenue from contributions to the NexOS ecosystem.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsSummary.totalEarned.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsSummary.pendingPayout.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">To be paid next cycle</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Payout</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsSummary.lastPayout.amount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">On {earningsSummary.lastPayout.date}</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Monthly Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center rounded-md">
          {/* 
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="earnings" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer> 
          */}
           <div className="text-center text-muted-foreground">
            <BarChart2 className="h-12 w-12 mx-auto opacity-50 mb-2" />
            <p>Monthly earnings chart placeholder.</p>
            <p className="text-xs">Chart integration coming soon.</p>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Earnings Breakdown</CardTitle>
          <CardDescription>Revenue from your submitted items, modules, and templates.</CardDescription>
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
                  <TableCell className="text-right">${earning.revenue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {earningsBreakdown.length === 0 && <p className="text-sm text-center py-4 text-muted-foreground">No earnings data available yet.</p>}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
