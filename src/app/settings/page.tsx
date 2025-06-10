
// src/app/settings/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Palette, Terminal, BellRing, UserCog, UserCircle, Building, CreditCard, KeyRound, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function UserProfileSettingsContent(): ReactNode {
  return (
    <div className="space-y-4 p-2">
      <h3 className="text-md font-semibold font-headline text-foreground">Your Profile</h3>
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" defaultValue="Alex Ryder" className="mt-1 bg-background border-input focus:ring-primary" />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" defaultValue="alex.ryder@example.com" className="mt-1 bg-background border-input focus:ring-primary" />
      </div>
      <div>
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input id="avatar" placeholder="https://..." className="mt-1 bg-background border-input focus:ring-primary" />
      </div>
      <Button variant="outline">Update Profile</Button>
    </div>
  );
}

function OrganizationSettingsContent(): ReactNode {
  return (
    <div className="space-y-4 p-2">
      <h3 className="text-md font-semibold font-headline text-foreground">Organization Details</h3>
      <div>
        <Label htmlFor="orgName">Organization Name</Label>
        <Input id="orgName" defaultValue="NexOS Innovations Inc." className="mt-1 bg-background border-input focus:ring-primary" />
      </div>
      <div>
        <Label htmlFor="orgAddress">Address</Label>
        <Textarea id="orgAddress" placeholder="123 Future Drive, Cyberspace" className="mt-1 bg-background border-input focus:ring-primary min-h-[60px]" />
      </div>
      <Button variant="outline">Save Organization Details</Button>
    </div>
  );
}

function PlanBillingSummaryContent(): ReactNode {
  return (
    <div className="space-y-3 p-2">
      <h3 className="text-md font-semibold font-headline text-foreground">Current Plan: Pro</h3>
      <Card className="bg-background/50">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">Usage This Cycle</CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-xs">
          <p>Agent Compute: 85/200 hrs</p>
          <p>Token Usage: 550k/1M</p>
          <p>Storage: 12GB/50GB</p>
        </CardContent>
      </Card>
      <Link href="/billing">
        <Button className="w-full">Manage Subscription & Billing</Button>
      </Link>
    </div>
  );
}

function ApiKeyManagementContent(): ReactNode {
  return (
    <div className="space-y-3 p-2">
      <h3 className="text-md font-semibold font-headline text-foreground">API Keys</h3>
      <div className="p-3 bg-muted/30 rounded-md">
        <p className="text-sm font-mono break-all">nexos_sk_live_xxxxxxxxxxxxYYYY</p>
        <p className="text-xs text-muted-foreground">Created: 2023-01-15 | Last Used: 2023-10-25</p>
        <Button variant="link" size="sm" className="p-0 h-auto text-xs text-destructive">Revoke Key</Button>
      </div>
      <Button variant="outline" className="w-full"><PlusCircle className="mr-2 h-4 w-4" /> Generate New API Key</Button>
    </div>
  );
}

function AppSettingsContent(): ReactNode {
  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="realtime-updates" className="font-medium text-foreground">Enable Real-time Updates</Label>
        <Switch id="realtime-updates" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="session-timeout" className="font-medium text-foreground">Session Timeout (minutes)</Label>
        <Select defaultValue="30">
          <SelectTrigger className="w-[120px] bg-background border-input focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="60">60</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function AgentBehavioralDefaultsContent(): ReactNode {
  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="agent-autonomy" className="font-medium text-foreground">Default Agent Autonomy</Label>
        <Select defaultValue="supervised">
          <SelectTrigger className="w-[150px] bg-background border-input focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supervised">Supervised</SelectItem>
            <SelectItem value="semi-autonomous">Semi-Autonomous</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="agent-logging" className="font-medium text-foreground">Default Logging Level</Label>
        <Switch id="agent-logging" />
         <span className="text-xs text-muted-foreground ml-2">Verbose</span>
      </div>
    </div>
  );
}

function ThemeCustomizationContent(): ReactNode {
  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="theme-mode" className="font-medium text-foreground">Appearance</Label>
        <Select defaultValue="dark">
          <SelectTrigger className="w-[150px] bg-background border-input focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Accent color picker can be more complex, placeholder for now */}
    </div>
  );
}

function DeveloperModeContent(): ReactNode {
  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="dev-mode" className="font-medium text-foreground">Enable Developer Mode</Label>
        <Switch id="dev-mode" />
      </div>
      <p className="text-xs text-muted-foreground">Enables advanced debugging tools and telemetry.</p>
    </div>
  );
}

