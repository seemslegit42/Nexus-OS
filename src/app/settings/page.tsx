// src/app/settings/page.tsx
'use client';

import React, { type ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FloppyDisk as Save,
  UserCircle,
  Buildings as Building,
  Palette,
  Gear as AppSettingsIcon,
  BellRinging as BellRing,
  UserGear as UserCog,
  Key as KeyRound,
  Terminal,
  CreditCard,
  GearSix as PageSettingsIcon,
} from '@phosphor-icons/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  WorkspaceGrid,
  type ZoneConfig,
} from '@/components/core/workspace-grid';
import { cn } from '@/lib/utils';

function SettingsCard({
  title,
  description,
  icon,
  children,
  className,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn('h-full border-none bg-transparent shadow-none', className)}
    >
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md flex items-center font-headline text-foreground">
          {React.cloneElement(icon as React.ReactElement, {
            className: 'mr-2 h-5 w-5 text-primary',
          })}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3 p-2 pt-0 md:p-3">
        {children}
      </CardContent>
    </Card>
  );
}

function UserProfileSettingsContent(): ReactNode {
  return (
    <SettingsCard
      title="User Profile"
      description="Manage your personal information."
      icon={<UserCircle />}
    >
      <div>
        <Label htmlFor="fullName" className="text-xs">
          Full Name
        </Label>
        <Input
          id="fullName"
          defaultValue="Alex Ryder"
          className="mt-1 h-9 border-input bg-input text-sm focus:ring-primary"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-xs">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          defaultValue="alex.ryder@nexos.ai"
          className="mt-1 h-9 border-input bg-input text-sm focus:ring-primary"
        />
      </div>
      <div>
        <Label htmlFor="avatar" className="text-xs">
          Avatar URL
        </Label>
        <Input
          id="avatar"
          placeholder="https://..."
          className="mt-1 h-9 border-input bg-input text-sm focus:ring-primary"
        />
      </div>
    </SettingsCard>
  );
}

function OrganizationSettingsContent(): ReactNode {
  return (
    <SettingsCard
      title="Organization"
      description="Manage your organization's details."
      icon={<Building />}
    >
      <div>
        <Label htmlFor="orgName" className="text-xs">
          Organization Name
        </Label>
        <Input
          id="orgName"
          defaultValue="NexOS Innovations Inc."
          className="mt-1 h-9 border-input bg-input text-sm focus:ring-primary"
        />
      </div>
      <div>
        <Label htmlFor="orgAddress" className="text-xs">
          Address
        </Label>
        <Textarea
          id="orgAddress"
          placeholder="123 Future Drive, Cyberspace"
          className="mt-1 min-h-[60px] border-input bg-input text-sm focus:ring-primary"
        />
      </div>
    </SettingsCard>
  );
}

function ThemeCustomizationContent(): ReactNode {
  return (
    <SettingsCard
      title="Theme Customization"
      description="Personalize the look and feel of NexOS."
      icon={<Palette />}
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="theme-mode" className="text-sm text-foreground">
          Appearance Mode
        </Label>
        <Select defaultValue="dark">
          <SelectTrigger className="h-9 w-[120px] border-input bg-input text-xs focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="accent-color" className="text-sm text-foreground">
          Accent Color
        </Label>
        <Input
          id="accent-color"
          type="color"
          defaultValue="#FFA500"
          className="mt-1 h-9 w-full border-input bg-input p-1 focus:ring-primary"
        />
      </div>
    </SettingsCard>
  );
}

function AppSettingsContent(): ReactNode {
  return (
    <SettingsCard
      title="Application Settings"
      description="Configure core application behaviors."
      icon={<AppSettingsIcon />}
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="realtime-updates" className="text-sm text-foreground">
          Real-time Updates
        </Label>
        <Switch id="realtime-updates" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="session-timeout" className="text-sm text-foreground">
          Session Timeout
        </Label>
        <Select defaultValue="30">
          <SelectTrigger className="h-9 w-[100px] border-input bg-input text-xs focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 mins</SelectItem>
            <SelectItem value="30">30 mins</SelectItem>
            <SelectItem value="60">60 mins</SelectItem>
            <SelectItem value="never">Never</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="language-settings" className="text-sm text-foreground">
          Language
        </Label>
        <Select defaultValue="en-US">
          <SelectTrigger className="h-9 w-[120px] border-input bg-input text-xs focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="es-ES">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </SettingsCard>
  );
}

function NotificationPreferencesContent(): ReactNode {
  return (
    <SettingsCard
      title="Notification Preferences"
      description="Choose how you receive notifications."
      icon={<BellRing />}
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="email-notifs" className="text-sm text-foreground">
          Email Notifications
        </Label>
        <Switch id="email-notifs" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="inapp-notifs" className="text-sm text-foreground">
          In-App Notifications
        </Label>
        <Switch id="inapp-notifs" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="sound-notifs" className="text-sm text-foreground">
          Notification Sounds
        </Label>
        <Switch id="sound-notifs" />
      </div>
    </SettingsCard>
  );
}

