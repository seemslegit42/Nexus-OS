import { Zone } from '@/components/core/zone';
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

export default function FileVaultPage() {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Zone title="File Browser" icon={<FileArchive className="w-5 h-5" />} className="lg:col-span-3">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search files..." className="pl-10 bg-background border-input focus:ring-primary" />
          </div>
          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
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
      </Zone>

      <Zone title="File Preview" icon={<Eye className="w-5 h-5" />} className="lg:col-span-2">
        <div className="h-72 bg-muted/30 rounded-md flex items-center justify-center p-4">
           <Image src="https://placehold.co/600x300.png?text=Select+a+file+to+preview" alt="File Preview" width={600} height={300} className="rounded-md object-contain" data-ai-hint="document preview interface"/>
        </div>
      </Zone>

      <Zone title="Version History & Agent Attachments" icon={<History className="w-5 h-5" />}>
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
      </Zone>
    </div>
  );
}
