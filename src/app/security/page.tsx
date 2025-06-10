import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, MapPin, Fingerprint, GitFork, Edit, Power } from 'lucide-react';
import Image from 'next/image';

export default function SecurityCenterPage() {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Zone title="Real-time Session Map" icon={<MapPin className="w-5 h-5" />} className="lg:col-span-2">
        <div className="h-72 bg-muted/30 rounded-md">
          <Image src="https://placehold.co/800x400.png" alt="Session Map" width={800} height={400} className="object-cover h-full w-full rounded-md" data-ai-hint="world map connections" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Active sessions: 125 | IPs from: 15 countries</p>
      </Zone>

      <Zone title="Behavioral Fingerprint Analysis" icon={<Fingerprint className="w-5 h-5" />}>
        <div className="h-72 bg-muted/30 rounded-md flex items-center justify-center p-2">
          <Image src="https://placehold.co/400x300.png" alt="Behavioral Fingerprint" width={400} height={300} className="rounded-md" data-ai-hint="activity graph anomaly" />
        </div>
         <p className="text-xs text-muted-foreground mt-1">Anomalies detected: 2</p>
      </Zone>

      <Zone title="Visual Trust Graph" icon={<GitFork className="w-5 h-5" />} className="lg:col-span-2">
        <div className="h-72 bg-muted/30 rounded-md flex items-center justify-center p-2">
          <Image src="https://placehold.co/800x400.png" alt="Trust Graph" width={800} height={400} className="object-cover h-full w-full rounded-md" data-ai-hint="network graph relationships" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Agent trust relationships and flagged anomalies.</p>
      </Zone>

      <Zone title="Security Protocol Editor" icon={<Edit className="w-5 h-5" />}>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Define agent behavior thresholds and system responses.</p>
          <Card className="bg-background/50">
            <CardHeader><CardTitle className="text-base font-headline">Login Attempt Threshold</CardTitle></CardHeader>
            <CardContent><p className="text-sm">Max attempts: 5. Action: Lock account for 30 mins.</p></CardContent>
          </Card>
           <Card className="bg-background/50">
            <CardHeader><CardTitle className="text-base font-headline">Data Exfiltration Alert</CardTitle></CardHeader>
            <CardContent><p className="text-sm">Threshold: >1GB/hr. Action: Notify admin, suspend agent.</p></CardContent>
          </Card>
          <Button variant="outline" className="w-full">Edit Protocols</Button>
        </div>
      </Zone>
      
      <Zone title="Emergency Controls" icon={<ShieldCheck className="w-5 h-5 text-destructive" />} className="lg:col-span-3">
        <div className="flex flex-col items-center justify-center p-4">
          <p className="text-lg font-semibold text-foreground mb-2 font-headline">System Lockdown</p>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Initiate an immediate system-wide lockdown in case of a critical security breach. <br/>This will restrict all non-essential agent activities and user access.
          </p>
          <Button variant="destructive" size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            <Power className="mr-2 h-5 w-5" /> Initiate Lockdown
          </Button>
        </div>
      </Zone>
    </div>
  );
}
