// src/app/onboarding/page.tsx
'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/lib/icons';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const totalSteps = 4;

function OnboardingWizardContent({
  currentStep,
  nextStep,
  prevStep,
}: {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
}): ReactNode {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Card className="flex h-full items-center justify-center border-none bg-transparent shadow-none">
      {' '}
      {/* This outer card centers content */}
      <Card className="w-full max-w-2xl">
        {' '}
        {/* Inner card gets the glassmorphic style */}
        <CardContent className="p-4 sm:p-6 md:p-8">
          <Progress
            value={progress}
            className="mb-6 h-2 w-full md:mb-8 [&>div]:bg-primary"
          />

          {currentStep === 1 && (
            <div className="space-y-4 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-primary opacity-80 md:h-16 md:w-16" />
              <h2 className="font-headline text-xl text-foreground md:text-2xl">
                Welcome to ΛΞVOS!
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                Let's get you set up. This wizard will guide you through the
                initial configuration and introduce you to the core concepts of
                ΛΞVOS, the agent-native operating system.
              </p>
              <Image
                src="https://placehold.co/500x300.png"
                alt="ΛΞVOS Welcome"
                width={500}
                height={300}
                className="mx-auto rounded-md border border-border/60 opacity-80"
                data-ai-hint="futuristic interface welcome"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <User className="mx-auto mb-2 h-10 w-10 text-primary opacity-80 md:h-12 md:w-12" />
              <h2 className="text-center font-headline text-lg text-foreground md:text-xl">
                Your Profile
              </h2>
              <div>
                <Label htmlFor="fullName" className="text-xs">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="e.g., Alex Ryder"
                  className="mt-1 h-9 border-input bg-input text-sm focus:ring-primary"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-xs">
                  Your Role
                </Label>
                <Input
                  id="role"
                  placeholder="e.g., AI Developer, Project Manager"
                  className="mt-1 h-9 border-input bg-input text-sm focus:ring-primary"
                />
              </div>
              <Image
                src="https://placehold.co/500x250.png"
                alt="Profile Setup"
                width={500}
                height={250}
                className="mx-auto mt-4 rounded-md border border-border/60 opacity-80"
                data-ai-hint="user profile settings"
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Cpu className="mx-auto mb-2 h-10 w-10 text-primary opacity-80 md:h-12 md:w-12" />
              <h2 className="text-center font-headline text-lg text-foreground md:text-xl">
                Create Your First Agent
              </h2>
              <p className="text-center text-xs text-muted-foreground md:text-sm">
                Agents are the heart of NexOS. Let's create one and assign it a
                simple task.
              </p>
              <div>
                <Label htmlFor="agentName" className="text-xs">
                  Agent Name
                </Label>
                <Input
                  id="agentName"
                  placeholder="e.g., MyHelperBot"
                  className="mt-1 h-9 border-input bg-input text-sm focus:ring-primary"
                />
              </div>
              <div>
                <Label htmlFor="agentTask" className="text-xs">
                  Initial Task
                </Label>
                <Input
                  id="agentTask"
                  placeholder="e.g., Summarize daily news, monitor email inbox"
                  className="mt-1 h-9 border-input bg-input text-sm focus:ring-primary"
                />
              </div>
              <Image
                src="https://placehold.co/500x200.png"
                alt="Agent Creation"
                width={500}
                height={200}
                className="mx-auto mt-4 rounded-md border border-border/60 opacity-80"
                data-ai-hint="AI agent configuration"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 md:h-16 md:w-16" />
              <h2 className="font-headline text-xl text-foreground md:text-2xl">
                Setup Complete!
              </h2>
              <p className="text-sm text-muted-foreground md:text-base">
                You're all set to explore NexOS. Your first agent,{' '}
                <span className="font-semibold text-primary">
                  'MyHelperBot'
                </span>
                , is now active and working on its first task!
              </p>
              <p className="text-xs text-muted-foreground md:text-sm">
                NexOS is a dynamic, modular, and secure environment. Explore the
                zones, command your agents, and build the future.
              </p>
              <Image
                src="https://placehold.co/500x300.png"
                alt="Setup Complete"
                width={500}
                height={300}
                className="mx-auto rounded-md border border-border/60 opacity-80"
                data-ai-hint="futuristic dashboard celebration"
              />
            </div>
          )}

          <div className="mt-6 flex justify-between md:mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-card hover:bg-muted/60"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => alert('Redirecting to Dashboard...')}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Go to Dashboard <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Card>
  );
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onboardingPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'onboardingWizard',
      title: 'NexOS Onboarding Wizard',
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      content: (
        <OnboardingWizardContent
          currentStep={currentStep}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      ),
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 22, minW: 6, minH: 12 },
        md: { x: 0, y: 0, w: 10, h: 22, minW: 6, minH: 12 },
        sm: { x: 0, y: 0, w: 6, h: 20, minW: 4, minH: 10 },
      },
      isDraggable: false,
      isResizable: false,
      canPin: false,
      canMaximize: false,
      canMinimize: false,
      canClose: false,
    },
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={onboardingPageZoneConfigs}
      className="flex-grow items-center justify-center p-1 md:p-2"
    />
  );
}
