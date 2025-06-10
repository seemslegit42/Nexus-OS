import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, ShieldQuestion, Columns, UserCheck } from 'lucide-react';
import Image from 'next/image';

const roles = ['Admin', 'Developer', 'Analyst', 'AgentManager'];
const modules = ['AuthService', 'BillingModule', 'LoomStudio', 'AgentConsole'];
const zones = ['Dashboard', 'Settings', 'SensitiveDataView'];

// Simplified permission matrix
const permissionsData = roles.map(role => ({
  role,
  modulePermissions: modules.map(module => Math.random() > 0.5), // Random boolean
  zonePermissions: zones.map(zone => Math.random() > 0.3), // Random boolean
}));

export default function PermissionsPage() {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Zone title="Visual Matrix: Roles × Modules × Zones" icon={<Columns className="w-5 h-5" />} className="lg:col-span-2">
        <p className="text-sm text-muted-foreground mb-2">Overview of access rights across the system.</p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                {modules.map(mod => <TableHead key={mod} className="text-center">{mod}</TableHead>)}
                {zones.map(zone => <TableHead key={zone} className="text-center">{zone} (Zone)</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionsData.map(row => (
                <TableRow key={row.role}>
                  <TableCell className="font-medium text-foreground">{row.role}</TableCell>
                  {row.modulePermissions.map((perm, i) => (
                    <TableCell key={`mod-${i}`} className="text-center">
                      <Checkbox checked={perm} aria-label={`${row.role} access to ${modules[i]}`} />
                    </TableCell>
                  ))}
                  {row.zonePermissions.map((perm, i) => (
                    <TableCell key={`zone-${i}`} className="text-center">
                      <Checkbox checked={perm} aria-label={`${row.role} access to ${zones[i]}`} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button variant="outline" className="mt-4">Edit Permissions</Button>
      </Zone>

      <Zone title="Trace Access" icon={<UserCheck className="w-5 h-5" />}>
        <p className="text-sm text-muted-foreground mb-2">Investigate who has access to what and why.</p>
        <Image src="https://placehold.co/600x300.png" alt="Access Trace Visual" width={600} height={300} className="rounded-md" data-ai-hint="graph relationship diagram"/>
        <Button variant="outline" className="w-full mt-4">Start Trace</Button>
      </Zone>

      <Zone title="Simulate Breach / Escalation" icon={<ShieldQuestion className="w-5 h-5" />}>
        <p className="text-sm text-muted-foreground mb-2">Test security posture by simulating scenarios.</p>
         <Image src="https://placehold.co/600x300.png" alt="Breach Simulation" width={600} height={300} className="rounded-md" data-ai-hint="security test scenario"/>
        <div className="flex gap-2 mt-4">
          <Button variant="destructive" className="flex-1">Simulate Breach</Button>
          <Button variant="outline" className="flex-1">Simulate Escalation</Button>
        </div>
      </Zone>
      
      <Zone title="Compare Agents/Users (Split View)" icon={<Users className="w-5 h-5" />} className="lg:col-span-2">
         <p className="text-sm text-muted-foreground mb-2">Side-by-side comparison of permissions for different entities.</p>
         <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center p-4">
           <Image src="https://placehold.co/800x300.png" alt="Split View Comparison" width={800} height={300} className="rounded-md" data-ai-hint="comparison table interface"/>
         </div>
      </Zone>
    </div>
  );
}
