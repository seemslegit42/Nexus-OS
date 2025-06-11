
// src/app/files/page.tsx
'use client';

import type { ReactNode } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileArchive, Search, UploadCloud, FileText, Cpu, History, Eye, Settings, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const files = [
  { name: 'Q3_Sales_Report.pdf', type: 'Document', size: '2.5MB', lastModified: '2023-10-25', version: 3, agentAttached: 'DataMinerX' },
  { name: 'agent_onboarding_script.json', type: 'Script', size: '15KB', lastModified: '2023-10-24', version: 1, agentAttached: null },
  { name: 'website_hero_image.png', type: 'Image', size: '1.2MB', lastModified: '2023-10-22', version: 5, agentAttached: 'ContentCreatorAI' },
  { name: 'user_feedback_summary.txt', type: 'Text', size: '500KB', lastModified: '2023-10-20', version: 2, agentAttached: null },
];

function FileBrowserContent(): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3 border-b border-border/60">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search files..." className="pl-9 bg-background/70 border-input focus:ring-primary h-9 text-sm" />
            </div>
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-sm">
            <UploadCloud className="mr-2 h-4 w-4" /> Upload File
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
        <TooltipProvider>
            <Table>
            <TableHeader>
                <TableRow className="border-border/60">
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Size</TableHead>
                <TableHead className="text-xs">Last Modified</TableHead>
                <TableHead className="text-xs">Agent</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {files.map((file, i) => (
                <TableRow key={i} className="border-border/60 hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground flex items-center text-sm py-2">
                    <FileText className="h-4 w-4 mr-2 text-primary flex-shrink-0" /> {file.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{file.type}</TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{file.size}</TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{file.lastModified}</TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{file.agentAttached || 'N/A'}</TableCell>
                    <TableCell className="text-right py-2">
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Preview</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><History className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Version History</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><Cpu className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Manage Agent</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Settings</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TooltipProvider>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function FilePreviewContent(): ReactNode {
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
        <CardContent className="p-2 md:p-3 h-full">
            <div className="h-full bg-muted/20 rounded-md flex items-center justify-center p-4 border border-dashed border-border/50">
                <Image src="https://placehold.co/600x300.png?text=Select+a+file+to+preview" alt="File Preview" width={600} height={300} className="rounded-md object-contain max-h-full opacity-70" data-ai-hint="document preview interface" />
            </div>
        </CardContent>
    </Card>
  );
}

function VersionHistoryAgentAttachmentsContent(): ReactNode {
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
        <CardHeader className="p-2 md:p-3">
            <CardTitle className="text-md font-semibold font-headline text-foreground">File Details</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-3 space-y-3">
            <p className="text-sm text-muted-foreground mb-1">Select a file to see its version history and manage agent attachments.</p>
            <Card className="bg-card/50 border-border/50">
                <CardHeader className="p-2"><CardTitle className="text-sm">Q3_Sales_Report.pdf - <span className="text-primary">Version 3</span></CardTitle></CardHeader>
                <CardContent className="p-2 text-xs">
                    <p className="text-muted-foreground">Modified by User Alpha on 2023-10-25</p>
                    <p className="mt-1">Attached Agent: <span className="text-accent-foreground font-medium">DataMinerX</span></p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs text-destructive hover:text-destructive/80 mt-0.5">Detach Agent</Button>
                </CardContent>
            </Card>
        </CardContent>
    </Card>
  );
}

export default function FileVaultPage() {
  const fileVaultPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'fileBrowser',
      title: 'File Browser',
      icon: <FileArchive className="w-4 h-4" />,
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
      icon: <Eye className="w-4 h-4" />,
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
      icon: <History className="w-4 h-4" />,
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
      className="flex-grow p-1 md:p-2"
    />
  );
}
