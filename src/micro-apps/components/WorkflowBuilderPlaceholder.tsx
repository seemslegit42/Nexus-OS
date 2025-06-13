
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow } from 'lucide-react';

const WorkflowBuilderPlaceholder: React.FC = () => {
  return (
    <Card className="w-full h-full border-none shadow-none bg-transparent p-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
            <Workflow className="mr-2 h-4 w-4 text-primary" /> Autopilot Workflow Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">This is the Autopilot Workflow Builder micro-application placeholder.</p>
        <p className="text-xs text-muted-foreground mt-1">The visual canvas for designing and managing agent workflows would be rendered here.</p>
      </CardContent>
    </Card>
  );
};
export default WorkflowBuilderPlaceholder;
