
// src/micro-apps/dashboard-widgets/activity-feed-widget.tsx
'use client';

import type { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Cpu, BarChartHorizontalBig, Shield, Newspaper } from 'lucide-react';

export function ActivityFeedWidget(): ReactNode {
  const feedItems = [
    { id: 'act1', agent: 'OptimizerPrime', task: 'Code Review #123', time: '2m ago', icon: <Cpu className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" /> },
    { id: 'act2', agent: 'DataMinerX', task: 'Sales Data Sync Q3', time: '15m ago', icon: <BarChartHorizontalBig className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" /> },
    { id: 'act3', agent: 'SecureGuard', task: 'System Scan initiated', time: '30m ago', icon: <Shield className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" /> },
    { id: 'act4', agent: 'ContentCreatorAI', task: 'Blog Post Draft v2', time: '1h ago', icon: <Newspaper className="h-4 w-4 mr-2.5 mt-0.5 text-primary flex-shrink-0" /> },
  ];

  return (
     <Card className="h-full bg-transparent border-none shadow-none flex flex-col">
      <CardContent className="p-1 md:p-2 flex-grow overflow-y-auto">
        <ul className="space-y-2">
          {feedItems.map((item) => (
            <li key={item.id}>
              <Card className="bg-card hover:bg-muted/70 border-border/70 transition-colors duration-150 ease-in-out hover:shadow-md">
                <CardContent className="p-2.5 text-xs flex items-start">
                  {item.icon}
                  <div className="flex-grow">
                    <span className="font-medium text-foreground">Agent '{item.agent}'</span> {item.task.toLowerCase().includes("completed") || item.task.toLowerCase().includes("initiated") ? "" : "completed task:"} <span className="text-accent-foreground">{item.task}</span>.
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        <Button variant="link" size="sm" className="mt-1 text-primary p-0 h-auto text-xs">View all activity</Button>
      </CardContent>
    </Card>
  );
}
    