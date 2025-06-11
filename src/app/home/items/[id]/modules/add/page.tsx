
// src/app/home/items/[id]/modules/add/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, PlusCircle, Eye } from 'lucide-react';
import Link from 'next/link';

// Placeholder data
const availableModules = [
  { id: 'mod_auth', name: 'Advanced Authentication', category: 'Security', description: 'Adds OAuth, MFA, and SSO capabilities.' },
  { id: 'mod_db', name: 'Database Connector', category: 'Data', description: 'Connect to various SQL and NoSQL databases.' },
  { id: 'mod_email', name: 'Email Service Integration', category: 'Communication', description: 'Send transactional and marketing emails.' },
  { id: 'mod_payments', name: 'Payment Gateway', category: 'Monetization', description: 'Integrate Stripe or PayPal for payments.' },
];

export default function AddModulesPage({ params }: { params: { id: string } }) {
  const itemName = `Item ${params.id.substring(0,5)}`;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Link href={`/home/items/${params.id}/modules`} legacyBehavior>
        <Button asChild variant="outline" className="mb-2 self-start">
            <a><ArrowLeft className="mr-2 h-4 w-4" /> Back to Manage Modules for {itemName}</a>
        </Button>
      </Link>

      <header className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <h1 className="text-3xl font-headline text-foreground">Add Modules to {itemName}</h1>
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search modules (e.g., Auth, Payments)..." className="pl-9 bg-input border-input focus:ring-primary" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {availableModules.map(mod => (
          <Card key={mod.id}>
            <CardHeader>
              <CardTitle className="font-headline">{mod.name}</CardTitle>
              <CardDescription>Category: {mod.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{mod.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="text-xs"><Eye className="mr-1.5 h-3.5 w-3.5"/>Preview</Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"><PlusCircle className="mr-1.5 h-3.5 w-3.5"/>Add to Item</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