function NotificationPreferencesContent(): ReactNode {
  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="email-notifs" className="font-medium text-foreground">Email Notifications</Label>
        <Switch id="email-notifs" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="inapp-notifs" className="font-medium text-foreground">In-App Notifications</Label>
        <Switch id="inapp-notifs" defaultChecked />
      </div>
    </div>
  );
}


export default function SettingsPage() {
  const settingsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'userProfileSettings',
      title: 'User Profile',
      icon: <UserCircle className="w-5 h-5" />,
      content: <UserProfileSettingsContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 4, h: 9, minW: 3, minH: 6 },
        md: { x: 0, y: 0, w: 5, h: 9, minW: 3, minH: 6 },
        sm: { x: 0, y: 0, w: 6, h: 8, minW: 3, minH: 5 },
      },
    },
    {
      id: 'organizationSettings',
      title: 'Organization',
      icon: <Building className="w-5 h-5" />,
      content: <OrganizationSettingsContent />,
      defaultLayout: {
        lg: { x: 4, y: 0, w: 4, h: 9, minW: 3, minH: 6 },
        md: { x: 5, y: 0, w: 5, h: 9, minW: 3, minH: 6 },
        sm: { x: 0, y: 8, w: 6, h: 8, minW: 3, minH: 5 },
      },
    },
    {
      id: 'planBillingSummary',
      title: 'Plan & Billing',
      icon: <CreditCard className="w-5 h-5" />,
      content: <PlanBillingSummaryContent />,
      defaultLayout: {
        lg: { x: 8, y: 0, w: 4, h: 9, minW: 3, minH: 5 },
        md: { x: 0, y: 9, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 16, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'apiKeyManagement',
      title: 'API Keys',
      icon: <KeyRound className="w-5 h-5" />,
      content: <ApiKeyManagementContent />,
      defaultLayout: {
        lg: { x: 0, y: 9, w: 4, h: 8, minW: 3, minH: 5 },
        md: { x: 5, y: 9, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 23, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
     {
      id: 'appSettings',
      title: 'Application Settings',
      icon: <Settings className="w-5 h-5" />,
      content: <AppSettingsContent />,
      defaultLayout: {
        lg: { x: 4, y: 9, w: 4, h: 8, minW: 3, minH: 5 },
        md: { x: 0, y: 17, w: 5, h: 7, minW: 3, minH: 4 },
        sm: { x: 0, y: 30, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'agentBehavioralDefaults',
      title: 'Agent Rules & Defaults',
      icon: <UserCog className="w-5 h-5" />,
      content: <AgentBehavioralDefaultsContent />,
      defaultLayout: {
        lg: { x: 8, y: 9, w: 4, h: 8, minW: 3, minH: 5 },
        md: { x: 5, y: 17, w: 5, h: 7, minW: 3, minH: 4 },
        sm: { x: 0, y: 36, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'themeCustomization',
      title: 'Theme Customization',
      icon: <Palette className="w-5 h-5" />,
      content: <ThemeCustomizationContent />,
      defaultLayout: {
        lg: { x: 0, y: 17, w: 4, h: 7, minW: 3, minH: 4 },
        md: { x: 0, y: 24, w: 5, h: 6, minW: 3, minH: 4 },
        sm: { x: 0, y: 42, w: 6, h: 5, minW: 3, minH: 3 },
      },
    },
    {
      id: 'notificationPreferences',
      title: 'Notification Preferences',
      icon: <BellRing className="w-5 h-5" />,
      content: <NotificationPreferencesContent />,
      defaultLayout: {
        lg: { x: 4, y: 17, w: 4, h: 7, minW: 3, minH: 4 },
        md: { x: 5, y: 24, w: 5, h: 6, minW: 3, minH: 4 },
        sm: { x: 0, y: 47, w: 6, h: 5, minW: 3, minH: 3 },
      },
    },
    {
      id: 'developerMode',
      title: 'Developer Mode',
      icon: <Terminal className="w-5 h-5" />,
      content: <DeveloperModeContent />,
      defaultLayout: {
        lg: { x: 8, y: 17, w: 4, h: 7, minW: 3, minH: 4 },
        md: { x: 0, y: 30, w: 10, h: 6, minW: 4, minH: 3 },
        sm: { x: 0, y: 52, w: 6, h: 5, minW: 3, minH: 3 },
      },
    }
  ];
  
  const SaveSettingsButton = () => (
      <div className="p-4 flex justify-end sticky bottom-0 bg-background/50 backdrop-blur-sm border-t border-border">
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-5 w-5"/>Save All Settings
        </Button>
      </div>
  );

  return (
    <div className="flex flex-col flex-grow h-full">
        <WorkspaceGrid
          zoneConfigs={settingsPageZoneConfigs}
          className="flex-grow" 
        />
        <SaveSettingsButton/>
    </div>
  );
}

    