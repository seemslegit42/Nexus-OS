// src/app/updates/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitMerge, Rocket, Sparkles, ListChecks, Eye } from 'lucide-react';
import Image from 'next/image';

const updates = [
  { version: '1.1.0 "Orion"', date: '2023-11-15', type: 'Feature Release', highlights: ['New Loom Studio Canvas Tools', 'Enhanced Agent Security Protocols', 'UI Performance Boosts'], status: 'Live' },
  { version: '1.0.5 "Nebula"', date: '2023-10-28', type: 'Patch', highlights: ['Fixed critical bug in Command Cauldron', 'Improved logging accuracy'], status: 'Live' },
  { version: '1.2.0 "Pulsar" (Upcoming)', date: 'Q1 2024', type: 'Major Update', highlights: ['Spatial Zone Management', 'Advanced Agent Collaboration', 'AI-Powered Module Suggestions'], status: 'Planned' },
];

function ChangelogContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Current NexOS Version: <Badge className="bg-primary text-primary-foreground">v1.1.0 "Orion"</Badge></p>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {updates.map((update, i) => (
          <Card key={i} className="bg-background/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-lg text-primary">{update.version}</CardTitle>
                <Badge variant={update.status === 'Live' ? 'default' : 'outline'}
                  className={update.status === 'Live' ? 'bg-green-500/80 text-white' : 'border-primary text-primary'}
                >
                  {update.status}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">{update.date} - {update.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm space-y-1">
                {update.highlights.map((hl, idx) => <li key={idx} className="text-foreground">{hl}</li>)}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function RoadmapPreviewContent(): ReactNode {
  return (
    <>
      <h3 className="font-headline text-md text-foreground mb-2">Upcoming Features:</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center"><Sparkles className="h-4 w-4 mr-2 text-yellow-500" /> Spatial Zone Management</li>
        <li className="flex items-center"><Sparkles className="h-4 w-4 mr-2 text-yellow-500" /> Advanced Agent Collaboration Tools</li>
        <li className="flex items-center"><Sparkles className="h-4 w-4 mr-2 text-yellow-500" /> AI-Powered Module Suggestions</li>
      </ul>
      <Image src="https://placehold.co/400x250.png" alt="Roadmap Visual" width={400} height={250} className="rounded-md my-4" data-ai-hint="timeline graph upcoming" />
      <Button variant="outline" className="w-full">
        <Eye className="mr-2 h-4 w-4" /> Test Upcoming UX Modules (Beta)
      </Button>
    </>
  );
}

function AgentReleaseLogsContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Updates and improvements to core agent capabilities.</p>
      <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center p-4">
        <Image src="https://placehold.co/800x300.png" alt="Agent Release Logs / Diffusion Graph" width={800} height={300} className="rounded-md" data-ai-hint="network graph changes" />
      </div>
      <p className="text-xs text-muted-foreground mt-2">Visual diffusion graph showing impact of agent updates.</p>
    </>
  );
}


export default function UpdatesPage() {
  const updatesPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'osChangelog',
      title: 'Latest OS Upgrades & Changelog',
      icon: <GitMerge className="w-5 h-5" />,
      content: <ChangelogContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 8, h: 14, minW: 4, minH: 8 },
        md: { x: 0, y: 0, w: 6, h: 14, minW: 4, minH: 8 },
        sm: { x: 0, y: 0, w: 6, h: 12, minW: 3, minH: 6 },
      },
    },
    {
      id: 'roadmapPreview',
      title: 'Roadmap & Feature Preview',
      icon: <Rocket className="w-5 h-5" />,
      content: <RoadmapPreviewContent />,
      defaultLayout: {
        lg: { x: 8, y: 0, w: 4, h: 14, minW: 3, minH: 8 },
        md: { x: 6, y: 0, w: 4, h: 14, minW: 3, minH: 8 },
        sm: { x: 0, y: 12, w: 6, h: 10, minW: 3, minH: 6 },
      },
    },
    {
      id: 'agentReleaseLogs',
      title: 'Agent Release Logs',
      icon: <ListChecks className="w-5 h-5" />,
      content: <AgentReleaseLogsContent />,
      defaultLayout: {
        lg: { x: 0, y: 14, w: 12, h: 8, minW: 6, minH: 5 },
        md: { x: 0, y: 14, w: 10, h: 8, minW: 5, minH: 5 },
        sm: { x: 0, y: 22, w: 6, h: 7, minW: 4, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={updatesPageZoneConfigs}
      className="flex-grow"
    />
  );
}
