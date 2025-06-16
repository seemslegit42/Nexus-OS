// src/app/(public)/contact-sales/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Loader2 } from 'lucide-react'; // Added Loader2
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const contactSalesSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  companyEmail: z.string().email({ message: "Please enter a valid email address." }),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  companySize: z.coerce.number().min(1, { message: "Company size must be at least 1." }).optional().or(z.literal('')), 
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500, { message: "Message cannot exceed 500 characters." }),
});

type ContactSalesFormValues = z.infer<typeof contactSalesSchema>;

export default function ContactSalesPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactSalesFormValues>({
    resolver: zodResolver(contactSalesSchema),
    defaultValues: {
      fullName: '',
      companyEmail: '',
      companyName: '',
      companySize: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactSalesFormValues) {
    setIsSubmitting(true);
    console.log('Simulating API Call for Contact Sales Form:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a random success/failure for demonstration
    if (Math.random() > 0.1) { // 90% success rate
        toast({
        title: "Message Sent!",
        description: "Our sales team will get back to you shortly. Thank you for your interest in NexOS Platform.",
        variant: "default",
        });
        form.reset(); 
    } else {
        toast({
        title: "Submission Error",
        description: "Could not send your message to sales. Please try again later.",
        variant: "destructive",
        });
    }
    setIsSubmitting(false);
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} className="bg-input border-input focus:ring-primary" disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="work@example.com" {...field} className="bg-input border-input focus:ring-primary" disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Company Inc." {...field} className="bg-input border-input focus:ring-primary" disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size (Approx. Employees)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 500" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))} className="bg-input border-input focus:ring-primary" disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How can we help you?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your needs, project requirements, or any questions you have..."
                          className="min-h-[120px] bg-input border-input focus:ring-primary"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
