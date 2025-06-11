
// src/app/files/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileArchive, Search, UploadCloud, FileText, Cpu, History, Eye } from 'lucide-react';
import Image from 'next/image';

const files = [
  { name: 'Q3_Sales_Report.pdf', type: 'Document', size: '2.5MB', lastModified: '2023-10-25', version: 3, agentAttached: 'DataMinerX' },
  { name: 'agent_onboarding_script.json', type: 'Script', size: '15KB', lastModified: '2023-10-24', version: 1, agentAttached: null },
  { name: 'website_hero_image.png', type: 'Image', size: '1.2MB', lastModified: '2023-10-22', version: 5, agentAttached: 'ContentCreatorAI' },
  { name: 'user_feedback_summary.txt', type: 'Text', size: '500KB', lastModified: '2023-10-20', version: 2, agentAttached: null },
];

function FileBrowserContent(): ReactNode {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search files..." className="pl-10 bg-background border-input focus:ring-primary h-9 text-sm" />
        </div>
        <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm">
          <UploadCloud className="mr-2 h-4 w-4" /> Upload File
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-foreground flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" /> {file.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{file.type}</TableCell>
                <TableCell className="text-muted-foreground">{file.size}</TableCell>
                <TableCell className="text-muted-foreground">{file.lastModified}</TableCell>
                <TableCell className="text-muted-foreground">{file.agentAttached || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><History className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Cpu className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function FilePreviewContent(): ReactNode {
  return (
    <div className="h-full bg-muted/30 rounded-md flex items-center justify-center p-4">
      <Image src="https://placehold.co/600x300.png?text=Select+a+file+to+preview" alt="File Preview" width={600} height={300} className="rounded-md object-contain max-h-full" data-ai-hint="document preview interface" />
    </div>
  );
}

function VersionHistoryAgentAttachmentsContent(): ReactNode {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">Select a file to see its version history and manage agent attachments.</p>
      <div className="space-y-3">
        <div className="p-2 bg-background/50 rounded-md">
          <p className="font-medium text-sm">Q3_Sales_Report.pdf - Version 3</p>
          <p className="text-xs text-muted-foreground">Modified by User Alpha on 2023-10-25</p>
        </div>
        <div className="p-2 bg-background/50 rounded-md">
          <p className="font-medium text-sm">Attached Agent: <span className="text-primary">DataMinerX</span></p>
          <Button variant="link" size="sm" className="p-0 h-auto text-xs text-destructive">Detach Agent</Button>
        </div>
      </div>
    </>
  );
}

export default function FileVaultPage() {
  const fileVaultPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'fileBrowser',
      title: 'File Browser',
      icon: <FileArchive className="w-5 h-5" />,
      content: <FileBrowserContent />,
      defaultLayout: {
        lg: { x: 0, y: 0, w: 12, h: 10, minW: 6, minH: 6 },
        md: { x: 0, y: 0, w: 10, h: 10, minW: 5, minH: 6 },
        sm: { x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 5 },
      },
    },
    {
      id: 'filePreview',
      title: 'File Preview',
      icon: <Eye className="w-5 h-5" />,
      content: <FilePreviewContent />,
      defaultLayout: {
        lg: { x: 0, y: 10, w: 8, h: 10, minW: 4, minH: 6 },
        md: { x: 0, y: 10, w: 6, h: 9, minW: 3, minH: 5 },
        sm: { x: 0, y: 9, w: 6, h: 8, minW: 3, minH: 4 },
      },
    },
    {
      id: 'versionHistoryAgentAttachments',
      title: 'Version History & Agent Attachments',
      icon: <History className="w-5 h-5" />,
      content: <VersionHistoryAgentAttachmentsContent />,
      defaultLayout: {
        lg: { x: 8, y: 10, w: 4, h: 10, minW: 3, minH: 6 },
        md: { x: 6, y: 10, w: 4, h: 9, minW: 3, minH: 5 },
        sm: { x: 0, y: 17, w: 6, h: 8, minW: 3, minH: 4 },
      },
    }
  ];

  return (
    <WorkspaceGrid
      zoneConfigs={fileVaultPageZoneConfigs}
      className="flex-grow"
    />
  );
}
