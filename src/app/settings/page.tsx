import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Palette, Terminal, BellRing, UserCog } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Zone title="Application Settings" icon={<Settings className="w-5 h-5" />} className="lg:col-span-1">
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
      </Zone>

      <Zone title="Agent Behavioral Defaults" icon={<UserCog className="w-5 h-5" />} className="lg:col-span-1">
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
      </Zone>
      
      <Zone title="Theme Customization" icon={<Palette className="w-5 h-5" />} className="lg:col-span-1">
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
      </Zone>

      <Zone title="Developer Mode" icon={<Terminal className="w-5 h-5" />} className="lg:col-span-2">
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
      </Zone>

       <Zone title="Notification Preferences" icon={<BellRing className="w-5 h-5" />} className="lg:col-span-1">
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
      </Zone>

      <div className="lg:col-span-3 mt-4 flex justify-end">
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Save All Settings</Button>
      </div>
    </div>
  );
}
