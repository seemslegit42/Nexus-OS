// src/components/dashboard/CommandObservatory.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming CardHeader might be needed for placeholders
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Placeholder components for the new layout
// These would ideally be separate files but are defined inline for this refactoring step.

const AgentPresenceGrid: React.FC = () => {
  return (
    <Card className="h-64 border-primary/20 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-foreground">Agent Presence</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Placeholder for agent presence grid.</p>
        {/* Mock agent status items */}
        <div className="mt-2 space-y-1 text-xs">
          <p>Agent Orion: <span className="text-green-400">Active</span></p>
          <p>Agent Scribe: <span className="text-yellow-400">Idle</span></p>
          <p>Agent Guardian: <span className="text-red-400">Error</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

const SystemSnapshot: React.FC = () => {
  return (
    <Card className="h-64 border-primary/20 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-foreground">System Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Placeholder for system health snapshot.</p>
         {/* Mock system metrics */}
        <div className="mt-2 space-y-1 text-xs">
            <p>CPU Load: <span className="text-foreground">35%</span></p>
            <p>Memory Usage: <span className="text-foreground">60%</span></p>
            <p>Network I/O: <span className="text-foreground">Normal</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

const LiveOrchestrationsFeed: React.FC = () => {
  return (
    <Card className="h-full border-primary/20 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-medium text-foreground">Live Orchestrations Feed</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_4rem)]"> {/* Adjust height based on header */}
        <ScrollArea className="h-full">
            <p className="text-sm text-muted-foreground">Placeholder for live agent orchestration feed.</p>
            {/* Mock feed items */}
            <div className="mt-2 space-y-2 text-xs">
                <p>[10:35:12] Agent Task Started: 'ProcessInvoices' by Agent Scribe</p>
                <p>[10:35:45] Agent Task Completed: 'ProcessInvoices' - 50 invoices processed</p>
                <p>[10:36:02] Agent Communication: Orion to Guardian - 'Security scan requested'</p>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default function CommandObservatory() {
  return (
    <Card 
      className={cn(
        "w-full h-full flex flex-col max-w-7xl mx-auto overflow-hidden backdrop-blur-md", // Increased max-width
        "border" // Ensure border width is applied, color comes from style
      )}
      style={{
        backgroundColor: 'rgba(12,22,26,0.85)', 
        borderColor: 'rgba(142,255,215,0.12)', 
        boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.05)',
        // borderWidth: '1px', // This is handled by the "border" class from Tailwind/ShadCN Card default
      }}
    >
      {/* Optional global header for the observatory - can be uncommented if needed
      <CardHeader className="pb-4 border-b" style={{borderColor: 'rgba(142,255,215,0.08)'}}>
        <CardTitle className="text-xl md:text-2xl font-headline text-foreground">
          Command Observatory
        </CardTitle>
      </CardHeader>
      */}
      <CardContent className="flex-grow grid md:grid-cols-3 gap-4 p-3 md:p-4 overflow-hidden">
        {/* Left Column */}
        <div className="md:col-span-1 flex flex-col gap-4 h-full overflow-hidden">
          <ScrollArea className="flex-grow"> {/* Scroll for the column itself if content overflows */}
            <div className="space-y-4">
                <AgentPresenceGrid />
                <SystemSnapshot />
            </div>
          </ScrollArea>
        </div>
        {/* Right Column */}
        <div className="md:col-span-2 h-full overflow-hidden">
          <LiveOrchestrationsFeed /> {/* This component handles its own internal scrolling if needed */}
        </div>
      </CardContent>
    </Card>
  );
}

    