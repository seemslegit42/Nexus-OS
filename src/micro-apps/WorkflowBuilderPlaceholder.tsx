import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlowArrow as Workflow } from '@phosphor-icons/react';

const WorkflowBuilderPlaceholder: React.FC = () => {
  return (
    <Card className="h-full w-full border-none bg-transparent p-2 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
          <Workflow className="mr-2 h-4 w-4 text-primary" /> Autopilot Workflow
          Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          This is the Autopilot Workflow Builder micro-application placeholder.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          The visual canvas for designing and managing agent workflows would be
          rendered here.
        </p>
      </CardContent>
    </Card>
  );
};
export default WorkflowBuilderPlaceholder;
