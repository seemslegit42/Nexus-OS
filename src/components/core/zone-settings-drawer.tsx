'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FloppyDisk as Save } from '@phosphor-icons/react';
import type { ZoneSpecificSettings } from './workspace-grid'; // Assuming type will be defined here

interface ZoneSettingsDrawerProps {
  zoneId: string | null;
  zoneTitle: string;
  currentSettings: ZoneSpecificSettings | undefined;
  onOpenChange: (open: boolean) => void;
  onSaveSettings: (zoneId: string, newSettings: ZoneSpecificSettings) => void;
}

const placeholderAgents = ['Agent Alpha', 'Agent Beta', 'Agent Gamma', 'None'];

export function ZoneSettingsDrawer({
  zoneId,
  zoneTitle,
  currentSettings,
  onOpenChange,
  onSaveSettings,
}: ZoneSettingsDrawerProps) {
  // Local state for form elements, initialized from currentSettings
  const [isVisible, setIsVisible] = React.useState(
    currentSettings?.isVisible ?? false
  );
  const [linkedAgent, setLinkedAgent] = React.useState(
    currentSettings?.linkedAgent || 'None'
  );
  const [scheduleTime, setScheduleTime] = React.useState(
    currentSettings?.scheduleTime || ''
  );
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(
    currentSettings?.notificationsEnabled ?? false
  );

  React.useEffect(() => {
    if (currentSettings) {
      setIsVisible(currentSettings.isVisible);
      setLinkedAgent(currentSettings.linkedAgent || 'None');
      setScheduleTime(currentSettings.scheduleTime || '');
      setNotificationsEnabled(currentSettings.notificationsEnabled);
    }
  }, [currentSettings]);

  if (!zoneId || !currentSettings) {
    return null;
  }

  const handleSave = () => {
    const newSettings: ZoneSpecificSettings = {
      ...currentSettings,
      isVisible,
      linkedAgent: linkedAgent === 'None' ? null : linkedAgent,
      scheduleTime: scheduleTime || null,
      notificationsEnabled,
      // hasActiveAutomation will be derived in WorkspaceGrid based on these settings
    };
    onSaveSettings(zoneId, newSettings);
    onOpenChange(false); // Close the drawer
  };

  return (
    <Sheet open={!!zoneId} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Settings: {zoneTitle}</SheetTitle>
          <SheetDescription>
            Configure settings for this workspace zone. Changes are saved
            locally.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-grow gap-6 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor={`visibility-${zoneId}`} className="text-sm">
              Show on Dashboard
            </Label>
            <Switch
              id={`visibility-${zoneId}`}
              checked={isVisible}
              onCheckedChange={setIsVisible}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`linked-agent-${zoneId}`} className="text-sm">
              Linked Agent
            </Label>
            <Select value={linkedAgent} onValueChange={setLinkedAgent}>
              <SelectTrigger
                id={`linked-agent-${zoneId}`}
                className="border-input bg-input focus:ring-primary"
              >
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {placeholderAgents.map(agent => (
                  <SelectItem key={agent} value={agent}>
                    {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`schedule-time-${zoneId}`} className="text-sm">
              Schedule Automation (Time)
            </Label>
            <Input
              id={`schedule-time-${zoneId}`}
              type="time"
              value={scheduleTime}
              onChange={e => setScheduleTime(e.target.value)}
              className="border-input bg-input focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor={`notifications-${zoneId}`} className="text-sm">
              Activity Notifications
            </Label>
            <Switch
              id={`notifications-${zoneId}`}
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
