
// src/app/files/page.tsx
'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { WorkspaceGrid, type ZoneConfig } from '@/components/core/workspace-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileArchive, Search, UploadCloud, FileText, Cpu, History, Eye, Settings, Trash2, FileImage, FileJson, FileCode, Info } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FileItem {
  id: string;
  name: string;
  type: string; // e.g., 'Document', 'Script', 'Image' - derived from name or actual type
  size: string;
  lastModified: string;
  version: number;
  agentAttached: string | null;
  dataAiHint?: string;
}

const initialFiles: FileItem[] = [
  { id: 'file_1', name: 'Q3_Sales_Report.pdf', type: 'Document', size: '2.5MB', lastModified: '2023-10-25', version: 3, agentAttached: 'DataMinerX', dataAiHint: 'sales report document' },
  { id: 'file_2', name: 'agent_onboarding_script.json', type: 'Script', size: '15KB', lastModified: '2023-10-24', version: 1, agentAttached: null, dataAiHint: 'json script code' },
  { id: 'file_3', name: 'website_hero_image.png', type: 'Image', size: '1.2MB', lastModified: '2023-10-22', version: 5, agentAttached: 'ContentCreatorAI', dataAiHint: 'website hero image' },
  { id: 'file_4', name: 'user_feedback_summary.txt', type: 'Text', size: '500KB', lastModified: '2023-10-20', version: 2, agentAttached: null, dataAiHint: 'text document summary' },
  { id: 'file_5', name: 'archive_2023.zip', type: 'Archive', size: '150MB', lastModified: '2023-10-19', version: 1, agentAttached: null, dataAiHint: 'zip archive folder' },
  { id: 'file_6', name: 'main_logic.py', type: 'Code', size: '30KB', lastModified: '2023-10-18', version: 7, agentAttached: 'OptimizerPrime', dataAiHint: 'python code script' },
];

const getFileIcon = (fileName: string): ReactNode => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <FileImage className="h-4 w-4 mr-2 text-primary flex-shrink-0" />;
    case 'json':
      return <FileJson className="h-4 w-4 mr-2 text-primary flex-shrink-0" />;
    case 'zip':
    case 'tar':
    case 'gz':
      return <FileArchive className="h-4 w-4 mr-2 text-primary flex-shrink-0" />;
    case 'js':
    case 'ts':
    case 'py':
    case 'go':
    case 'java':
      return <FileCode className="h-4 w-4 mr-2 text-primary flex-shrink-0" />;
    default:
      return <FileText className="h-4 w-4 mr-2 text-primary flex-shrink-0" />;
  }
};

function FileBrowserContent({
  files,
  onSelectFile,
  onDeleteFile,
  onManageAgent,
  onSettings,
}: {
  files: FileItem[];
  onSelectFile: (file: FileItem) => void;
  onDeleteFile: (fileId: string) => void;
  onManageAgent: (file: FileItem) => void;
  onSettings: (file: FileItem) => void;
}): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3 border-b border-border/60">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search files..." className="pl-9 bg-input border-input focus:ring-primary h-9 text-sm" />
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
                {files.map((file) => (
                  <TableRow key={file.id} className="border-border/60 hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground flex items-center text-sm py-2">
                      {getFileIcon(file.name)} {file.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{file.type}</TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{file.size}</TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{file.lastModified}</TableCell>
                    <TableCell className="text-muted-foreground text-xs py-2">{file.agentAttached || 'N/A'}</TableCell>
                    <TableCell className="text-right py-2">
                      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onSelectFile(file)}><Eye className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Preview File</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onSelectFile(file)}><History className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Version History</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onManageAgent(file)}><Cpu className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Manage Agent</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onSettings(file)}><Settings className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>File Settings</TooltipContent></Tooltip>
                      <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => onDeleteFile(file.id)}><Trash2 className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Delete File</TooltipContent></Tooltip>
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

