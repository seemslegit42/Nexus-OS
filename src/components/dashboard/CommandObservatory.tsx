
// src/components/dashboard/CommandObservatory.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Cpu, Activity, ListChecks } from 'lucide-react';
import LiveOrchestrationsFeed from './LiveOrchestrationsFeed'; // Import the new component

// Mock data for agent blocks
const mockAgents = [
  { id: 'agent_orion', name: 'OrionCore', status: 'Active', task: 'System Monitoring' },
  { id: 'agent_nexus', name: 'NexusGuard', status: 'Idle', task: 'Security Sweep Pending' },
  { id: 'agent_data', name: 'DataHarvesterX', status: 'Processing', task: 'Analyzing Q4 Logs' },
  { id: 'agent_reflex', name: 'ReflexRoutine', status: 'Error', task: 'Automated Email Response' },
  { id: 'agent_scribe', name: 'ContentScribe', status: 'Active', task: 'Drafting Blog Post Q2' },
];


const AgentPresenceGridPlaceholder: React.FC = () => {
  const handleAgentBlockClick = (agentId: string, agentName: string) => {
    console.log(`Agent block clicked: ${agentName} (ID: ${agentId}). Future: Show agent detail overlay.`);
    // Here you would typically set state to show an overlay/modal for this agent.
  };

  return (
    <Card className="h-auto bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)] rounded-2xl">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-primary" /> Agent Presence
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-2">
        {mockAgents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => handleAgentBlockClick(agent.id, agent.name)}
            className="p-2.5 rounded-lg bg-background/40 hover:bg-primary/10 border border-primary/20 cursor-pointer transition-all hover:shadow-md hover:border-primary/40 active:scale-[0.98]"
            title={`Click to view details for ${agent.name}`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-foreground">{agent.name}</p>
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-medium",
                  agent.status === 'Active' && "bg-green-500/20 text-green-400",
                  agent.status === 'Idle' && "bg-yellow-500/20 text-yellow-400",
                  agent.status === 'Processing' && "bg-blue-500/20 text-blue-400",
                  agent.status === 'Error' && "bg-red-500/20 text-red-400"
                )}
              >
                {agent.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{agent.task}</p>
          </div>
        ))}
        {mockAgents.length === 0 && <p className="text-sm text-muted-foreground">No active agents.</p>}
      </CardContent>
    </Card>
  );
};

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
        backgroundColor: 'rgba(12,22,26,0.85)', // Dark glass with subtle green/blue
        borderColor: 'rgba(142,255,215,0.12)', // Jade-like subtle border
        boxShadow: 'inset 0 0 0.5px rgba(255,255,255,0.05)', // Inner highlight for depth
        borderWidth: '1px',
        borderStyle: 'solid',
        // No rounded corners for the root observatory container
      }}
    >
      <div className="flex-grow grid md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 overflow-hidden">
        {/* Left Column (1/3 width on md+) */}
        <div className="md:col-span-1 h-full flex flex-col overflow-hidden">
          <ScrollArea className="flex-grow pr-1"> {/* Added pr-1 for scrollbar spacing */}
            <div className="space-y-3 md:space-y-4">
              <AgentPresenceGridPlaceholder />
              <SystemSnapshotPlaceholder />
            </div>
          </ScrollArea>
        </div>

        {/* Right Column (2/3 width on md+) */}
        <div className="md:col-span-2 h-full flex flex-col overflow-hidden">
          <LiveOrchestrationsFeed /> {/* Use the new component */}
        </div>
      </div>
    </div>
  );
}
