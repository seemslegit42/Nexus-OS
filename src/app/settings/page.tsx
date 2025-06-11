
// src/app/settings/page.tsx
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, UserCircle, Building, Palette, Settings as AppSettingsIcon, BellRing, UserCog, KeyRound, Terminal, CreditCard, Settings2 as PageSettingsIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';

// Content Functions (previously in ZoneConfig.content)

function UserProfileSettingsContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-md"><UserCircle className="mr-2 h-5 w-5" /> User Profile</CardTitle>
        <CardDescription>Manage your personal information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="fullName" className="text-xs">Full Name</Label>
          <Input id="fullName" defaultValue="Alex Ryder" className="mt-1 bg-background border-input focus:ring-primary h-8 text-sm" />
        </div>
        <div>
          <Label htmlFor="email" className="text-xs">Email Address</Label>
          <Input id="email" type="email" defaultValue="alex.ryder@example.com" className="mt-1 bg-background border-input focus:ring-primary h-8 text-sm" />
        </div>
        <div>
          <Label htmlFor="avatar" className="text-xs">Avatar URL</Label>
          <Input id="avatar" placeholder="https://..." className="mt-1 bg-background border-input focus:ring-primary h-8 text-sm" />
        </div>
      </CardContent>
    </Card>
  );
}

function OrganizationSettingsContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-md"><Building className="mr-2 h-5 w-5" /> Organization</CardTitle>
        <CardDescription>Manage your organization's details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="orgName" className="text-xs">Organization Name</Label>
          <Input id="orgName" defaultValue="NexOS Innovations Inc." className="mt-1 bg-background border-input focus:ring-primary h-8 text-sm" />
        </div>
        <div>
          <Label htmlFor="orgAddress" className="text-xs">Address</Label>
          <Textarea id="orgAddress" placeholder="123 Future Drive, Cyberspace" className="mt-1 bg-background border-input focus:ring-primary min-h-[50px] text-sm" />
        </div>
      </CardContent>
    </Card>
  );
}

function ThemeCustomizationContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-md"><Palette className="mr-2 h-5 w-5" /> Theme Customization</CardTitle>
        <CardDescription>Personalize the look and feel of NexOS.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="theme-mode" className="text-sm text-foreground">Appearance Mode</Label>
          <Select defaultValue="dark">
            <SelectTrigger className="w-[120px] bg-background border-input focus:ring-primary h-8 text-xs">
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
            <Label htmlFor="accent-color" className="text-sm text-foreground">Accent Color</Label>
            <Input id="accent-color" type="color" defaultValue="#34D399" className="w-full h-8 mt-1 p-1 bg-background border-input focus:ring-primary"/>
        </div>
      </CardContent>
    </Card>
  );
}

function AppSettingsContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-md"><AppSettingsIcon className="mr-2 h-5 w-5" /> Application Settings</CardTitle>
        <CardDescription>Configure core application behaviors.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="realtime-updates" className="text-sm text-foreground">Real-time Updates</Label>
          <Switch id="realtime-updates" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="session-timeout" className="text-sm text-foreground">Session Timeout</Label>
          <Select defaultValue="30">
            <SelectTrigger className="w-[100px] bg-background border-input focus:ring-primary h-8 text-xs">
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
          <Label htmlFor="language-settings" className="text-sm text-foreground">Language</Label>
          <Select defaultValue="en-US">
            <SelectTrigger className="w-[120px] bg-background border-input focus:ring-primary h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationPreferencesContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-md"><BellRing className="mr-2 h-5 w-5" /> Notification Preferences</CardTitle>
        <CardDescription>Choose how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifs" className="text-sm text-foreground">Email Notifications</Label>
          <Switch id="email-notifs" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="inapp-notifs" className="text-sm text-foreground">In-App Notifications</Label>
          <Switch id="inapp-notifs" defaultChecked />
        </div>
         <div className="flex items-center justify-between">
          <Label htmlFor="sound-notifs" className="text-sm text-foreground">Notification Sounds</Label>
          <Switch id="sound-notifs" />
        </div>
      </CardContent>
    </Card>
  );
}

function AgentBehavioralDefaultsContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-md"><UserCog className="mr-2 h-5 w-5" /> Agent Defaults</CardTitle>
        <CardDescription>Set default behaviors for new agents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="agent-autonomy" className="text-sm text-foreground">Default Autonomy</Label>
          <Select defaultValue="supervised">
            <SelectTrigger className="w-[180px] bg-background border-input focus:ring-primary h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supervised">Supervised</SelectItem>
              <SelectItem value="semi-autonomous">Semi-Autonomous</SelectItem>
              <SelectItem value="fully-autonomous">Fully Autonomous (Caution)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="agent-logging" className="text-sm text-foreground">Default Logging Level</Label>
          <Select defaultValue="standard">
            <SelectTrigger className="w-[150px] bg-background border-input focus:ring-primary h-8 text-xs">
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
            <Label htmlFor="max-recursion" className="text-sm text-foreground">Max Self-Correction Loops</Label>
            <Input id="max-recursion" type="number" defaultValue="5" className="w-[80px] h-8 text-xs bg-background border-input focus:ring-primary"/>
        </div>
      </CardContent>
    </Card>
  );
}

function ApiKeyManagementContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-md"><KeyRound className="mr-2 h-5 w-5" /> API Key Management</CardTitle>
        <CardDescription>Manage API keys for accessing NexOS programmatically.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
         <ScrollArea className="h-full max-h-[150px] border rounded-md p-2 bg-muted/30">
            <div className="p-2 bg-background/80 rounded-sm mb-2">
                <p className="text-xs font-mono break-all">nexos_sk_live_xxxxxxxxxxxxYYYY</p>
                <p className="text-xs text-muted-foreground">Label: Main Production Key</p>
                <p className="text-xs text-muted-foreground">Created: 2023-01-15 | Last Used: 2023-10-25</p>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs text-destructive hover:text-destructive/80">Revoke Key</Button>
            </div>
            <div className="p-2 bg-background/80 rounded-sm">
                <p className="text-xs font-mono break-all">nexos_sk_dev_zzzzzzzzzzzzXXXX</p>
                <p className="text-xs text-muted-foreground">Label: Staging Environment Key</p>
                <p className="text-xs text-muted-foreground">Created: 2023-08-01 | Last Used: Never</p>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs text-destructive hover:text-destructive/80">Revoke Key</Button>
            </div>
        </ScrollArea>
        <Button variant="outline" className="w-full"> Generate New API Key</Button>
      </CardContent>
    </Card>
  );
}

function DeveloperModeContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-md"><Terminal className="mr-2 h-5 w-5" /> Developer Mode</CardTitle>
        <CardDescription>Access advanced tools and experimental features.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="dev-mode" className="text-sm text-foreground">Enable Developer Mode</Label>
          <Switch id="dev-mode" />
        </div>
        <p className="text-xs text-muted-foreground">Enables advanced debugging tools, agent telemetry viewers, and experimental features.</p>
        <div className="flex items-center justify-between">
          <Label htmlFor="raw-logs" className="text-sm text-foreground">Show Raw Agent Logs</Label>
          <Switch id="raw-logs" disabled />
        </div>
      </CardContent>
    </Card>
  );
}

function PlanBillingSummaryContent(): ReactNode {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-md"><CreditCard className="mr-2 h-5 w-5" /> Plan & Billing</CardTitle>
        <CardDescription>View your current plan and manage billing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Current Plan: Pro ($99/mo)</h3>
        <Card className="bg-muted/30">
          <CardHeader className="p-2"><CardTitle className="text-xs">Usage This Cycle</CardTitle></CardHeader>
          <CardContent className="p-2 text-xs">
            <p>Agent Compute: 85/200 hrs</p>
            <p>Token Usage: 550k/1M</p>
            <p>Storage: 12GB/50GB</p>
          </CardContent>
        </Card>
        <Link href="/billing" className="block w-full">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Manage Subscription & Billing</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

const SaveSettingsButton = () => (
    <div className="p-4 flex justify-end sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border z-10 mt-auto">
      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-5 w-5"/>Save All Settings
      </Button>
    </div>
);

export default function SettingsPage() {
  const settingsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'userProfileSettings',
      title: 'User Profile',
      icon: <UserCircle className="w-5 h-5" />,
      content: <UserProfileSettingsContent />,
      defaultLayout: { lg: { x: 0, y: 0, w: 4, h: 7, minW: 3, minH: 5 } },
    },
    {
      id: 'organizationSettings',
      title: 'Organization',
      icon: <Building className="w-5 h-5" />,
      content: <OrganizationSettingsContent />,
      defaultLayout: { lg: { x: 4, y: 0, w: 4, h: 7, minW: 3, minH: 5 } },
    },
    {
      id: 'themeCustomization',
      title: 'Theme Customization',
      icon: <Palette className="w-5 h-5" />,
      content: <ThemeCustomizationContent />,
      defaultLayout: { lg: { x: 8, y: 0, w: 4, h: 7, minW: 3, minH: 5 } },
    },
    {
      id: 'appSettings',
      title: 'Application Settings',
      icon: <AppSettingsIcon className="w-5 h-5" />,
      content: <AppSettingsContent />,
      defaultLayout: { lg: { x: 0, y: 7, w: 4, h: 8, minW: 3, minH: 6 } },
    },
    {
      id: 'notificationPreferences',
      title: 'Notification Preferences',
      icon: <BellRing className="w-5 h-5" />,
      content: <NotificationPreferencesContent />,
      defaultLayout: { lg: { x: 4, y: 7, w: 4, h: 8, minW: 3, minH: 5 } },
    },
    {
      id: 'agentBehavioralDefaults',
      title: 'Agent Defaults',
      icon: <UserCog className="w-5 h-5" />,
      content: <AgentBehavioralDefaultsContent />,
      defaultLayout: { lg: { x: 8, y: 7, w: 4, h: 8, minW: 3, minH: 6 } },
    },
    {
      id: 'apiKeyManagement',
      title: 'API Key Management',
      icon: <KeyRound className="w-5 h-5" />,
      content: <ApiKeyManagementContent />,
      defaultLayout: { lg: { x: 0, y: 15, w: 4, h: 7, minW: 3, minH: 6 } },
    },
    {
      id: 'developerMode',
      title: 'Developer Mode',
      icon: <Terminal className="w-5 h-5" />,
      content: <DeveloperModeContent />,
      defaultLayout: { lg: { x: 4, y: 15, w: 4, h: 7, minW: 3, minH: 5 } },
    },
    {
      id: 'planBillingSummary',
      title: 'Plan & Billing',
      icon: <CreditCard className="w-5 h-5" />,
      content: <PlanBillingSummaryContent />,
      defaultLayout: { lg: { x: 8, y: 15, w: 4, h: 7, minW: 3, minH: 6 } },
    },
  ];
  
  return (
    <div className="flex flex-col flex-grow h-full">
        <WorkspaceGrid
            zoneConfigs={settingsPageZoneConfigs}
            className="flex-grow p-2 md:p-4" 
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        />
        <SaveSettingsButton />
    </div>
  );
}
