
// src/app/(public)/page.tsx (Landing Page)
'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Cpu, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const features = [
    { icon: <Layers className="h-6 w-6 text-primary" />, title: "Modular Architecture", description: "Build and scale with reusable components and services." },
    { icon: <Cpu className="h-6 w-6 text-primary" />, title: "AI-Powered Agents", description: "Automate tasks and workflows with intelligent agents." },
    { icon: <Sparkles className="h-6 w-6 text-primary" />, title: "Visual Builder", description: "Design and configure your applications with an intuitive drag-and-drop interface." },
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
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline text-center font-semibold text-foreground mb-12">Why Choose NexOS Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(feature => (
              <div key={feature.title} className="bg-card p-6 rounded-lg shadow-lg text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold font-headline text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
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
          <Image src="https://placehold.co/1200x600.png?text=NexOS+Platform+Visual+Overview" alt="NexOS Platform Overview" width={1200} height={600} className="rounded-lg shadow-2xl mx-auto" data-ai-hint="platform dashboard builder workflow" />
        </div>
      </section>

       {/* Call to Action Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-headline font-semibold text-foreground mb-6">Ready to Innovate?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of developers building the next wave of applications on NexOS.
          </p>
          <Link href="/register" legacyBehavior>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a>Sign Up Now & Start Building</a>
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
