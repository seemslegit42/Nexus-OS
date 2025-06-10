'use client';

import { useState } from 'react';
import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Sparkles, User, Cpu, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const totalSteps = 4;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4">
      <Zone 
        title="NexOS Onboarding Wizard" 
        icon={<Sparkles className="w-6 h-6 text-primary" />} 
        className="w-full max-w-2xl"
      >
        <div className="p-2 sm:p-4">
          <Progress value={progress} className="w-full mb-6 h-2 [&>div]:bg-primary" />
          
          {currentStep === 1 && (
            <div className="space-y-4 text-center">
              <Sparkles className="mx-auto h-16 w-16 text-primary opacity-80" />
              <h2 className="text-2xl font-headline text-foreground">Welcome to NexOS!</h2>
              <p className="text-muted-foreground">Let's get you set up. This wizard will guide you through the initial configuration and introduce you to the core concepts of NexOS, the agent-native operating system.</p>
              <Image src="https://placehold.co/500x300.png" alt="NexOS Welcome" width={500} height={300} className="rounded-md mx-auto" data-ai-hint="futuristic interface welcome" />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <User className="mx-auto h-12 w-12 text-primary opacity-80 mb-2" />
              <h2 className="text-xl font-headline text-center text-foreground">Your Profile</h2>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="e.g., Alex Ryder" className="mt-1 bg-background border-input focus:ring-primary" />
              </div>
              <div>
                <Label htmlFor="role">Your Role</Label>
                <Input id="role" placeholder="e.g., AI Developer, Project Manager" className="mt-1 bg-background border-input focus:ring-primary" />
              </div>
              <Image src="https://placehold.co/500x250.png" alt="Profile Setup" width={500} height={250} className="rounded-md mx-auto mt-4" data-ai-hint="user profile settings" />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Cpu className="mx-auto h-12 w-12 text-primary opacity-80 mb-2" />
              <h2 className="text-xl font-headline text-center text-foreground">Create Your First Agent</h2>
              <p className="text-sm text-muted-foreground text-center">Agents are the heart of NexOS. Let's create one and assign it a simple task.</p>
              <div>
                <Label htmlFor="agentName">Agent Name</Label>
                <Input id="agentName" placeholder="e.g., MyHelperBot" className="mt-1 bg-background border-input focus:ring-primary" />
              </div>
              <div>
                <Label htmlFor="agentTask">Initial Task</Label>
                <Input id="agentTask" placeholder="e.g., Summarize daily news, monitor email inbox" className="mt-1 bg-background border-input focus:ring-primary" />
              </div>
               <Image src="https://placehold.co/500x200.png" alt="Agent Creation" width={500} height={200} className="rounded-md mx-auto mt-4" data-ai-hint="AI agent configuration" />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-headline text-foreground">Setup Complete!</h2>
              <p className="text-muted-foreground">You're all set to explore NexOS. Your first agent, <span className="text-primary font-semibold">'MyHelperBot'</span>, is now active and working on its first task!</p>
              <p className="text-sm text-muted-foreground">NexOS is a dynamic, modular, and secure environment. Explore the zones, command your agents, and build the future.</p>
              <Image src="https://placehold.co/500x300.png" alt="Setup Complete" width={500} height={300} className="rounded-md mx-auto" data-ai-hint="futuristic dashboard celebration" />
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
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
        </div>
      </Zone>
    </div>
  );
}
