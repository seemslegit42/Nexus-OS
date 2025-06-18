'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Users, Pulse } from '@phosphor-icons/react';

interface WorkloadItem {
  id: string;
  agentName: string;
  taskType: string;
  status: 'running' | 'queued' | 'completed' | 'failed';
  progress?: number;
  estimatedTime?: string;
}

interface AgentWorkloadPreviewProps {
  className?: string;
}

export function AgentWorkloadPreview({ className }: AgentWorkloadPreviewProps) {
  // Mock data - replace with real data from your store/API
  const workloadItems: WorkloadItem[] = [
    {
      id: '1',
      agentName: 'DataMinerX',
      taskType: 'Data Analysis',
      status: 'running',
      progress: 75,
      estimatedTime: '2m',
    },
    {
      id: '2',
      agentName: 'SecurityBot',
      taskType: 'Vulnerability Scan',
      status: 'queued',
      estimatedTime: '5m',
    },
    {
      id: '3',
      agentName: 'ProcessorAI',
      taskType: 'Document Processing',
      status: 'completed',
    },
  ];

  const getStatusColor = (status: WorkloadItem['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'queued':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: WorkloadItem['status']) => {
    switch (status) {
      case 'running':
        return <Pulse className="h-3 w-3" />;
      case 'queued':
        return <Cpu className="h-3 w-3" />;
      case 'completed':
        return <Users className="h-3 w-3" />;
      default:
        return <Cpu className="h-3 w-3" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm font-medium">
          <Cpu className="mr-2 h-4 w-4" />
          Agent Workload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {workloadItems.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-md bg-muted/30 p-2"
          >
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className={`${getStatusColor(item.status)} text-white`}
              >
                {getStatusIcon(item.status)}
              </Badge>
              <div>
                <p className="text-xs font-medium">{item.agentName}</p>
                <p className="text-xs text-muted-foreground">{item.taskType}</p>
              </div>
            </div>
            <div className="text-right">
              {item.progress && (
                <p className="text-xs font-medium">{item.progress}%</p>
              )}
              {item.estimatedTime && (
                <p className="text-xs text-muted-foreground">
                  {item.estimatedTime}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
