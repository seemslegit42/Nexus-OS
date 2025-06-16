
// src/components/dashboard/AgentPresenceGrid.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cpu, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentInfo {
  id: string;
  name: string;
  personaName: string;
  status: 'Idle' | 'Executing' | 'Offline' | 'Error';
  workload: number; 
  activeOrchestrations: string[];
  currentTask: string | null;
  memoryPreview: { used: string; total: string; summary: string };
}

const mockAgentsData: AgentInfo[] = [
  {
    id: 'agent_orion',
    name: 'OrionCore_7B',
    personaName: 'System Optimizer Prime',
    status: 'Executing',
    workload: 85,
    activeOrchestrations: ['LogProcessing_HighTraffic', 'SecurityScan_Critical'],
    currentTask: "Optimizing resource allocation for 'Project Phoenix'",
    memoryPreview: { used: '2.1GB', total: '4GB', summary: 'Core system functions, anomaly detection model loaded.' },
  },
  {
    id: 'agent_nexus',
    name: 'NexusGuard_Alpha',
    personaName: 'Network Sentinel',
    status: 'Idle',
    workload: 15,
    activeOrchestrations: [],
    currentTask: null,
    memoryPreview: { used: '512MB', total: '2GB', summary: 'Firewall rules, basic monitoring scripts.' },
  },
  {
    id: 'agent_data',
    name: 'DataHarvesterX_v2',
    personaName: 'Insight Extractor',
    status: 'Executing',
    workload: 60,
    activeOrchestrations: ['ETL_SalesData_Q4'],
    currentTask: "Aggregating sales data from Q4 sources",
    memoryPreview: { used: '1.5GB', total: '3GB', summary: 'Data aggregation, transformation scripts, temporary datasets.' },
  },
  {
    id: 'agent_reflex',
    name: 'ReflexRoutine_Bot',
    personaName: 'Automated Responder',
    status: 'Error',
    workload: 5,
    activeOrchestrations: ['Email_Triage_Failed'],
    currentTask: "Attempting to process incoming email queue (failed)",
    memoryPreview: { used: '256MB', total: '1GB', summary: 'Rule engine, NLP model (partially loaded).' },
  },
  {
    id: 'agent_scribe',
    name: 'ContentScribe_AI',
    personaName: 'Creative Assistant',
    status: 'Idle',
    workload: 22,
    activeOrchestrations: [],
    currentTask: null,
    memoryPreview: { used: '780MB', total: '2GB', summary: 'Language models, style guides, content templates.' },
  },
];

const AgentStatusIcon: React.FC<{ status: AgentInfo['status'] }> = ({ status }) => {
  switch (status) {
    case 'Executing': return <Loader2 className="h-3.5 w-3.5 text-blue-400 animate-spin" />;
    case 'Idle': return <CheckCircle className="h-3.5 w-3.5 text-green-400" />;
    case 'Offline': return <XCircle className="h-3.5 w-3.5 text-muted-foreground" />;
    case 'Error': return <AlertTriangle className="h-3.5 w-3.5 text-red-400" />;
    default: return null;
  }
};

const AgentDetailPanel: React.FC<{ agent: AgentInfo }> = ({ agent }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[var(--blur)] text-card-foreground shadow-[var(--shadow-soft)] p-3 mt-2 text-xs space-y-1.5"
      )}
    >
      <h4 className="text-sm font-semibold text-primary mb-1">{agent.personaName}</h4>
      <p><strong>Agent ID:</strong> {agent.id}</p>
      <p>
        <strong>Status:</strong> <span className={cn(
            agent.status === 'Executing' && "text-blue-400",
            agent.status === 'Idle' && "text-green-400",
            agent.status === 'Error' && "text-red-400",
            agent.status === 'Offline' && "text-muted-foreground"
        )}>{agent.status}</span> (Workload: {agent.workload}%)
      </p>
      <p><strong>Current Task:</strong> {agent.currentTask || 'N/A'}</p>
      <div>
        <strong>Memory Log (Static):</strong>
        <p className="mt-0.5 text-[10px] text-muted-foreground leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      {agent.activeOrchestrations.length > 0 && (
        <div className="mt-1">
          <strong>Active Orchestrations:</strong>
          <ul className="list-disc list-inside pl-2 text-muted-foreground">
            {agent.activeOrchestrations.map(orch => <li key={orch} className="text-[10px]">{orch}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

const AgentEntry: React.FC<{ agent: AgentInfo }> = ({ agent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isExecuting = agent.status === 'Executing';

  return (
    <div>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "p-2.5 rounded-lg bg-background/40 hover:bg-primary/10 border border-primary/20 cursor-pointer transition-all hover:shadow-md hover:border-primary/40 active:scale-[0.98]",
          isExecuting && "shadow-[0_0_15px_1px_hsl(var(--primary)/0.3)] animate-pulse-jade",
          isExpanded && "ring-1 ring-primary/70 border-primary/60 bg-primary/5"
        )}
        title={`Click to view details for ${agent.name}`}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-foreground truncate">{agent.name}</p>
          <AgentStatusIcon status={agent.status} />
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {agent.currentTask ? `Task: ${agent.currentTask.substring(0,30)}${agent.currentTask.length > 30 ? '...' : ''}` : `Workload: ${agent.workload}%`}
        </p>
      </div>
      {isExpanded && <AgentDetailPanel agent={agent} />}
    </div>
  );
};

export default function AgentPresenceGrid() {
  return (
    <Card className="h-auto bg-transparent border-none shadow-none">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-primary" /> Agent Presence
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <ScrollArea className="max-h-[calc(100vh_-_var(--topbar-height,_4rem)_-_var(--observatory-padding,_2rem)_-_150px)] sm:max-h-[300px] md:max-h-none pr-1">
          <div className="space-y-2">
            {mockAgentsData.map((agent) => (
              <AgentEntry key={agent.id} agent={agent} />
            ))}
            {mockAgentsData.length === 0 && <p className="text-sm text-muted-foreground">No active agents.</p>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

