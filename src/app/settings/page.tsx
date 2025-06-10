// src/app/settings/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Palette, Terminal, BellRing, UserCog } from 'lucide-react';

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
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="data-retention" className="font-medium text-foreground">Data Retention Policy</Label>
        <Select defaultValue="90d">
          <SelectTrigger className="w-[120px] bg-background border-input focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="forever">Forever</SelectItem>
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
            <SelectItem value="fully-autonomous">Fully Autonomous</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="agent-logging" className="font-medium text-foreground">Default Logging Level</Label>
        <Select defaultValue="verbose">
          <SelectTrigger className="w-[150px] bg-background border-input focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="verbose">Verbose</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="error-handling" className="font-medium text-foreground">Error Handling Strategy</Label>
        <Switch id="error-handling" />
        <span className="text-xs text-muted-foreground ml-2">Auto-Retry on Fail</span>
      </div>
    </div>
  );
}

function ThemeCustomizationContent(): ReactNode {
  return (
    <div className="space-y-4 p-2">
      <p className="text-sm text-muted-foreground">Customize the visual appearance of NexOS.</p>
      <div className="flex items-center justify-between">
        <Label htmlFor="theme-mode" className="font-medium text-foreground">Appearance</Label>
        <Select defaultValue="system">
          <SelectTrigger className="w-[150px] bg-background border-input focus:ring-primary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System Default</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label className="font-medium text-foreground">Accent Color</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 border-primary bg-primary/20"></Button>
          <Button variant="outline" size="icon" className="h-8 w-8 border-destructive bg-destructive/20"></Button>
          <Button variant="outline" size="icon" className="h-8 w-8 border-green-500 bg-green-500/20"></Button>
        </div>
      </div>
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
      <p className="text-xs text-muted-foreground">Enables advanced debugging tools and telemetry for agents and system components.</p>
      <div className="flex items-center justify-between">
        <Label htmlFor="agent-telemetry" className="font-medium text-foreground">Agent Telemetry Debugging</Label>
        <Switch id="agent-telemetry" disabled />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="raw-logs" className="font-medium text-foreground">Show Raw System Logs</Label>
        <Switch id="raw-logs" disabled />
      </div>
    </div>
  );
}

function NotificationPreferencesContent(): ReactNode {
  return (
    <div className="space-y-4 p-2">
      <p className="text-sm text-muted-foreground">Manage how you receive notifications.</p>
      <div className="flex items-center justify-between">
        <Label htmlFor="email-notifs" className="font-medium text-foreground">Email Notifications</Label>
        <Switch id="email-notifs" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="inapp-notifs" className="font-medium text-foreground">In-App Notifications</Label>
        <Switch id="inapp-notifs" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="sound-notifs" className="font-medium text-foreground">Notification Sounds</Label>
        <Switch id="sound-notifs" />
      </div>
    </div>
  );
}


export default function SettingsPage() {
  const settingsPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'appSettings',
      title: 'Application Settings',
      icon: <Settings className="w-5 h-5" />,
      content: <AppSettingsContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 4, h: 8, minW: 3, minH: 5 },
        md: { x: 0, y: 0, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 0, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'agentBehavioralDefaults',
      title: 'Agent Behavioral Defaults',
      icon: <UserCog className="w-5 h-5" />,
      content: <AgentBehavioralDefaultsContent />,
      defaultLayout: {
        lg: { x: 4, y: 0, w: 4, h: 8, minW: 3, minH: 5 },
        md: { x: 5, y: 0, w: 5, h: 8, minW: 3, minH: 5 },
        sm: { x: 0, y: 7, w: 6, h: 7, minW: 3, minH: 4 },
      },
    },
    {
      id: 'themeCustomization',
      title: 'Theme Customization',
      icon: <Palette className="w-5 h-5" />,
      content: <ThemeCustomizationContent />,
      defaultLayout: {
        lg: { x: 8, y: 0, w: 4, h: 8, minW: 3, minH: 5 },
        md: { x: 0, y: 8, w: 5, h: 7, minW: 3, minH: 4 },
        sm: { x: 0, y: 14, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'developerMode',
      title: 'Developer Mode',
      icon: <Terminal className="w-5 h-5" />,
      content: <DeveloperModeContent />,
      defaultLayout: {
        lg: { x: 0, y: 8, w: 8, h: 7, minW: 4, minH: 4 },
        md: { x: 5, y: 8, w: 5, h: 7, minW: 3, minH: 4 },
        sm: { x: 0, y: 20, w: 6, h: 6, minW: 3, minH: 4 },
      },
    },
    {
      id: 'notificationPreferences',
      title: 'Notification Preferences',
      icon: <BellRing className="w-5 h-5" />,
      content: <NotificationPreferencesContent />,
      defaultLayout: {
        lg: { x: 8, y: 8, w: 4, h: 7, minW: 3, minH: 4 },
        md: { x: 0, y: 15, w: 10, h: 6, minW: 4, minH: 4},
        sm: { x: 0, y: 26, w: 6, h: 6, minW: 3, minH: 4 },
      },
    }
  ];
  
  // Placeholder for the "Save All Settings" button, 
  // as it's outside the grid structure in the original.
  // It could be a separate static element or another zone if needed.
  const SaveSettingsButton = () => (
      <div className="mt-4 flex justify-end col-span-full"> {/* Use col-span-full if this were inside a CSS grid */}
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Save All Settings</Button>
      </div>
  );


  return (
    <div className="flex flex-col flex-grow">
        <WorkspaceGrid
        zoneConfigs={settingsPageZoneConfigs}
        className="flex-grow" // Grid takes available space
        />
        <SaveSettingsButton/>
    </div>
  );
}