function AgentBehavioralDefaultsContent(): ReactNode {
  return (
    <SettingsCard
      title="Agent Defaults"
      description="Set default behaviors for new agents."
      icon={<UserCog />}
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="agent-autonomy" className="text-sm text-foreground">
          Default Autonomy
        </Label>
        <Select defaultValue="supervised">
          <SelectTrigger className="h-9 w-[180px] border-input bg-input text-xs focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supervised">Supervised</SelectItem>
            <SelectItem value="semi-autonomous">Semi-Autonomous</SelectItem>
            <SelectItem value="fully-autonomous">
              Fully Autonomous (Caution)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="agent-logging" className="text-sm text-foreground">
          Default Logging Level
        </Label>
        <Select defaultValue="standard">
          <SelectTrigger className="h-9 w-[150px] border-input bg-input text-xs focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="verbose">Verbose (Debug)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="max-recursion" className="text-sm text-foreground">
          Max Self-Correction Loops
        </Label>
        <Input
          id="max-recursion"
          type="number"
          defaultValue="5"
          className="h-9 w-[80px] border-input bg-input text-xs focus:ring-primary"
        />
      </div>
    </SettingsCard>
  );
}

function ApiKeyManagementContent(): ReactNode {
  return (
    <SettingsCard
      title="API Key Management"
      description="Manage API keys for accessing ΛΞVOS programmatically."
      icon={<KeyRound />}
    >
      <ScrollArea className="h-full max-h-[150px] rounded-md border border-border/50 bg-muted/20 p-2">
        <div className="mb-2 rounded-sm bg-background/60 p-2 shadow-sm">
          <p className="break-all font-mono text-xs text-accent-foreground">
            nexos_sk_live_xxxxxxxxxxxxYYYY
          </p>
          <p className="text-xs text-muted-foreground">
            Label: Main Production Key
          </p>
          <p className="text-xs text-muted-foreground">
            Created: 2023-01-15 | Last Used: 2023-10-25
          </p>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-destructive hover:text-destructive/80"
          >
            Revoke Key
          </Button>
        </div>
        <div className="rounded-sm bg-background/60 p-2 shadow-sm">
          <p className="break-all font-mono text-xs text-accent-foreground">
            nexos_sk_dev_zzzzzzzzzzzzXXXX
          </p>
          <p className="text-xs text-muted-foreground">
            Label: Staging Environment Key
          </p>
          <p className="text-xs text-muted-foreground">
            Created: 2023-08-01 | Last Used: Never
          </p>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-destructive hover:text-destructive/80"
          >
            Revoke Key
          </Button>
        </div>
      </ScrollArea>
      <Button
        variant="outline"
        className="mt-2 w-full bg-card hover:bg-muted/60"
      >
        {' '}
        Generate New API Key
      </Button>
    </SettingsCard>
  );
}

function DeveloperModeContent(): ReactNode {
  return (
    <SettingsCard
      title="Developer Mode"
      description="Access advanced tools and experimental features."
      icon={<Terminal />}
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="dev-mode" className="text-sm text-foreground">
          Enable Developer Mode
        </Label>
        <Switch id="dev-mode" />
      </div>
      <p className="text-xs text-muted-foreground">
        Enables advanced debugging tools, agent telemetry viewers, and
        experimental features.
      </p>
      <div className="flex items-center justify-between">
        <Label htmlFor="raw-logs" className="text-sm text-foreground">
          Show Raw Agent Logs
        </Label>
        <Switch id="raw-logs" disabled />
      </div>
    </SettingsCard>
  );
}

function PlanBillingSummaryContent(): ReactNode {
  return (
    <SettingsCard
      title="Plan & Billing"
      description="View your current plan and manage billing."
      icon={<CreditCard />}
    >
      <h3 className="text-sm font-semibold text-foreground">
        Current Plan: <span className="text-primary">Pro ($99/mo)</span>
      </h3>
      <Card className="border-border/50 bg-muted/20">
        <CardHeader className="p-2">
          <CardTitle className="text-xs text-muted-foreground">
            Usage This Cycle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0.5 p-2 text-xs">
          <p>
            <span className="text-muted-foreground">Agent Compute:</span>{' '}
            <span className="text-foreground">85/200 hrs</span>
          </p>
          <p>
            <span className="text-muted-foreground">Token Usage:</span>{' '}
            <span className="text-foreground">550k/1M</span>
          </p>
          <p>
            <span className="text-muted-foreground">Storage:</span>{' '}
            <span className="text-foreground">12GB/50GB</span>
          </p>
        </CardContent>
      </Card>
      <Link href="/billing" className="mt-2 block w-full" legacyBehavior>
        <Button
          asChild
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <a>Manage Subscription & Billing</a>
        </Button>
      </Link>
    </SettingsCard>
  );
}

