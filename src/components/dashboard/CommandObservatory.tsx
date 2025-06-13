
// src/components/dashboard/CommandObservatory.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Placeholder components for the new layout
const AgentPresenceGridPlaceholder: React.FC = () => {
  return (
    <Card className="h-64 bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)]">
      <CardHeader>
        <CardTitle className="text-base font-medium text-foreground">Agent Presence Grid</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Placeholder for agent status and activity grid.</p>
      </CardContent>
    </Card>
  );
};

const SystemSnapshotPlaceholder: React.FC = () => {
  return (
    <Card className="h-64 bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)]">
      <CardHeader>
        <CardTitle className="text-base font-medium text-foreground">System Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Placeholder for key system health metrics and performance indicators.</p>
      </CardContent>
    </Card>
  );
};

const LiveOrchestrationFeedPlaceholder: React.FC = () => {
  return (
    <Card className="h-full bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)]">
      <CardHeader>
        <CardTitle className="text-base font-medium text-foreground">Live Orchestration Feed</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_4rem)]"> {/* Adjust height based on header */}
        <ScrollArea className="h-full">
          <p className="text-sm text-muted-foreground">Placeholder for a real-time feed of agent orchestrations, commands, and system events.</p>
          {/* Example feed items */}
          <div className="mt-2 space-y-2 text-xs">
            <p>[10:30:05] Agent 'DataMinerX' started task 'AnalyzeSalesData'.</p>
            <p>[10:30:15] System: Security scan initiated.</p>
            <p>[10:31:00] Agent 'OptimizerPrime' suggested update for 'BillingModule'.</p>
          </div>
        </ScrollArea>
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
        borderWidth: '1px', // Ensure the border is actually visible
        borderStyle: 'solid',
      }}
    >
      <div className="flex-grow grid md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 overflow-hidden">
        {/* Left Column (1/3 width on md+) */}
        <div className="md:col-span-1 flex flex-col gap-3 md:gap-4 h-full overflow-hidden">
          <ScrollArea className="flex-grow"> {/* Scroll for the column itself */}
            <div className="space-y-3 md:space-y-4">
              <AgentPresenceGridPlaceholder />
              <SystemSnapshotPlaceholder />
            </div>
          </ScrollArea>
        </div>

        {/* Right Column (2/3 width on md+) */}
        <div className="md:col-span-2 h-full overflow-hidden">
          <LiveOrchestrationFeedPlaceholder />
        </div>
      </div>
    </div>
  );
}
