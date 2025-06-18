// src/app/(public)/about/page.tsx
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Target,
  Eye,
  Lightning as Zap,
  FlagBanner as Milestone,
  CheckCircle,
  Cpu,
} from '@phosphor-icons/react';

// It's not possible to export Metadata from a 'use client' component.
// For dynamic metadata, you'd use the generateMetadata function in a server component.
// For now, we'll rely on the layout for general metadata, or consider moving this to a server component if specific metadata is critical.

// export const metadata: Metadata = {
//   title: 'About NexOS Platform | Our Mission, Vision, and Team',
//   description: 'Learn about the NexOS Platform, our mission to revolutionize SaaS development, our vision for an agent-native future, and the innovative team behind it all.',
// };

const teamMembers = [
  {
    name: 'Dr. Aris Thorne',
    role: 'Chief Architect & Visionary',
    image: 'https://placehold.co/200x200.png',
    dataAiHint: 'professional portrait scientist',
    bio: 'Pioneering the agent-native paradigm, Dr. Thorne leads NexOS with a vision for interconnected intelligent systems.',
  },
  {
    name: 'Lyra Kael',
    role: 'Head of Agent Development',
    image: 'https://placehold.co/200x200.png',
    dataAiHint: 'coder portrait engineer',
    bio: 'Lyra orchestrates the development of NexOS core agents, pushing the boundaries of AI capabilities.',
  },
  {
    name: 'Jax "Cipher" Volkov',
    role: 'Lead Security Engineer',
    image: 'https://placehold.co/200x200.png',
    dataAiHint: 'security expert portrait hacker',
    bio: 'Cipher ensures the NexOS platform remains a fortress, integrating cutting-edge security at every layer.',
  },
  {
    name: 'Seraphina Vue',
    role: 'Director of User Experience',
    image: 'https://placehold.co/200x200.png',
    dataAiHint: 'designer portrait creative',
    bio: 'Seraphina crafts the intuitive and dynamic user experience that defines interaction with NexOS.',
  },
];

const timelineEvents = [
  {
    year: 'Concept Spark',
    title: 'The Genesis of Agent-Native OS',
    description:
      'Initial whitepaper outlines the vision for a modular, AI-first operating system designed for complex SaaS applications.',
    icon: <Zap className="h-5 w-5 text-primary" />,
  },
  {
    year: 'Core Architecture',
    title: 'Building the Foundation',
    description:
      'Development of the NexOS kernel, workspace grid, and initial agent communication protocols.',
    icon: <Milestone className="h-5 w-5 text-primary" />,
  },
  {
    year: 'First Agents Deployed',
    title: 'Intelligence Awakens',
    description:
      'Deployment of foundational agents for system optimization, security monitoring, and basic automation within NexOS.',
    icon: <Cpu className="h-5 w-5 text-primary" />,
  },
  {
    year: 'Platform Launch',
    title: 'NexOS Enters the Arena',
    description:
      'Public launch of the NexOS Platform, empowering developers to build, automate, and scale next-generation applications.',
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
  },
];

export default function AboutPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16 text-center md:mb-24">
          <h1 className="mb-6 font-headline text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            About <span className="text-primary">NexOS Platform</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
            We are architects of the future, building a radically new operating
            system for the age of intelligent automation and interconnected
            digital experiences.
          </p>
          <Image
            src="https://placehold.co/1200x500.png"
            alt="NexOS Platform Vision"
            width={1200}
            height={500}
            className="mx-auto mt-10 rounded-2xl object-cover shadow-[0_8px_40px_hsl(var(--primary)/0.15)]"
            data-ai-hint="abstract futuristic technology team"
          />
        </section>

        {/* Mission & Vision Section */}
        <section className="mb-16 grid gap-8 md:mb-24 md:grid-cols-2 md:gap-12">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center font-headline text-2xl text-foreground md:text-3xl">
                <Target className="mr-3 h-7 w-7 text-primary" /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To empower developers and organizations with a modular,
                agent-native platform that accelerates innovation, automates
                complexity, and unlocks new frontiers in software capabilities.
                We strive to make sophisticated AI integration seamless and
                secure.
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center font-headline text-2xl text-foreground md:text-3xl">
                <Eye className="mr-3 h-7 w-7 text-primary" /> Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We envision a future where intelligent agents are integral to
                every digital interaction, working autonomously and
                collaboratively within a secure, dynamic, and infinitely
                scalable operating system. NexOS will be the bedrock of this
                interconnected, intelligent world.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Team Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold text-foreground md:text-4xl">
            Meet the <span className="text-primary">Innovators</span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map(member => (
              <Card key={member.name} className="overflow-hidden text-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="h-48 w-full rounded-t-2xl object-cover"
                  data-ai-hint={member.dataAiHint}
                />
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="font-headline text-xl text-foreground">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-primary">
                    {member.role}
                  </CardDescription>
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
          <h2 className="mb-12 text-center font-headline text-3xl font-bold text-foreground md:text-4xl">
            Our <span className="text-primary">Journey</span>
          </h2>
          <div className="relative mx-auto max-w-3xl">
            {/* Timeline Line */}
            <div className="absolute bottom-0 left-1/2 top-0 hidden w-1 -translate-x-1/2 transform bg-primary/30 md:block"></div>

            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                className="mb-8 flex w-full md:items-center"
              >
                <div className="hidden justify-center md:flex md:w-1/2">
                  {index % 2 === 0 && (
                    <div className="w-full rounded-xl border border-primary/25 bg-card p-4 text-right shadow-lg md:max-w-sm">
                      <h3 className="mb-1 font-headline text-xl text-primary">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="relative z-10 flex-shrink-0">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg md:mx-0">
                    {event.icon}
                  </div>
                  <p className="mt-1 text-center text-sm font-semibold text-muted-foreground md:ml-[-1.5rem] md:pl-12 md:text-left">
                    {event.year}
                  </p>
                </div>
                <div className="w-full md:w-1/2 md:pl-8">
                  <div className="mt-2 block rounded-xl border border-primary/25 bg-card p-4 shadow-lg md:hidden">
                    <h3 className="mb-1 font-headline text-xl text-primary">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  {index % 2 !== 0 && (
                    <div className="hidden w-full rounded-xl border border-primary/25 bg-card p-4 text-left shadow-lg md:block md:max-w-sm">
                      <h3 className="mb-1 font-headline text-xl text-primary">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 text-center">
          <h2 className="mb-4 font-headline text-2xl font-bold text-foreground md:text-3xl">
            Join Us in Building the Future
          </h2>
          <p className="text-md mx-auto mb-8 max-w-xl text-muted-foreground">
            NexOS is more than a platform; it&apos;s a community of innovators.
            Explore career opportunities or contribute to our ecosystem.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
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
