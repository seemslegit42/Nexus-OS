// src/app/(public)/contact-sales/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Envelope as Mail,
  CircleNotch as Loader2,
} from '@phosphor-icons/react'; // Added Loader2
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const contactSalesSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  companyEmail: z
    .string()
    .email({ message: 'Please enter a valid email address.' }),
  companyName: z
    .string()
    .min(2, { message: 'Company name must be at least 2 characters.' }),
  companySize: z.coerce
    .number()
    .min(1, { message: 'Company size must be at least 1.' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(500, { message: 'Message cannot exceed 500 characters.' }),
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
    console.log('Processing Contact Sales Form:', data);

    try {
      // Replace artificial delay with real async processing
      // In a real app, this would be an API call

      toast({
        title: 'Message Sent!',
        description:
          'Our sales team will get back to you shortly. Thank you for your interest in NexOS Platform.',
        variant: 'default',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Submission Error',
        description:
          'Could not send your message to sales. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader className="text-center">
            <Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
            <CardTitle className="font-headline text-3xl">
              Contact Sales
            </CardTitle>
            <CardDescription>
              Interested in our Enterprise plan or have custom requirements?
              <br />
              Let&apos;s talk about how NexOS Platform can help your
              organization.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Name"
                            {...field}
                            className="border-input bg-input focus:ring-primary"
                            disabled={isSubmitting}
                          />
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
                          <Input
                            type="email"
                            placeholder="work@example.com"
                            {...field}
                            className="border-input bg-input focus:ring-primary"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Company Inc."
                            {...field}
                            className="border-input bg-input focus:ring-primary"
                            disabled={isSubmitting}
                          />
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
                          <Input
                            type="number"
                            placeholder="e.g., 500"
                            {...field}
                            onChange={e =>
                              field.onChange(
                                e.target.value === ''
                                  ? ''
                                  : parseInt(e.target.value, 10)
                              )
                            }
                            className="border-input bg-input focus:ring-primary"
                            disabled={isSubmitting}
                          />
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
                          className="min-h-[120px] border-input bg-input focus:ring-primary"
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
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
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
