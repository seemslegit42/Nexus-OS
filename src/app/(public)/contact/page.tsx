
// src/app/(public)/contact/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, MessageSquare, MapPin, Twitter, Linkedin, Github, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Contact Us | NexOS Platform',
//   description: 'Get in touch with the NexOS Platform team. Send us a message, find our location, or connect on social media.',
// };

const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters."}),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000, { message: "Message cannot exceed 1000 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    console.log('General Contact Form Submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Message Received!",
      description: "Thank you for contacting us. We'll get back to you as soon as possible.",
    });
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have questions, feedback, or partnership inquiries? We&apos;d love to hear from you.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center">
                <MessageSquare className="h-6 w-6 text-primary mr-3" /> Send Us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and our team will respond shortly.
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
                            <Input placeholder="Your Full Name" {...field} className="bg-input border-input focus:ring-primary" disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} className="bg-input border-input focus:ring-primary" disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Regarding..." {...field} className="bg-input border-input focus:ring-primary" disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Let us know how we can help or what's on your mind..."
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
                    {isSubmitting ? 'Submitting...' : 'Send Message'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          {/* Contact Info & Socials */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" /> Our Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  NexOS Platform HQ<br />
                  1 Infinite Loop, Future City, FC 90210<br />
                  Metaverse Realm
                </p>
                {/* Placeholder for Map Embed */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">(Map Placeholder)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-headline">Connect With Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4 mr-2 text-primary" /> Follow on X (Twitter)
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2 text-primary" /> Connect on LinkedIn
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2 text-primary" /> View on GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

