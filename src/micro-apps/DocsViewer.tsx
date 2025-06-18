import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from '@phosphor-icons/react';

const DocsViewer: React.FC = () => {
  return (
    <Card className="h-full w-full border-none bg-transparent p-2 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
          <BookOpen className="mr-2 h-4 w-4 text-primary" /> Document Viewer App
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          This is the Document Viewer micro-application.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Content for documents would be displayed here dynamically.
        </p>
      </CardContent>
    </Card>
  );
};
export default DocsViewer;
