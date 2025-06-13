// src/components/dashboard/AgentPresenceGrid.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cpu, Zap, Database, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AgentInfo {
  id: string;
  name: string;
  personaName: string;
  status: 'Idle' | 'Executing' | 'Offline' | 'Error';
  workload: number; // percentage
  activeOrchestrations: string[];
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
    memoryPreview: { used: '2.1GB', total: '4GB', summary: 'Core system functions, anomaly detection model loaded.' },
  },
  {
    id: 'agent_nexus',
    name: 'NexusGuard_Alpha',
    personaName: 'Network Sentinel',
    status: 'Idle',
    workload: 15,
    activeOrchestrations: [],
    memoryPreview: { used: '512MB', total: '2GB', summary: 'Firewall rules, basic monitoring scripts.' },
  },
  {
    id: 'agent_data',
    name: 'DataHarvesterX_v2',
    personaName: 'Insight Extractor',
    status: 'Executing',
    workload: 60,
    activeOrchestrations: ['ETL_SalesData_Q4'],
    memoryPreview: { used: '1.5GB', total: '3GB', summary: 'Data aggregation, transformation scripts, temporary datasets.' },
  },
  {
    id: 'agent_reflex',
    name: 'ReflexRoutine_Bot',
    personaName: 'Automated Responder',
    status: 'Error',
    workload: 5,
    activeOrchestrations: ['Email_Triage_Failed'],
    memoryPreview: { used: '256MB', total: '1GB', summary: 'Rule engine, NLP model (partially loaded).' },
  },
  {
    id: 'agent_scribe',
    name: 'ContentScribe_AI',
    personaName: 'Creative Assistant',
    status: 'Idle',
    workload: 22,
    activeOrchestrations: [],
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

const AgentDetailPanel: React.FC<{ agent: AgentInfo; onClose: () => void }> = ({ agent, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="absolute inset-x-0 top-full mt-1 z-10 p-3 rounded-xl border bg-card/80 backdrop-blur-md shadow-xl border-primary/40"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside panel
    >
      <h4 className="text-sm font-semibold text-primary mb-1">{agent.personaName} (ID: {agent.id})</h4>
      <div className="space-y-1 text-xs">
        <p><strong>Status:</strong> <span className={cn(
            agent.status === 'Executing' && "text-blue-400",
            agent.status === 'Idle' && "text-green-400",
            agent.status === 'Error' && "text-red-400",
            agent.status === 'Offline' && "text-muted-foreground"
        )}>{agent.status}</span> (Workload: {agent.workload}%)</p>
        <div>
          <strong>Active Orchestrations:</strong>
          {agent.activeOrchestrations.length > 0 ? (
            <ul className="list-disc list-inside pl-2 text-muted-foreground">
              {agent.activeOrchestrations.map(orch => <li key={orch}>{orch}</li>)}
            </ul>
          ) : (
            <span className="text-muted-foreground ml-1">None</span>
          )}
        </div>
        <div>
          <strong>Memory Preview:</strong>
          <div className="p-1.5 bg-black/20 rounded text-muted-foreground text-[10px] font-code mt-0.5">
            <p>Used: {agent.memoryPreview.used} / Total: {agent.memoryPreview.total}</p>
            <p>Summary: {agent.memoryPreview.summary}</p>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="xs" onClick={onClose} className="mt-2 text-xs text-muted-foreground hover:text-foreground">Close</Button>
    </motion.div>
  );
};


const AgentBlock: React.FC<{ agent: AgentInfo; isActive: boolean; onClick: () => void; onCloseDetail: () => void; }> = ({ agent, isActive, onClick, onCloseDetail }) => {
  const isExecuting = agent.status === 'Executing';
  return (
    <div className="relative">
      <div
        onClick={onClick}
        className={cn(
          "p-2.5 rounded-lg bg-background/40 hover:bg-primary/10 border border-primary/20 cursor-pointer transition-all hover:shadow-md hover:border-primary/40 active:scale-[0.98]",
          isExecuting && "shadow-[0_0_15px_1px_hsl(var(--primary)/0.3)] animate-pulse-jade",
          isActive && "ring-2 ring-primary/70 border-primary/60"
        )}
        title={`Click to view details for ${agent.name}`}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-foreground truncate">{agent.name}</p>
          <AgentStatusIcon status={agent.status} />
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {agent.activeOrchestrations.length > 0 ? agent.activeOrchestrations[0] : `Workload: ${agent.workload}%`}
        </p>
      </div>
      <AnimatePresence>
        {isActive && <AgentDetailPanel agent={agent} onClose={onCloseDetail} />}
      </AnimatePresence>
    </div>
  );
};

export default function AgentPresenceGrid() {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  const handleAgentBlockClick = (agentId: string) => {
    setActiveAgentId(prevId => (prevId === agentId ? null : agentId));
  };
  
  const handleCloseDetail = () => {
    setActiveAgentId(null);
  };

  return (
    <Card className="h-auto bg-[rgba(15,25,20,0.25)] border border-[rgba(0,255,162,0.15)] backdrop-blur-sm shadow-[0_4px_20px_rgba(0,255,162,0.1)] rounded-2xl">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-base font-medium text-foreground flex items-center">
          <Cpu className="h-4 w-4 mr-2 text-primary" /> Agent Presence
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <ScrollArea className="max-h-[calc(100vh_-_var(--topbar-height,_4rem)_-_var(--observatory-padding,_2rem)_-_150px)] sm:max-h-[300px] md:max-h-none pr-1">
          <div className="space-y-2">
            {mockAgentsData.map((agent) => (
              <AgentBlock
                key={agent.id}
                agent={agent}
                isActive={activeAgentId === agent.id}
                onClick={() => handleAgentBlockClick(agent.id)}
                onCloseDetail={handleCloseDetail}
              />
            ))}
            {mockAgentsData.length === 0 && <p className="text-sm text-muted-foreground">No active agents.</p>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
