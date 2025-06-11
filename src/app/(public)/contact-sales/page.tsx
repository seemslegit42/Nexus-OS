
// src/app/(public)/contact-sales/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Users, Mail } from 'lucide-react';

export default function ContactSalesPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl font-headline">Contact Sales</CardTitle>
            <CardDescription>
              Interested in our Enterprise plan or have custom requirements? 
              <br />
              Let&apos;s talk about how NexOS Platform can help your organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Your Name" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input id="companyEmail" type="email" placeholder="work@example.com" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="Your Company Inc." />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="companySize">Company Size (Approx. Employees)</Label>
                <Input id="companySize" type="number" placeholder="e.g., 500" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="message">How can we help you?</Label>
              <Textarea id="message" placeholder="Tell us about your needs, project requirements, or any questions you have..." className="min-h-[120px]" />
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Send Message</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
