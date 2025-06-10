
import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Blocks, Cpu, GitMerge, Lock, Filter } from 'lucide-react';
import Image from 'next/image';

const modules = [
  { name: 'Data Ingestion Pipeline', version: '1.2.0', category: 'Data Tools', agentsAttached: 2, status: 'Active', permissions: 'Admin, DataEngineers' },
  { name: 'Real-time Analytics Engine', version: '2.0.1', category: 'Analytics', agentsAttached: 1, status: 'Active', permissions: 'Analysts, Managers' },
  { name: 'Automated Reporting Service', version: '0.9.5', category: 'Reporting', agentsAttached: 0, status: 'Idle', permissions: 'All Users' },
  { name: 'Security Threat Detector', version: '3.1.0', category: 'Security', agentsAttached: 3, status: 'Critical', permissions: 'SecurityTeam' },
];

export default function ModulesPage() {
  return (
    <div className="flex-grow grid grid-cols-1 gap-4">
      <Zone title="Module Marketplace" icon={<Blocks className="w-5 h-5" />} className="flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-headline text-foreground">Available System Modules</h2>
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter Modules</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod, i) => (
            <Card key={i} className="bg-background/70 backdrop-blur-sm shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-primary">{mod.name}</CardTitle>
                  <Badge variant={mod.status === 'Active' ? 'default' : mod.status === 'Critical' ? 'destructive' : 'secondary'}
                    className={mod.status === 'Active' ? 'bg-green-500/80 text-white' : ''}
                  >
                    {mod.status}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">v{mod.version} - {mod.category}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 mr-2 text-muted-foreground" /> Agents Attached: {mod.agentsAttached}
                </div>
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-muted-foreground" /> Permissions: {mod.permissions}
                </div>
                <Image src={`https://placehold.co/300x150.png`} alt={`${mod.name} Execution Graph`} width={300} height={150} className="mt-2 rounded-md border" data-ai-hint="graph diagram"/>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  {mod.agentsAttached > 0 ? 'Manage Agents' : 'Attach Agent'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Zone>
    </div>
  );
}
