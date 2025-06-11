
// src/app/account/billing/page.tsx
'use client';

// Reusing existing billing page as it aligns with the SaaS context.
// No significant changes needed for this placeholder stage.
// It will be wrapped by the default src/app/layout.tsx which includes TopBar.

import { BillingPage as NexOSBillingPage } from '@/app/billing/page';

export default function AccountBillingPage() {
  // Directly render the existing, more detailed billing page content
  // as it's suitable for an account billing section.
  return <NexOSBillingPage />;
}

// If a simpler, distinct billing page was required for /account/billing,
// the content below would be a starting point:

/*
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download, PlusCircle } from "lucide-react";

// Placeholder data
const invoices = [
  { id: 'INV-2023-003', date: 'October 1, 2023', amount: '$99.00', status: 'Paid' },
  { id: 'INV-2023-002', date: 'September 1, 2023', amount: '$99.00', status: 'Paid' },
];

const paymentMethods = [
  { id: 'pm_1', type: 'Visa', last4: '4242', expiry: '12/25' },
];

export default function AccountBillingPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <header>
        <h1 className="text-3xl font-headline text-foreground">Billing & Usage</h1>
        <p className="text-muted-foreground">Manage your subscription, payment methods, and view invoices.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Current Plan</CardTitle>
          <CardDescription>You are currently on the <span className="text-primary font-semibold">Pro Plan</span>.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Monthly Cost: $99.00</p>
          <p className="text-sm">Next Billing Date: November 1, 2023</p>
          <p className="text-sm text-muted-foreground mt-2">Includes: Unlimited items, 10 team members, priority support.</p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline">Change Plan</Button>
          <Button variant="destructive">Cancel Subscription</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="font-headline">Payment Methods</CardTitle>
          <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Payment Method</Button>
        </CardHeader>
        <CardContent>
          {paymentMethods.map(pm => (
            <div key={pm.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pm.type} ending in {pm.last4}</p>
                  <p className="text-xs text-muted-foreground">Expires {pm.expiry}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
            </div>
          ))}
          {paymentMethods.length === 0 && <p className="text-sm text-muted-foreground">No payment methods on file.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell><span className="text-green-400">{invoice.status}</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {invoices.length === 0 && <p className="text-sm text-center py-4 text-muted-foreground">No invoices yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
*/
