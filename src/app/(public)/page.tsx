// src/app/(public)/page.tsx (Landing Page)
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Cpu, Layers, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function LandingPage() {
  const features = [
    { icon: <Layers className="h-6 w-6 text-primary" />, title: "Modular Architecture", description: "Build and scale with reusable components and services." },
    { icon: <Cpu className="h-6 w-6 text-primary" />, title: "AI-Powered Agents", description: "Automate tasks and workflows with intelligent agents." },
    { icon: <Sparkles className="h-6 w-6 text-primary" />, title: "Visual Builder", description: "Design and configure your applications with an intuitive drag-and-drop interface." },
  ];

  const testimonials = [
    {
      quote: "NexOS Platform has revolutionized how we approach SaaS development. The agent-native architecture is a game-changer for automation and scalability.",
      author: "Dr. Elara Vance",
      role: "CTO, Innovatech Solutions",
      avatar: "https://placehold.co/80x80.png",
      dataAiHint: "professional portrait woman",
    },
    {
      quote: "The visual builder combined with powerful AI agents allowed us to deploy complex workflows in days, not months. Truly impressive!",
      author: "Marcus Chen",
      role: "Lead Developer, Quantum Leap AI",
      avatar: "https://placehold.co/80x80.png",
      dataAiHint: "professional portrait man",
    },
    {
      quote: "As a startup, NexOS provided the enterprise-grade tools we needed to compete, without the enterprise-level overhead. The modularity is key for our agile development.",
      author: "Sofia Al-Jamil",
      role: "Founder, SparkUp SaaS",
      avatar: "https://placehold.co/80x80.png",
      dataAiHint: "startup founder portrait",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground mb-6">
            Build, Automate, Scale with <span className="text-primary">NexOS Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The next-generation modular SaaS platform designed for developers and innovators.
            Create powerful applications, integrate intelligent agents, and scale effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" legacyBehavior>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <a>Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></a>
                </Button>
            </Link>
            <Link href="/explore" legacyBehavior>
                <Button asChild variant="outline" size="lg"><a>Explore Features</a></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline text-center font-semibold text-foreground mb-12">Why Choose NexOS Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(feature => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                    <div className="flex justify-center mb-2">{feature.icon}</div>
                    <CardTitle className="text-xl font-semibold font-headline text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works / Visual Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline text-center font-semibold text-foreground mb-8">Seamless Development Experience</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            From idea to deployment, NexOS provides the tools you need to succeed.
          </p>
          <div className="rounded-2xl shadow-[0_8px_40px_hsl(var(--primary)/0.15)] overflow-hidden border border-primary/25">
            <Image src="https://placehold.co/1200x600.png" alt="NexOS Platform Overview" width={1200} height={600} className="mx-auto object-cover" data-ai-hint="platform dashboard builder workflow" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline text-center font-semibold text-foreground mb-12">Loved by Innovators</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col">
                <CardContent className="pt-6 pb-4 flex-grow">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-4">&quot;{testimonial.quote}&quot;</p>
                </CardContent>
                <CardHeader className="pt-0 flex flex-row items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} data-ai-hint={testimonial.dataAiHint} />
                        <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-sm font-semibold text-foreground">{testimonial.author}</CardTitle>
                        <CardDescription className="text-xs">{testimonial.role}</CardDescription>
                    </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

       {/* Call to Action Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
            <Card className="text-center overflow-hidden">
                 <CardContent className="p-8 md:p-12">
                    <h2 className="text-3xl font-headline font-semibold text-foreground mb-6">Ready to Innovate?</h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                        Join thousands of developers building the next wave of applications on NexOS.
                    </p>
                    <Link href="/register" legacyBehavior>
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