const SaveSettingsButton = () => (
  <div className="sticky bottom-0 z-10 mt-auto flex justify-end border-t border-border/70 bg-background/90 p-3 backdrop-blur-sm md:p-4">
    <Button
      size="lg"
      className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Save className="mr-2 h-4 w-4" />
      Save All Settings
    </Button>
  </div>
);

export default function SettingsPage() {
  const settingsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'userProfileSettings',
      title: 'User Profile',
      icon: <UserCircle />,
      content: <UserProfileSettingsContent />,
      defaultLayout: {
        x: 0,
        y: 0,
        w: 4,
        h: 7,
        minW: 3,
        minH: 6,
        lg: { x: 0, y: 0, w: 4, h: 7, minW: 3, minH: 6 },
      },
    },
    {
      id: 'organizationSettings',
      title: 'Organization',
      icon: <Building />,
      content: <OrganizationSettingsContent />,
      defaultLayout: {
        x: 4,
        y: 0,
        w: 4,
        h: 7,
        minW: 3,
        minH: 6,
        lg: { x: 4, y: 0, w: 4, h: 7, minW: 3, minH: 6 },
      },
    },
    {
      id: 'themeCustomization',
      title: 'Theme Customization',
      icon: <Palette />,
      content: <ThemeCustomizationContent />,
      defaultLayout: {
        x: 8,
        y: 0,
        w: 4,
        h: 7,
        minW: 3,
        minH: 5,
        lg: { x: 8, y: 0, w: 4, h: 7, minW: 3, minH: 5 },
      },
    },
    {
      id: 'appSettings',
      title: 'Application Settings',
      icon: <AppSettingsIcon />,
      content: <AppSettingsContent />,
      defaultLayout: {
        x: 0,
        y: 7,
        w: 4,
        h: 8,
        minW: 3,
        minH: 6,
        lg: { x: 0, y: 7, w: 4, h: 8, minW: 3, minH: 6 },
      },
    },
    {
      id: 'notificationPreferences',
      title: 'Notification Preferences',
      icon: <BellRing />,
      content: <NotificationPreferencesContent />,
      defaultLayout: {
        x: 4,
        y: 7,
        w: 4,
        h: 8,
        minW: 3,
        minH: 5,
        lg: { x: 4, y: 7, w: 4, h: 8, minW: 3, minH: 5 },
      },
    },
    {
      id: 'agentBehavioralDefaults',
      title: 'Agent Defaults',
      icon: <UserCog />,
      content: <AgentBehavioralDefaultsContent />,
      defaultLayout: {
        x: 8,
        y: 7,
        w: 4,
        h: 8,
        minW: 3,
        minH: 6,
        lg: { x: 8, y: 7, w: 4, h: 8, minW: 3, minH: 6 },
      },
    },
    {
      id: 'apiKeyManagement',
      title: 'API Key Management',
      icon: <KeyRound />,
      content: <ApiKeyManagementContent />,
      defaultLayout: {
        x: 0,
        y: 15,
        w: 4,
        h: 7,
        minW: 3,
        minH: 6,
        lg: { x: 0, y: 15, w: 4, h: 7, minW: 3, minH: 6 },
      },
    },
    {
      id: 'developerMode',
      title: 'Developer Mode',
      icon: <Terminal />,
      content: <DeveloperModeContent />,
      defaultLayout: {
        x: 4,
        y: 15,
        w: 4,
        h: 7,
        minW: 3,
        minH: 5,
        lg: { x: 4, y: 15, w: 4, h: 7, minW: 3, minH: 5 },
      },
    },
    {
      id: 'planBillingSummary',
      title: 'Plan & Billing',
      icon: <CreditCard />,
      content: <PlanBillingSummaryContent />,
      defaultLayout: {
        x: 8,
        y: 15,
        w: 4,
        h: 7,
        minW: 3,
        minH: 6,
        lg: { x: 8, y: 15, w: 4, h: 7, minW: 3, minH: 6 },
      },
    },
  ];

  return (
    <div className="flex h-full flex-grow flex-col">
      <WorkspaceGrid
        zoneConfigs={settingsPageZoneConfigs.map(zc => ({
          ...zc,
          icon: React.cloneElement(zc.icon as React.ReactElement, {
            className: 'w-4 h-4',
          }),
        }))}
        className="flex-grow p-1 md:p-2"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      />
      <SaveSettingsButton />
    </div>
  );
}
