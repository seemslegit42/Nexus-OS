
// src/app/(public)/about/page.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Target, Eye, Zap, Milestone, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

// It's not possible to export Metadata from a 'use client' component.
// For dynamic metadata, you'd use the generateMetadata function in a server component.
// For now, we'll rely on the layout for general metadata, or consider moving this to a server component if specific metadata is critical.

// export const metadata: Metadata = {
//   title: 'About NexOS Platform | Our Mission, Vision, and Team',
//   description: 'Learn about the NexOS Platform, our mission to revolutionize SaaS development, our vision for an agent-native future, and the innovative team behind it all.',
// };

const teamMembers = [
  { name: 'Dr. Aris Thorne', role: 'Chief Architect & Visionary', image: 'https://placehold.co/200x200.png', dataAiHint: 'professional portrait scientist', bio: 'Pioneering the agent-native paradigm, Dr. Thorne leads NexOS with a vision for interconnected intelligent systems.' },
  { name: 'Lyra Kael', role: 'Head of Agent Development', image: 'https://placehold.co/200x200.png', dataAiHint: 'coder portrait engineer', bio: 'Lyra orchestrates the development of NexOS core agents, pushing the boundaries of AI capabilities.' },
  { name: 'Jax "Cipher" Volkov', role: 'Lead Security Engineer', image: 'https://placehold.co/200x200.png', dataAiHint: 'security expert portrait hacker', bio: 'Cipher ensures the NexOS platform remains a fortress, integrating cutting-edge security at every layer.' },
  { name: 'Seraphina Vue', role: 'Director of User Experience', image: 'https://placehold.co/200x200.png', dataAiHint: 'designer portrait creative', bio: 'Seraphina crafts the intuitive and dynamic user experience that defines interaction with NexOS.' },
];

const timelineEvents = [
  { year: 'Concept Spark', title: 'The Genesis of Agent-Native OS', description: 'Initial whitepaper outlines the vision for a modular, AI-first operating system designed for complex SaaS applications.', icon: <Zap className="h-5 w-5 text-primary" /> },
  { year: 'Core Architecture', title: 'Building the Foundation', description: 'Development of the NexOS kernel, workspace grid, and initial agent communication protocols.', icon: <Milestone className="h-5 w-5 text-primary" /> },
  { year: 'First Agents Deployed', title: 'Intelligence Awakens', description: 'Deployment of foundational agents for system optimization, security monitoring, and basic automation within NexOS.', icon: <Cpu className="h-5 w-5 text-primary" /> },
  { year: 'Platform Launch', title: 'NexOS Enters the Arena', description: 'Public launch of the NexOS Platform, empowering developers to build, automate, and scale next-generation applications.', icon: <CheckCircle className="h-5 w-5 text-primary" /> },
];


export default function AboutPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground mb-6">
            About <span className="text-primary">NexOS Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We are architects of the future, building a radically new operating system for the age of intelligent automation and interconnected digital experiences.
          </p>
           <Image src="https://placehold.co/1200x500.png" alt="NexOS Platform Vision" width={1200} height={500} className="rounded-2xl shadow-[0_8px_40px_hsl(var(--primary)/0.15)] mt-10 mx-auto object-cover" data-ai-hint="abstract futuristic technology team" />
        </section>

        {/* Mission & Vision Section */}
        <section className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-headline flex items-center text-foreground">
                <Target className="h-7 w-7 text-primary mr-3" /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To empower developers and organizations with a modular, agent-native platform that accelerates innovation, automates complexity, and unlocks new frontiers in software capabilities. We strive to make sophisticated AI integration seamless and secure.
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-headline flex items-center text-foreground">
                <Eye className="h-7 w-7 text-primary mr-3" /> Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We envision a future where intelligent agents are integral to every digital interaction, working autonomously and collaboratively within a secure, dynamic, and infinitely scalable operating system. NexOS will be the bedrock of this interconnected, intelligent world.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground text-center mb-12">
            Meet the <span className="text-primary">Innovators</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="text-center overflow-hidden">
                <Image src={member.image} alt={member.name} width={200} height={200} className="w-full h-48 object-cover rounded-t-2xl" data-ai-hint={member.dataAiHint} />
                <CardHeader className="pt-4 pb-2">
                  <CardTitle className="text-xl font-headline text-foreground">{member.name}</CardTitle>
                  <CardDescription className="text-primary">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-xs text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Journey / Timeline Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground text-center mb-12">
            Our <span className="text-primary">Journey</span>
          </h2>
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 transform -translate-x-1/2 hidden md:block"></div>
            
            {timelineEvents.map((event, index) => (
              <div key={event.year} className="mb-8 flex md:items-center w-full">
                <div className="hidden md:flex md:w-1/2 justify-center">
                  {index % 2 === 0 && (
                    <div className="p-4 rounded-xl bg-card border border-primary/25 shadow-lg w-full md:max-w-sm text-right">
                      <h3 className="text-xl font-headline text-primary mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  )}
                </div>
                <div className="relative z-10 flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                    {event.icon}
                  </div>
                  <p className="text-center md:text-left md:ml-[-1.5rem] md:pl-12 mt-1 text-sm font-semibold text-muted-foreground">{event.year}</p>
                </div>
                <div className="w-full md:w-1/2 md:pl-8">
                 <div className="block md:hidden p-4 rounded-xl bg-card border border-primary/25 shadow-lg mt-2">
                    <h3 className="text-xl font-headline text-primary mb-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  {index % 2 !== 0 && (
                     <div className="hidden md:block p-4 rounded-xl bg-card border border-primary/25 shadow-lg w-full md:max-w-sm text-left">
                        <h3 className="text-xl font-headline text-primary mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-foreground mb-4">
            Join Us in Building the Future
          </h2>
          <p className="text-md text-muted-foreground max-w-xl mx-auto mb-8">
            NexOS is more than a platform; it&apos;s a community of innovators. Explore career opportunities or contribute to our ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/careers">View Open Positions</Link>
            </Button>
            <Button size="lg" asChild variant="outline">
                <Link href="/explore/submit">Contribute to NexOS</Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}
