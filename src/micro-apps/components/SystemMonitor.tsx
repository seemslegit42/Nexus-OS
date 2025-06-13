
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const SystemMonitor: React.FC = () => {
  return (
    <Card className="w-full h-full border-none shadow-none bg-transparent p-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
            <Activity className="mr-2 h-4 w-4 text-primary" /> System Monitor App
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">This is the System Monitor micro-application.</p>
        <p className="text-xs text-muted-foreground mt-1">System metrics, logs, and status dashboards would be displayed here.</p>
      </CardContent>
    </Card>
  );
};
export default SystemMonitor;
