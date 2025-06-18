// src/app/(public)/page.tsx (Landing Page)
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ArrowRight,
  CheckCircle,
  Cpu,
  Stack as Layers,
  Sparkle as Sparkles,
  Star,
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function LandingPage() {
  const features = [
    {
      icon: <Layers className="h-6 w-6 text-primary" />,
      title: 'Modular Architecture',
      description: 'Build and scale with reusable components and services.',
    },
    {
      icon: <Cpu className="h-6 w-6 text-primary" />,
      title: 'AI-Powered Agents',
      description: 'Automate tasks and workflows with intelligent agents.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: 'Visual Builder',
      description:
        'Design and configure your applications with an intuitive drag-and-drop interface.',
    },
  ];

  const testimonials = [
    {
      quote:
        'NexOS Platform has revolutionized how we approach SaaS development. The agent-native architecture is a game-changer for automation and scalability.',
      author: 'Dr. Elara Vance',
      role: 'CTO, Innovatech Solutions',
      avatar: 'https://placehold.co/80x80.png',
      dataAiHint: 'professional portrait woman',
    },
    {
      quote:
        'The visual builder combined with powerful AI agents allowed us to deploy complex workflows in days, not months. Truly impressive!',
      author: 'Marcus Chen',
      role: 'Lead Developer, Quantum Leap AI',
      avatar: 'https://placehold.co/80x80.png',
      dataAiHint: 'professional portrait man',
    },
    {
      quote:
        'As a startup, NexOS provided the enterprise-grade tools we needed to compete, without the enterprise-level overhead. The modularity is key for our agile development.',
      author: 'Sofia Al-Jamil',
      role: 'Founder, SparkUp SaaS',
      avatar: 'https://placehold.co/80x80.png',
      dataAiHint: 'startup founder portrait',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-headline text-4xl font-bold text-foreground md:text-6xl">
            Build, Automate, Scale with{' '}
            <span className="text-primary">NexOS Platform</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            The next-generation modular SaaS platform designed for developers
            and innovators. Create powerful applications, integrate intelligent
            agents, and scale effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" legacyBehavior>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <a>
                  Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </Link>
            <Link href="/explore" legacyBehavior>
              <Button asChild variant="outline" size="lg">
                <a>Explore Features</a>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-headline text-3xl font-semibold text-foreground">
            Why Choose NexOS Platform?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map(feature => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mb-2 flex justify-center">{feature.icon}</div>
                  <CardTitle className="font-headline text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works / Visual Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-semibold text-foreground">
            Seamless Development Experience
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            From idea to deployment, NexOS provides the tools you need to
            succeed.
          </p>
          <div className="overflow-hidden rounded-2xl border border-primary/25 shadow-[0_8px_40px_hsl(var(--primary)/0.15)]">
            <Image
              src="https://placehold.co/1200x600.png"
              alt="NexOS Platform Overview"
              width={1200}
              height={600}
              className="mx-auto object-cover"
              data-ai-hint="platform dashboard builder workflow"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-headline text-3xl font-semibold text-foreground">
            Loved by Innovators
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col">
                <CardContent className="flex-grow pb-4 pt-6">
                  <div className="mb-3 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="mb-4 italic text-muted-foreground">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </CardContent>
                <CardHeader className="flex flex-row items-center gap-3 pt-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      data-ai-hint={testimonial.dataAiHint}
                    />
                    <AvatarFallback>
                      {testimonial.author
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-semibold text-foreground">
                      {testimonial.author}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {testimonial.role}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden text-center">
            <CardContent className="p-8 md:p-12">
              <h2 className="mb-6 font-headline text-3xl font-semibold text-foreground">
                Ready to Innovate?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
                Join thousands of developers building the next wave of
                applications on NexOS.
              </p>
              <Link href="/register" legacyBehavior>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a>Sign Up Now & Start Building</a>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
