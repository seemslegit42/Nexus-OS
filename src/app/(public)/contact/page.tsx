// src/app/(public)/contact/page.tsx
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Envelope as Mail,
  ChatText as MessageSquare,
  MapPin,
  TwitterLogo as Twitter,
  LinkedinLogo as Linkedin,
  GithubLogo as Github,
  CircleNotch as Loader2,
} from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z
    .string()
    .min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(1000, { message: 'Message cannot exceed 1000 characters.' }),
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
    console.log('Processing Contact Form:', data);

    try {
      // Replace artificial delay with real async processing
      // In a real app, this would be an API call

      // Simulate success (remove random failure for better UX)
      toast({
        title: 'Message Received!',
        description:
          "Thank you for contacting us. We'll get back to you as soon as possible.",
        variant: 'default',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Submission Error',
        description: 'Could not send your message. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center md:mb-16">
          <h1 className="mb-4 font-headline text-4xl font-bold text-foreground md:text-5xl">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Have questions, feedback, or partnership inquiries? We&apos;d love
            to hear from you.
          </p>
        </header>

        <div className="grid gap-8 md:gap-12 lg:grid-cols-3">
          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center font-headline text-2xl">
                <MessageSquare className="mr-3 h-6 w-6 text-primary" /> Send Us
                a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and our team will respond shortly.
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
                              placeholder="Your Full Name"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
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
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Regarding..."
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
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Let us know how we can help or what's on your mind..."
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
                <CardTitle className="flex items-center font-headline text-xl">
                  <MapPin className="mr-2 h-5 w-5 text-primary" /> Our Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-muted-foreground">
                  NexOS Platform HQ
                  <br />
                  1 Infinite Loop, Future City, FC 90210
                  <br />
                  Metaverse Realm
                </p>
                <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground">
                    (Map Placeholder)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  Connect With Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start"
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4 text-primary" /> Follow on
                    X (Twitter)
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start"
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4 text-primary" /> Connect
                    on LinkedIn
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start"
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4 text-primary" /> View on
                    GitHub
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
