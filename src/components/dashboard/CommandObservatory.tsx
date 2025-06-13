// src/components/dashboard/CommandObservatory.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Activity, ListChecks } from 'lucide-react';
import LiveOrchestrationsFeed from './LiveOrchestrationsFeed';
import AgentPresenceGrid from './AgentPresenceGrid'; // Import the new component

const SystemSnapshotPlaceholder: React.FC = () => {
  return (
    <Card className="h-auto bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)] rounded-2xl">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <Activity className="h-4 w-4 mr-2 text-primary" /> System Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-1.5 text-sm">
        <p className="text-muted-foreground">CPU Load: <span className="text-foreground font-medium">35%</span></p>
        <p className="text-muted-foreground">Memory Usage: <span className="text-foreground font-medium">60%</span></p>
        <p className="text-muted-foreground">Network I/O: <span className="text-foreground font-medium">1.2 Gbps</span></p>
        <p className="text-muted-foreground">Active Tasks: <span className="text-foreground font-medium">12</span></p>
        <p className="text-muted-foreground">Security Score: <span className="text-green-400 font-medium">98/100</span></p>
      </CardContent>
    </Card>
  );
};

export default function CommandObservatory() {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col max-w-none mx-auto overflow-hidden backdrop-blur-md"
      )}
      style={{
        backgroundColor: 'rgba(12,22,26,0.85)',
        borderColor: 'rgba(142,255,215,0.12)',
        boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.05)',
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <div className="flex-grow grid md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 overflow-hidden">
        {/* Left Column (1/3 width on md+) */}
        <div className="md:col-span-1 h-full flex flex-col overflow-hidden">
          <ScrollArea className="flex-grow pr-1">
            <div className="space-y-3 md:space-y-4">
              <AgentPresenceGrid /> {/* Use the new component */}
              <SystemSnapshotPlaceholder />
            </div>
          </ScrollArea>
        </div>

        {/* Right Column (2/3 width on md+) */}
        <div className="md:col-span-2 h-full flex flex-col overflow-hidden">
          <LiveOrchestrationsFeed />
        </div>
      </div>
    </div>
  );
}
