// src/app/(public)/plans/page.tsx
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
import { CheckCircle } from '@phosphor-icons/react';
import Link from 'next/link';

const pricingTiers = [
  {
    name: 'Free Tier',
    price: '$0',
    frequency: '/month',
    description: 'Perfect for individuals and small hobby projects.',
    features: [
      '1 User',
      'Limited Item Creation',
      'Basic Module Access',
      'Community Support',
    ],
    cta: 'Get Started Free',
    href: '/register',
    isPopular: false,
  },
  {
    name: 'Pro Plan',
    price: '$49',
    frequency: '/month',
    description:
      'For professionals and small teams growing their applications.',
    features: [
      '5 Users',
      'Unlimited Item Creation',
      'Full Module Access',
      'Priority Email Support',
      'Advanced Analytics',
    ],
    cta: 'Choose Pro Plan',
    href: '/register?plan=pro',
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    frequency: '',
    description:
      'Tailored solutions for large organizations with specific needs.',
    features: [
      'Unlimited Users',
      'Custom Item Types & Modules',
      'Dedicated Support & SLA',
      'On-premise Options',
      'Advanced Security & Compliance',
    ],
    cta: 'Contact Sales',
    href: '/contact-sales',
    isPopular: false,
  },
];

export default function PlansPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <header className="mb-16 text-center">
          <h1 className="mb-4 font-headline text-4xl font-bold text-foreground md:text-5xl">
            Find the Perfect Plan
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose the NexOS Platform plan that best suits your needs, from
            hobby projects to enterprise solutions.
          </p>
        </header>

        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          {pricingTiers.map(tier => (
            <Card
              key={tier.name}
              className={`flex flex-col ${tier.isPopular ? 'border-2 border-primary shadow-lg shadow-primary/30' : ''}`}
            >
              {tier.isPopular && (
                <div className="-mt-px rounded-t-md bg-primary px-3 py-1 text-center text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">
                  {tier.name}
                </CardTitle>
                <div className="my-2 text-4xl font-bold text-foreground">
                  {tier.price}
                  {tier.frequency && (
                    <span className="text-lg font-normal text-muted-foreground">
                      {tier.frequency}
                    </span>
                  )}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-sm">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={tier.href} className="w-full" legacyBehavior>
                  <Button
                    asChild
                    size="lg"
                    className={`w-full ${tier.isPopular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-accent text-accent-foreground hover:bg-accent/90'}`}
                  >
                    <a>{tier.cta}</a>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
