
// src/app/onboarding/page.tsx
'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Sparkles, User, Cpu, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const totalSteps = 4;

function OnboardingWizardContent({ currentStep, nextStep, prevStep }: { currentStep: number, nextStep: () => void, prevStep: () => void }): ReactNode {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Card className="h-full bg-transparent border-none shadow-none flex items-center justify-center"> {/* Centering content */}
      <CardContent className="p-3 sm:p-6 max-w-2xl w-full">
        <Progress value={progress} className="w-full mb-6 md:mb-8 h-2 [&>div]:bg-primary" />
        
        {currentStep === 1 && (
          <div className="space-y-4 text-center">
            <Sparkles className="mx-auto h-12 w-12 md:h-16 md:w-16 text-primary opacity-80" />
            <h2 className="text-xl md:text-2xl font-headline text-foreground">Welcome to NexOS!</h2>
            <p className="text-sm md:text-base text-muted-foreground">Let's get you set up. This wizard will guide you through the initial configuration and introduce you to the core concepts of NexOS, the agent-native operating system.</p>
            <Image src="https://placehold.co/500x300.png" alt="NexOS Welcome" width={500} height={300} className="rounded-md mx-auto border border-border/60 opacity-80" data-ai-hint="futuristic interface welcome" />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <User className="mx-auto h-10 w-10 md:h-12 md:w-12 text-primary opacity-80 mb-2" />
            <h2 className="text-lg md:text-xl font-headline text-center text-foreground">Your Profile</h2>
            <div>
              <Label htmlFor="fullName" className="text-xs">Full Name</Label>
              <Input id="fullName" placeholder="e.g., Alex Ryder" className="mt-1 bg-input border-input focus:ring-primary h-9 text-sm" />
            </div>
            <div>
              <Label htmlFor="role" className="text-xs">Your Role</Label>
              <Input id="role" placeholder="e.g., AI Developer, Project Manager" className="mt-1 bg-input border-input focus:ring-primary h-9 text-sm" />
            </div>
            <Image src="https://placehold.co/500x250.png" alt="Profile Setup" width={500} height={250} className="rounded-md mx-auto mt-4 border border-border/60 opacity-80" data-ai-hint="user profile settings" />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <Cpu className="mx-auto h-10 w-10 md:h-12 md:w-12 text-primary opacity-80 mb-2" />
            <h2 className="text-lg md:text-xl font-headline text-center text-foreground">Create Your First Agent</h2>
            <p className="text-xs md:text-sm text-muted-foreground text-center">Agents are the heart of NexOS. Let's create one and assign it a simple task.</p>
            <div>
              <Label htmlFor="agentName" className="text-xs">Agent Name</Label>
              <Input id="agentName" placeholder="e.g., MyHelperBot" className="mt-1 bg-input border-input focus:ring-primary h-9 text-sm" />
            </div>
            <div>
              <Label htmlFor="agentTask" className="text-xs">Initial Task</Label>
              <Input id="agentTask" placeholder="e.g., Summarize daily news, monitor email inbox" className="mt-1 bg-input border-input focus:ring-primary h-9 text-sm" />
            </div>
            <Image src="https://placehold.co/500x200.png" alt="Agent Creation" width={500} height={200} className="rounded-md mx-auto mt-4 border border-border/60 opacity-80" data-ai-hint="AI agent configuration" />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 text-center">
            <CheckCircle className="mx-auto h-12 w-12 md:h-16 md:w-16 text-green-500" />
            <h2 className="text-xl md:text-2xl font-headline text-foreground">Setup Complete!</h2>
            <p className="text-sm md:text-base text-muted-foreground">You're all set to explore NexOS. Your first agent, <span className="text-primary font-semibold">'MyHelperBot'</span>, is now active and working on its first task!</p>
            <p className="text-xs md:text-sm text-muted-foreground">NexOS is a dynamic, modular, and secure environment. Explore the zones, command your agents, and build the future.</p>
            <Image src="https://placehold.co/500x300.png" alt="Setup Complete" width={500} height={300} className="rounded-md mx-auto border border-border/60 opacity-80" data-ai-hint="futuristic dashboard celebration" />
          </div>
        )}

        <div className="mt-6 md:mt-8 flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="bg-card hover:bg-muted/60">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentStep < totalSteps ? (
            <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => alert('Redirecting to Dashboard...')} className="bg-green-600 hover:bg-green-700 text-white">
              Go to Dashboard <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
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
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      content: <OnboardingWizardContent currentStep={currentStep} nextStep={nextStep} prevStep={prevStep} />,
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
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={onboardingPageZoneConfigs}
      className="flex-grow items-center justify-center p-1 md:p-2" 
    />
  );
}

