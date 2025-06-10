import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Cpu, PlusCircle, Search, Eye, Settings2, Trash2 } from 'lucide-react';
import Image from 'next/image';

const agents = [
  { id: 'agt_001', name: 'OptimizerPrime', status: 'Active', role: 'Code Optimizer', training: 'Python, JS', scope: 'Project Alpha', lastActivity: '5m ago' },
  { id: 'agt_002', name: 'DataMinerX', status: 'Idle', role: 'Data Analyst', training: 'SQL, R', scope: 'Sales Data Q3', lastActivity: '2h ago' },
  { id: 'agt_003', name: 'SecureGuard', status: 'Error', role: 'Security Monitor', training: 'Network Protocols', scope: 'All Systems', lastActivity: '10s ago' },
  { id: 'agt_004', name: 'ContentCreatorAI', status: 'Active', role: 'Writer', training: 'NLP Models', scope: 'Marketing Blog', lastActivity: '30m ago' },
];

export default function AgentConsolePage() {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Zone title="Agent Overview" icon={<Cpu className="w-5 h-5" />} className="lg:col-span-3">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search agents..." className="pl-10 bg-background border-border focus:ring-primary" />
          </div>
          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Spawn New Agent
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium text-foreground">{agent.name}</TableCell>
                  <TableCell>
                    <Badge variant={agent.status === 'Active' ? 'default' : agent.status === 'Error' ? 'destructive' : 'secondary'}
                      className={agent.status === 'Active' ? 'bg-green-500/80 text-white' : agent.status === 'Error' ? 'bg-destructive text-destructive-foreground' : ''}
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{agent.role}</TableCell>
                  <TableCell className="text-muted-foreground">{agent.scope}</TableCell>
                  <TableCell className="text-muted-foreground">{agent.lastActivity}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Settings2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Zone>

      <Zone title="Agent Configuration" icon={<Settings2 className="w-5 h-5" />} className="lg:col-span-1">
        <div className="p-4 space-y-4">
          <h3 className="text-md font-semibold font-headline text-foreground">Configure: OptimizerPrime</h3>
           <Image src="https://placehold.co/400x300.png" alt="Agent Config" width={400} height={300} className="rounded-md" data-ai-hint="settings form interface" />
          <p className="text-sm text-muted-foreground">Select an agent from the list to configure its parameters, training data, and scope.</p>
          <Button className="w-full" disabled>Save Changes</Button>
        </div>
      </Zone>
      
      <Zone title="Live Agent Behavior ('Shadow Mode')" icon={<Eye className="w-5 h-5" />} className="lg:col-span-2">
        <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center p-4">
          <Image src="https://placehold.co/600x300.png" alt="Shadow Mode Visual" width={600} height={300} className="rounded-md" data-ai-hint="data stream activity" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Real-time visualization of selected agent's actions and decision-making process.</p>
      </Zone>
    </div>
  );
}