function FilePreviewContent({ selectedFile }: { selectedFile: FileItem | null }): ReactNode {
  return (
    <Card className="h-full bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">
          {selectedFile ? `Preview: ${selectedFile.name}` : 'File Preview'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:p-3 h-full">
        <div className="h-full bg-muted/20 rounded-md flex flex-col items-center justify-center p-4 border border-dashed border-border/50">
          {selectedFile ? (
            <>
              <Image 
                src={`https://placehold.co/600x300.png?text=${selectedFile.type}+Preview`} 
                alt={`${selectedFile.name} preview`} 
                width={600} 
                height={300} 
                className="rounded-md object-contain max-h-[70%] opacity-70 border border-border/60" 
                data-ai-hint={selectedFile.dataAiHint || 'file preview placeholder'} 
              />
              <p className="text-sm text-muted-foreground mt-2">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{selectedFile.type} - {selectedFile.size}</p>
            </>
          ) : (
            <>
              <Info className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Select a file from the browser to preview its content here.</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function VersionHistoryAgentAttachmentsContent({ selectedFile }: { selectedFile: FileItem | null }): ReactNode {
  return (
    <Card className="h-full flex flex-col bg-transparent border-none shadow-none">
      <CardHeader className="p-2 md:p-3">
        <CardTitle className="text-md font-semibold font-headline text-foreground">
          {selectedFile ? `Details for: ${selectedFile.name}` : 'File Details'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:p-3 space-y-3 flex-grow overflow-y-auto">
        {selectedFile ? (
          <>
            <Card className="bg-card border-border/50">
              <CardHeader className="p-2"><CardTitle className="text-sm">Version History (Simulated)</CardTitle></CardHeader>
              <CardContent className="p-2 text-xs space-y-1">
                <p><span className="text-primary">Version {selectedFile.version}</span> - Modified by User Alpha on {selectedFile.lastModified}</p>
                {selectedFile.version > 1 && <p><span className="text-muted-foreground">Version {selectedFile.version - 1}</span> - Modified by System on 2023-10-20</p>}
                {selectedFile.version > 2 && <p><span className="text-muted-foreground">Version {selectedFile.version - 2}</span> - Created by User Bravo on 2023-10-10</p>}
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardHeader className="p-2"><CardTitle className="text-sm">Agent Attachments</CardTitle></CardHeader>
              <CardContent className="p-2 text-xs">
                {selectedFile.agentAttached ? (
                  <>
                    <p>Attached Agent: <span className="text-accent-foreground font-medium">{selectedFile.agentAttached}</span></p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs text-destructive hover:text-destructive/80 mt-0.5" onClick={() => console.log(`Detach agent from ${selectedFile.name}`)}>Detach Agent</Button>
                  </>
                ) : (
                  <p className="text-muted-foreground">No agent attached.</p>
                )}
                 <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary hover:text-primary/80 mt-1" onClick={() => console.log(`Manage agent for ${selectedFile.name}`)}>Attach/Manage Agent</Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-8">
            <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Select a file to view its version history and agent attachments.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function FileVaultPage() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile(null);
    }
    console.log(`Delete file: ${fileId}`);
  };

  const handleManageAgent = (file: FileItem) => {
    console.log(`Manage agent for file: ${file.name}`);
  };

  const handleSettings = (file: FileItem) => {
    console.log(`Open settings for file: ${file.name}`);
  };

  const fileVaultPageZoneConfigs: ZoneConfig[] = [
    {
      id: 'fileBrowser',
      title: 'File Browser',
      icon: <FileArchive className="w-4 h-4" />,
      content: <FileBrowserContent files={files} onSelectFile={handleSelectFile} onDeleteFile={handleDeleteFile} onManageAgent={handleManageAgent} onSettings={handleSettings} />,
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
      content: <FilePreviewContent selectedFile={selectedFile} />,
      defaultLayout: {
        lg: { x: 0, y: 10, w: 8, h: 10, minW: 4, minH: 6 },
        md: { x: 0, y: 10, w: 6, h: 9, minW: 3, minH: 5 },
        sm: { x: 0, y: 9, w: 6, h: 8, minW: 3, minH: 4 },
      },
    },
    {
      id: 'versionHistoryAgentAttachments',
      title: 'Details & History',
      icon: <History className="w-4 h-4" />,
      content: <VersionHistoryAgentAttachmentsContent selectedFile={selectedFile} />,
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
