
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
import { Save, UserCircle, Building, Palette, Settings as AppSettingsIcon, BellRing, UserCog, KeyRound, Terminal, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Content Functions (previously in ZoneConfig.content)

function UserProfileSettingsContent(): ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><UserCircle className="mr-2 h-5 w-5" /> User Profile</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5" /> Organization</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5" /> Theme Customization</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><AppSettingsIcon className="mr-2 h-5 w-5" /> Application Settings</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><BellRing className="mr-2 h-5 w-5" /> Notification Preferences</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><UserCog className="mr-2 h-5 w-5" /> Agent Defaults</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5" /> API Key Management</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Terminal className="mr-2 h-5 w-5" /> Developer Mode</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5" /> Plan & Billing</CardTitle>
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
          <Button className="w-full">Manage Subscription & Billing</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function SettingsPage() {
  
  const SaveSettingsButton = () => (
      <div className="p-4 flex justify-end sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border z-10">
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-5 w-5"/>Save All Settings
        </Button>
      </div>
  );

  return (
    <div className="flex flex-col flex-grow h-full p-2 md:p-4">
      <Tabs defaultValue="account" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="agent_api">Agent & API</TabsTrigger>
          <TabsTrigger value="developer">Developer</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-grow">
          <div className="space-y-4 pb-4 pr-1"> {/* Added padding for scrollbar */}
            <TabsContent value="account" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <UserProfileSettingsContent />
                <OrganizationSettingsContent />
              </div>
            </TabsContent>
            <TabsContent value="appearance" className="mt-0">
              <ThemeCustomizationContent />
            </TabsContent>
            <TabsContent value="application" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <AppSettingsContent />
                <NotificationPreferencesContent />
              </div>
            </TabsContent>
            <TabsContent value="agent_api" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                <AgentBehavioralDefaultsContent />
                <ApiKeyManagementContent />
              </div>
            </TabsContent>
            <TabsContent value="developer" className="mt-0">
              <DeveloperModeContent />
            </TabsContent>
            <TabsContent value="billing" className="mt-0">
              <PlanBillingSummaryContent />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
      <SaveSettingsButton/>
    </div>
  );
}

    