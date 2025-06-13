
// src/components/dashboard/CommandObservatory.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Cpu, Activity, ListChecks } from 'lucide-react'; // Added icons

// Mock data for agent blocks
const mockAgents = [
  { id: 'agent_orion', name: 'OrionCore', status: 'Active', task: 'System Monitoring' },
  { id: 'agent_nexus', name: 'NexusGuard', status: 'Idle', task: 'Security Sweep Pending' },
  { id: 'agent_data', name: 'DataHarvesterX', status: 'Processing', task: 'Analyzing Q4 Logs' },
];

// Mock data for orchestration feed
const mockFeedEntries = [
  { id: 'feed_1', time: '10:30:05', agent: 'DataMinerX', action: 'started task \'AnalyzeSalesData\'.' },
  { id: 'feed_2', time: '10:30:15', agent: 'System', action: 'Security scan initiated.' },
  { id: 'feed_3', time: '10:31:00', agent: 'OptimizerPrime', action: 'suggested update for \'BillingModule\'.' },
  { id: 'feed_4', time: '10:32:50', agent: 'NexusGuard', action: 'detected anomalous login attempt.' },
  { id: 'feed_5', time: '10:33:15', agent: 'OrionCore', action: 'scaled up \'WebAppService\' instances.' },
];

const AgentPresenceGridPlaceholder: React.FC = () => {
  const handleAgentBlockClick = (agentId: string, agentName: string) => {
    console.log(`Agent block clicked: ${agentName} (ID: ${agentId}). Future: Show agent detail overlay.`);
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
            className="p-2.5 rounded-lg bg-background/40 hover:bg-primary/10 border border-primary/20 cursor-pointer transition-all"
            title={`Click to view details for ${agent.name}`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-foreground">{agent.name}</p>
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  agent.status === 'Active' && "bg-green-500/20 text-green-400",
                  agent.status === 'Idle' && "bg-yellow-500/20 text-yellow-400",
                  agent.status === 'Processing' && "bg-blue-500/20 text-blue-400"
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
      </CardContent>
    </Card>
  );
};

const LiveOrchestrationFeedPlaceholder: React.FC = () => {
  const handleOrchestrationEntryClick = (entryId: string, entryText: string) => {
    console.log(`Orchestration entry clicked: ${entryText} (ID: ${entryId}). Future: Show detail overlay.`);
  };

  return (
    <Card className="h-full flex flex-col bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)] rounded-2xl">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <ListChecks className="h-4 w-4 mr-2 text-primary" /> Live Orchestration Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden px-1 pb-1 pt-0">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-1.5 py-1">
            {mockFeedEntries.map((entry) => {
              const entryText = `[${entry.time}] Agent '${entry.agent}' ${entry.action}`;
              return (
                <div
                  key={entry.id}
                  onClick={() => handleOrchestrationEntryClick(entry.id, entryText)}
                  className="text-xs p-2 rounded-md bg-background/30 hover:bg-primary/10 border border-primary/10 cursor-pointer transition-colors"
                  title={`Click for details on: ${entry.agent} - ${entry.action}`}
                >
                  <span className="text-muted-foreground/80 mr-1.5">{entry.time}</span>
                  <span className="font-medium text-primary/90">{entry.agent}:</span>
                  <span className="text-foreground/90 ml-1">{entry.action}</span>
                </div>
              );
            })}
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
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <div className="flex-grow grid md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 overflow-hidden">
        {/* Left Column (1/3 width on md+) */}
        <div className="md:col-span-1 flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-grow"> {/* Scroll for the column itself */}
            <div className="space-y-3 md:space-y-4">
              <AgentPresenceGridPlaceholder />
              <SystemSnapshotPlaceholder />
            </div>
          </ScrollArea>
        </div>

        {/* Right Column (2/3 width on md+) */}
        <div className="md:col-span-2 h-full flex flex-col overflow-hidden">
          <LiveOrchestrationFeedPlaceholder />
        </div>
      </div>
    </div>
  );
}
